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

    // ... [previous methods remain unchanged]

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        // Add detailed logging with full payload
        Log::info('Webhook received', ['payload' => $payload]);

        // Verify the webhook signature
        if (!$this->paymongoService->verifyWebhookSignature($request)) {
            Log::error('Invalid webhook signature', ['headers' => $request->headers->all()]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Make sure we have the expected event type structure
        if (!isset($payload['data']['attributes']['type'])) {
            Log::error('Invalid webhook payload structure', ['payload' => $payload]);
            return response()->json(['error' => 'Invalid payload structure'], 400);
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
            Log::info('Full payment.paid payload', ['payload' => $payload]);
            
            // More flexible payload parsing with fallbacks
            $paymentIntentId = null;
            
            // Try different paths to find payment_intent_id
            if (isset($payload['data']['attributes']['data']['attributes']['payment_intent_id'])) {
                $paymentIntentId = $payload['data']['attributes']['data']['attributes']['payment_intent_id'];
            } elseif (isset($payload['data']['relationships']['payment_intent']['data']['id'])) {
                $paymentIntentId = $payload['data']['relationships']['payment_intent']['data']['id'];
            } elseif (isset($payload['data']['attributes']['payment_intent_id'])) {
                $paymentIntentId = $payload['data']['attributes']['payment_intent_id'];
            }
                
            if (!$paymentIntentId) {
                Log::error('Payment intent ID not found in webhook payload', ['payload' => $payload]);
                return response()->json(['error' => 'Payment intent ID missing'], 400);
            }

            // Try different paths to find metadata
            $metadata = [];
            if (isset($payload['data']['attributes']['data']['attributes']['metadata'])) {
                $metadata = $payload['data']['attributes']['data']['attributes']['metadata'];
            } elseif (isset($payload['data']['attributes']['metadata'])) {
                $metadata = $payload['data']['attributes']['metadata'];
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

    protected function handleCheckoutSessionCompleted($payload)
    {
        try {
            Log::info('Full checkout_session.completed payload', ['payload' => $payload]);
            
            // More flexible payload parsing
            $paymentIntentId = null;
            $metadata = [];
            
            // Try to get the checkout session data
            $checkoutSession = $payload['data']['attributes']['data'] ?? null;
            
            if ($checkoutSession) {
                // Try to get payments from the checkout session
                $payments = $checkoutSession['attributes']['payments'] ?? [];
                
                if (!empty($payments)) {
                    // Get the payment intent ID from the first payment
                    $paymentIntentId = $payments[0]['attributes']['payment_intent_id'] ?? null;
                }
                
                // Get metadata
                $metadata = $checkoutSession['attributes']['metadata'] ?? [];
            }
            
            if (!$paymentIntentId) {
                Log::error('Payment intent ID not found in checkout session payload', ['payload' => $payload]);
                return response()->json(['error' => 'Payment intent ID missing from checkout session'], 400);
            }
            
            Log::info('Processing checkout_session.completed', [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);

            return $this->processPayment($paymentIntentId, $metadata);
            
        } catch (\Exception $e) {
            Log::error('Error handling checkout_session.completed', [
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

            Log::info("Looking for order with payment intent ID or metadata", [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);

            // Try multiple ways to find the order with more specific logging
            $order = Order::where('payment_intent_id', $paymentIntentId)
                        ->first();
            
            if (!$order && isset($metadata['order_id'])) {
                $order = Order::find($metadata['order_id']);
                Log::info("Trying to find order by metadata order_id", [
                    'order_id' => $metadata['order_id'],
                    'found' => (bool)$order
                ]);
            }
            
            if (!$order && isset($metadata['reference_number'])) {
                $order = Order::find($metadata['reference_number']);
                Log::info("Trying to find order by reference_number", [
                    'reference_number' => $metadata['reference_number'],
                    'found' => (bool)$order
                ]);
            }

            if (!$order) {
                // Log all pending orders to help debugging
                $pendingOrders = Order::where('payment_status', 'pending_payment')
                    ->limit(5)
                    ->get()
                    ->toArray();
                
                Log::error("Order not found", [
                    'payment_intent_id' => $paymentIntentId,
                    'metadata' => $metadata,
                    'pending_orders' => $pendingOrders
                ]);
                return response()->json(['error' => 'Order not found'], 404);
            }

            $updateData = [
                'payment_status' => 'paid',
                'status' => 'processing',
                'payment_intent_id' => $paymentIntentId, // Make sure this is saved
                'paymongo_payment_method_id' => $verification['payment_method'] ?? null
            ];

            $previousStatus = $order->payment_status;
            $order->update($updateData);

            Log::info("Order {$order->id} marked as paid", [
                'method' => $verification['payment_method'],
                'changes' => $updateData,
                'previous_status' => $previousStatus
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
