<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Services\PayMongoService;
use App\Models\Order;
use App\Events\PaymentProcessed;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    protected $paymongoService;

    public function __construct(PayMongoService $paymongoService)
    {
        $this->paymongoService = $paymongoService;
    }

    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:100', // Minimum 1 peso (100 cents)
            'description' => 'required|string|max:255',
            'payment_method_allowed' => 'sometimes|array',
            'payment_method_allowed.*' => 'in:card,gcash,grab_pay,paymaya',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 422);
        }

        $paymentIntent = $this->paymongoService->createPaymentIntent(
            $request->amount,
            $request->description,
            $request->payment_method_allowed ?? ['card']
        );

        if (!$paymentIntent) {
            return response()->json([
                'error' => 'Failed to create payment intent'
            ], 500);
        }

        return response()->json([
            'data' => $paymentIntent,
            'client_key' => $paymentIntent['attributes']['client_key']
        ]);
    }

    public function createCheckout(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100', // in cents
            'description' => 'required|string|max:255',
            'payment_method_type' => 'required|in:gcash,grab_pay,paymaya',
            'metadata' => 'sometimes|array'
        ]);

        try {
            $checkoutSession = $this->paymongoService->createCheckoutSession(
                $validated['amount'],
                $validated['description'],
                $validated['payment_method_type'],
                $validated['metadata'] ?? []
            );

            if (!$checkoutSession) {
                return response()->json(['error' => 'Failed to create checkout session'], 500);
            }

            return response()->json([
                'data' => $checkoutSession,
                'checkout_url' => $checkoutSession['attributes']['checkout_url']
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createCheckoutSession(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:100',
            'description' => 'required|string|max:255',
            'payment_method_type' => 'required|in:gcash,grab_pay,paymaya',
            'metadata' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 422);
        }

        $checkoutSession = $this->paymongoService->createCheckoutSession(
            $request->amount,
            $request->description,
            $request->payment_method_type,
            $request->metadata ?? []
        );

        if (!$checkoutSession) {
            return response()->json([
                'error' => 'Failed to create checkout session'
            ], 500);
        }

        return response()->json([
            'data' => $checkoutSession
        ]);
    }


    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        // Add detailed logging
        Log::info('Webhook received', ['payload' => $payload]);

        if (!$this->paymongoService->verifyWebhookSignature($request)) {
            Log::error('Invalid webhook signature', ['headers' => $request->headers->all()]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $eventType = $payload['data']['attributes']['type'];
        Log::info("Processing event: $eventType");

        switch ($eventType) {
            case 'payment.paid':
                return $this->handlePaymentPaid($payload);
                
            case 'checkout_session.completed':
                return $this->handleCheckoutSessionCompleted($payload);
                
            default:
                Log::info("Unhandled event type", ['type' => $eventType]);
                return response()->json(['status' => 'ignored']);
        }
    }

    protected function handlePaymentPaid($payload)
    {
        try {
            $payment = $payload['data']['attributes']['data'];
            $paymentIntentId = $payment['attributes']['payment_intent_id'];
            $metadata = $payment['attributes']['metadata'] ?? [];
            
            Log::info('Processing payment.paid event', [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);

            return $this->processPayment($paymentIntentId, $metadata);
            
        } catch (\Exception $e) {
            Log::error('Error handling payment.paid', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    protected function handleCheckoutSessionCompleted($payload)
    {
        try {
            $checkoutSession = $payload['data']['attributes']['data'];
            $paymentIntentId = $checkoutSession['attributes']['payments'][0]['id'];
            $metadata = $checkoutSession['attributes']['metadata'] ?? [];
            
            Log::info('Processing checkout_session.completed', [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);

            return $this->processPayment($paymentIntentId, $metadata);
            
        } catch (\Exception $e) {
            Log::error('Error handling checkout_session.completed', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    protected function processPayment($paymentIntentId, $metadata)
    {
        try {
            // Retrieve the payment intent to verify status
            $paymentIntent = $this->paymongoService->retrievePaymentIntent($paymentIntentId);
            
            if (!$paymentIntent) {
                Log::error("Payment intent not found", ['payment_intent_id' => $paymentIntentId]);
                return;
            }
            
            $status = $paymentIntent['attributes']['status'] ?? null;
            $payments = $paymentIntent['attributes']['payments'] ?? [];
            
            // Only proceed if payment is actually successful
            if ($status !== 'succeeded' && !collect($payments)->contains(fn($p) => $p['attributes']['status'] === 'paid')) {
                Log::warning("Payment not succeeded", ['status' => $status]);
                return;
            }
            
            $order = Order::where('payment_intent_id', $paymentIntentId)->first();
        
            if (!$order) {
                Log::error("Order not found for payment intent", ['payment_intent_id' => $paymentIntentId]);
                return;
            }

            $paymentType = $metadata['payment_type'] ?? 'full';
            
            $order->update([
                'payment_status' => 'paid',
                'status' => $paymentType === 'full' ? 'processing' : 'partially_paid',
                'paid_at' => now()
            ]);

            event(new PaymentProcessed($order));

            Log::info("Payment processed", [
                'order_id' => $order->id,
                'payment_intent_id' => $paymentIntentId
            ]);
        } catch (\Exception $e) {
            Log::error("Error processing payment", [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
                'metadata' => $metadata
            ]);
        }
    }


}
