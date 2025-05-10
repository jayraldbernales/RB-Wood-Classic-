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
        
        // Enhanced logging with request headers and body
        Log::info('Webhook received', [
            'payload' => $payload,
            'headers' => $request->headers->all(),
        ]);

        // First check if we have a valid signature before proceeding
        if (!$this->paymongoService->verifyWebhookSignature($request)) {
            Log::error('Invalid webhook signature', ['headers' => $request->headers->all()]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        try {
            $eventType = $payload['data']['attributes']['type'] ?? null;
            
            if (!$eventType) {
                Log::error('Missing event type in webhook payload', ['payload' => $payload]);
                return response()->json(['error' => 'Invalid payload format'], 400);
            }
            
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
        } catch (\Exception $e) {
            Log::error('Error processing webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $payload
            ]);
            
            // Return 200 OK to acknowledge receipt, even though we had an error
            // This prevents PayMongo from retrying constantly
            return response()->json(['status' => 'error_acknowledged'], 200);
        }
    }

    protected function handlePaymentPaid($payload)
    {
        try {
            Log::info('Handling payment.paid event', ['payload' => $payload]);
            
            // Extract payment intent ID with flexible path handling
            $paymentIntentId = null;
            $metadata = [];
            
            // Try multiple paths to find the payment intent ID
            if (isset($payload['data']['attributes']['data']['attributes']['payment_intent_id'])) {
                $paymentIntentId = $payload['data']['attributes']['data']['attributes']['payment_intent_id'];
                $metadata = $payload['data']['attributes']['data']['attributes']['metadata'] ?? [];
            } elseif (isset($payload['data']['relationships']['payment_intent']['data']['id'])) {
                $paymentIntentId = $payload['data']['relationships']['payment_intent']['data']['id'];
                $metadata = $payload['data']['attributes']['metadata'] ?? [];
            } elseif (isset($payload['data']['id'])) {
                // Direct payment ID
                $paymentIntentId = $payload['data']['id'];
                $metadata = $payload['data']['attributes']['metadata'] ?? [];
            }
                
            if (!$paymentIntentId) {
                Log::error('Payment intent ID not found in webhook payload', ['payload' => $payload]);
                return response()->json(['error' => 'Payment intent ID missing'], 400);
            }

            Log::info('Extracted payment details', [
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
            Log::info('Handling checkout_session.completed event', ['payload' => $payload]);
            
            $checkoutSession = $payload['data']['attributes']['data'] ?? $payload['data'] ?? [];
            
            if (empty($checkoutSession)) {
                Log::error('Checkout session data missing', ['payload' => $payload]);
                return response()->json(['error' => 'Invalid payload format'], 400);
            }
            
            // Extract payment intent ID and metadata
            $paymentIntentId = null;
            $metadata = $checkoutSession['attributes']['metadata'] ?? [];
            
            // Try to find payment intent ID in the first payment
            if (isset($checkoutSession['attributes']['payments']) && is_array($checkoutSession['attributes']['payments']) && !empty($checkoutSession['attributes']['payments'])) {
                $paymentIntentId = $checkoutSession['attributes']['payments'][0]['attributes']['payment_intent_id'] ?? null;
            }
            
            // If not found in payments, try the checkout session directly
            if (!$paymentIntentId && isset($checkoutSession['attributes']['payment_intent_id'])) {
                $paymentIntentId = $checkoutSession['attributes']['payment_intent_id'];
            }
            
            if (!$paymentIntentId) {
                Log::error('Payment intent ID not found in checkout session', [
                    'checkout_session' => $checkoutSession
                ]);
                
                // Look for order_id in metadata as fallback
                if (!empty($metadata['order_id'])) {
                    Log::info('Using order_id from metadata as fallback', [
                        'order_id' => $metadata['order_id']
                    ]);
                    
                    return $this->processPaymentByOrderId($metadata['order_id']);
                }
                
                return response()->json(['error' => 'Payment intent ID missing'], 400);
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

    protected function processPaymentByOrderId($orderId)
    {
        try {
            Log::info("Processing payment by order ID", ['order_id' => $orderId]);
            
            $order = Order::find($orderId);
            
            if (!$order) {
                Log::error("Order not found", ['order_id' => $orderId]);
                return response()->json(['error' => 'Order not found'], 404);
            }
            
            $updateData = [
                'payment_status' => 'paid',
                'status' => 'processing',
                'paid_at' => now()
            ];

            $order->update($updateData);

            Log::info("Order {$order->id} marked as paid", [
                'previous_status' => $order->getOriginal('payment_status'),
                'new_status' => 'paid'
            ]);

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error("Payment processing by order ID failed", [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    protected function processPayment($paymentIntentId, $metadata)
    {
        try {
            Log::info("Starting payment processing", [
                'payment_intent_id' => $paymentIntentId,
                'metadata' => $metadata
            ]);
            
            // First verify the payment with PayMongo
            $verification = $this->paymongoService->verifyPayment($paymentIntentId);
            
            if (!$verification) {
                Log::warning("Payment verification failed", [
                    'payment_intent_id' => $paymentIntentId
                ]);
                return response()->json(['status' => 'verification_failed'], 400);
            }
            
            Log::info("Payment verification result", [
                'payment_intent_id' => $paymentIntentId,
                'verification' => $verification
            ]);
            
            if (!$verification['paid']) {
                Log::warning("Payment not verified as paid", [
                    'payment_intent_id' => $paymentIntentId,
                    'verification' => $verification
                ]);
                return response()->json(['status' => 'not_paid']);
            }

            // Try multiple ways to find the order
            $order = null;
            
            // First try with payment intent ID
            $order = Order::where('paymongo_payment_intent_id', $paymentIntentId)->first();
            
            // Then try with order_id in metadata
            if (!$order && isset($metadata['order_id'])) {
                $order = Order::find($metadata['order_id']);
                Log::info("Looking up order by metadata order_id", [
                    'order_id' => $metadata['order_id'],
                    'found' => $order ? true : false
                ]);
            }
            
            // Try with reference_number in metadata
            if (!$order && isset($metadata['reference_number'])) {
                $order = Order::find($metadata['reference_number']);
                Log::info("Looking up order by reference_number", [
                    'reference_number' => $metadata['reference_number'],
                    'found' => $order ? true : false
                ]);
            }
            
            // If order still not found, check recent pending payments
            if (!$order) {
                Log::warning("Order not found with standard lookups, checking recent pending orders");
                
                // Look at recent pending orders as a last resort
                $recentOrders = Order::where('payment_status', 'pending_payment')
                    ->latest()
                    ->limit(5)
                    ->get();
                
                Log::info("Recent pending orders found", [
                    'count' => $recentOrders->count(),
                    'orders' => $recentOrders->pluck('id')->toArray()
                ]);
                
                // Just use the most recent pending order if there's only one
                if ($recentOrders->count() == 1) {
                    $order = $recentOrders->first();
                    Log::info("Using most recent pending order as fallback", ['order_id' => $order->id]);
                }
            }

            if (!$order) {
                Log::error("Order not found", [
                    'payment_intent_id' => $paymentIntentId,
                    'metadata' => $metadata,
                ]);
                return response()->json(['error' => 'Order not found'], 404);
            }

            $updateData = [
                'payment_status' => 'paid',
                'status' => 'processing',
                'paymongo_payment_intent_id' => $paymentIntentId, // Save this if it wasn't saved before
                'paymongo_payment_method_id' => $verification['payment_method'] ?? null,
                'paid_at' => now()
            ];

            $oldStatus = $order->payment_status;
            $order->update($updateData);

            Log::info("Order {$order->id} marked as paid", [
                'payment_method' => $verification['payment_method'] ?? 'unknown',
                'old_status' => $oldStatus,
                'new_status' => 'paid'
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
