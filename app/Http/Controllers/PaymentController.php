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


    protected function handleCheckoutSessionCompleted($payload)
    {
        try {
            $checkoutSession = $payload['data']['attributes']['data'];
            
            // Get payment intent ID from the FIRST payment object
            $paymentIntentId = $checkoutSession['attributes']['payments'][0]['attributes']['payment_intent_id'];
            
            $metadata = $checkoutSession['attributes']['metadata'] ?? [];
            
            Log::info('Processing checkout_session.completed', [
                'payment_intent_id' => $paymentIntentId,
                'full_payload' => $checkoutSession // For debugging
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

    protected function handlePaymentPaid($payload)
    {
        try {
            Log::info('Full payment.paid payload', ['payload' => $payload]);
            
            // Extract payment intent ID from different possible locations
            $paymentIntentId = $payload['data']['attributes']['data']['attributes']['payment_intent_id'] 
                ?? $payload['data']['relationships']['payment_intent']['data']['id']
                ?? $payload['data']['attributes']['payment_intent_id']
                ?? null;
                
            // Deep metadata extraction
            $metadata = $payload['data']['attributes']['data']['attributes']['metadata'] 
                ?? $payload['data']['attributes']['metadata']
                ?? ($payload['data']['attributes']['data']['metadata'] ?? []);
    
            if (!$paymentIntentId) {
                Log::error('Payment intent ID not found in webhook payload');
                return response()->json(['error' => 'Payment intent ID missing'], 400);
            }
    
            Log::info('Processing payment.paid event', [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);
    
            return $this->processPayment($paymentIntentId, $metadata);
            
        } catch (\Exception $e) {
            Log::error('Error handling payment.paid', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $payload
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }
    
    protected function processPayment($paymentIntentId, $metadata)
    {
        try {
            $verification = $this->paymongoService->verifyPayment($paymentIntentId);
            
            if (!$verification || !$verification['paid']) {
                Log::warning("Payment not verified as paid", [
                    'payment_intent_id' => $paymentIntentId,
                    'verification' => $verification
                ]);
                return response()->json(['status' => 'not_paid']);
            }
    
            // Try multiple ways to find the order
            $order = Order::where('paymongo_payment_intent_id', $paymentIntentId)
                        ->orWhere('id', $metadata['order_id'] ?? null)
                        ->first();
    
            if (!$order) {
                Log::error("Order not found", [
                    'payment_intent_id' => $paymentIntentId,
                    'metadata' => $metadata,
                    'possible_orders' => Order::where('payment_status', 'pending_payment')
                        ->latest()
                        ->limit(5)
                        ->get()
                        ->toArray()
                ]);
                return response()->json(['error' => 'Order not found'], 404);
            }
    
            $updateData = [
                'payment_status' => 'paid',
                'status' => 'processing',
                'paymongo_payment_method_id' => $verification['payment_method'] ?? null
            ];
    
            $order->update($updateData);
    
            Log::info("Order {$order->id} marked as paid", [
                'method' => $verification['payment_method'],
                'changes' => $updateData,
                'previous_status' => $order->getOriginal('payment_status')
            ]);
    
            return response()->json(['status' => 'success']);
    
        } catch (\Exception $e) {
            Log::error("Payment processing failed", [
                'payment_intent_id' => $paymentIntentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }
}
