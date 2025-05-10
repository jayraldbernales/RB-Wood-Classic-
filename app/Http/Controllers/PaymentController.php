<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\PayMongoService;

class PaymentController extends Controller
{
    protected $paymongoService;

    public function __construct(PayMongoService $paymongoService)
    {
        $this->paymongoService = $paymongoService;
    }

    public function createCheckout(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'description' => 'required|string',
            'payment_method' => 'required|in:gcash,grab_pay,paymaya',
            'metadata' => 'required|array'
        ]);

        $session = $this->paymongoService->createCheckoutSession(
            $validated['amount'],
            $validated['description'],
            $validated['payment_method'],
            $validated['metadata']
        );

        if (!$session) {
            return response()->json(['error' => 'Checkout creation failed'], 500);
        }

        return response()->json([
            'checkout_url' => $session['attributes']['checkout_url']
        ]);
    }

    public function handleWebhook(Request $request)
    {
        // 1. Verify signature
        if (!$this->paymongoService->verifyWebhookSignature($request)) {
            Log::error('Invalid webhook signature');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $payload = $request->all();
        Log::info('Webhook received', ['type' => $payload['data']['attributes']['type']]);

        // 2. Only process payment.paid events
        if ($payload['data']['attributes']['type'] !== 'payment.paid') {
            return response()->json(['status' => 'ignored']);
        }

        // 3. Extract metadata and find order
        $metadata = $payload['data']['attributes']['data']['attributes']['metadata'] ?? [];
        $orderId = $metadata['order_id'] ?? null;

        if (!$orderId) {
            Log::error('Order ID missing in webhook metadata');
            return response()->json(['error' => 'Order ID required'], 400);
        }

        // 4. Update order status
        try {
            $order = Order::find($orderId);
            
            if (!$order) {
                Log::error('Order not found', ['order_id' => $orderId]);
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Idempotency check
            if ($order->payment_status === 'paid') {
                return response()->json(['status' => 'already_processed']);
            }

            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'paid_at' => now()
            ]);

            Log::info('Order payment completed', ['order_id' => $orderId]);
            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }
}
