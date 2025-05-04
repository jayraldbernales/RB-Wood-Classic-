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
        
        // Verify webhook signature
        if (!$this->paymongoService->verifyWebhookSignature($request)) {
            Log::error('Invalid webhook signature');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $eventType = $payload['data']['attributes']['type'];
        
        if ($eventType === 'checkout_session.completed') {
            $checkoutSession = $payload['data']['attributes'];
            $paymentIntentId = $checkoutSession['payments'][0]['id'];
            $metadata = $checkoutSession['metadata'] ?? [];
            
            $this->processPayment($paymentIntentId, $metadata);
        }
        
        // Handle other event types as needed

        return response()->json(['status' => 'success']);
    }

    protected function handlePaymentPaid(Request $request)
    {
        $payment = $request->input('data.attributes.data');
        $paymentIntentId = $payment['attributes']['payment_intent_id'];
        $metadata = $payment['attributes']['metadata'] ?? [];

        // Process your payment here
        $this->processPayment($paymentIntentId, $metadata);

        return response()->json(['status' => 'success']);
    }

    protected function handleCheckoutSessionCompleted(Request $request)
    {
        $checkoutSession = $request->input('data.attributes.data');
        $paymentIntentId = $checkoutSession['attributes']['payments'][0]['id'];
        $metadata = $checkoutSession['attributes']['metadata'] ?? [];

        // Process your payment here
        $this->processPayment($paymentIntentId, $metadata);

        return response()->json(['status' => 'success']);
    }

    protected function processPayment($paymentIntentId, $metadata)
    {
        try {
            $paymentType = $metadata['payment_type'] ?? 'full';

            // Default to pending_payment
            $paymentStatus = 'pending_payment';
            $orderStatus = 'pending';

            // Check payment status from PayMongo (assumed succeeded if this method is called)
            // Adjust payment status based on payment type
            if ($paymentType === 'full') {
                $paymentStatus = 'paid';
                $orderStatus = 'paid';
            } elseif ($paymentType === 'downpayment') {
                $paymentStatus = 'partially_paid';
                $orderStatus = 'processing';
            }

            $order = Order::firstOrCreate(
                ['payment_intent_id' => $paymentIntentId],
                [
                    'user_id' => $metadata['user_id'] ?? null,
                    'amount' => $metadata['amount'] ?? 0,
                    'payment_type' => $paymentType,
                    'payment_status' => $paymentStatus,
                    'status' => $orderStatus,
                ]
            );

            $order->update([
                'payment_status' => $paymentStatus,
                'status' => $orderStatus,
            ]);

            event(new PaymentProcessed($order));

            Log::info("Payment processed successfully", [
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