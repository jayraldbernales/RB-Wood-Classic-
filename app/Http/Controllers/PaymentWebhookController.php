<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Events\OrderPaid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Webhook received', ['headers' => $request->headers->all()]);

        $payload = $request->getContent();
        $signature = $request->header('Paymongo-Signature');

        if (!$this->verifySignature($payload, $signature)) {
            Log::error('Invalid webhook signature', [
                'received' => $signature,
                'expected' => $this->computeSignature($payload)
            ]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $event = json_decode($payload);
        Log::debug('Webhook event', ['event' => $event]);

        switch ($event->type) {
            case 'payment.paid':
                $this->handlePaymentPaid($event);
                break;
            
            case 'payment.failed':
                $this->handlePaymentFailed($event);
                break;
                
            default:
                Log::warning('Unhandled webhook event', ['type' => $event->type]);
        }

        return response()->json(['status' => 'success']);
    }

    protected function handlePaymentPaid($event)
    {
        try {
            $paymentIntentId = $event->data->attributes->payment_intent_id;
            $amount = $event->data->attributes->amount / 100; // Convert from centavos

            $order = Order::where('payment_id', $paymentIntentId)->first();

            if (!$order) {
                Log::error('Order not found for payment', ['payment_intent_id' => $paymentIntentId]);
                return;
            }

            $order->update([
                'payment_status' => 'paid',
                'status' => 'downpayment_received',
                'paid_at' => now()
            ]);

            event(new OrderPaid($order));
            Log::info('Payment processed successfully', ['order_id' => $order->id]);

        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    protected function handlePaymentFailed($event)
    {
        $paymentIntentId = $event->data->attributes->payment_intent_id;
        
        Order::where('payment_id', $paymentIntentId)
            ->update([
                'payment_status' => 'failed',
                'status' => 'payment_failed'
            ]);
            
        Log::warning('Payment failed', ['payment_intent_id' => $paymentIntentId]);
    }

    protected function verifySignature($payload, $signature)
    {
        if (app()->environment('local') && config('app.debug')) {
            Log::warning('Signature verification skipped in local environment');
            return true;
        }

        return hash_equals(
            $this->computeSignature($payload),
            $signature
        );
    }

    protected function computeSignature($payload)
    {
        return hash_hmac(
            'sha256',
            $payload,
            config('services.paymongo.webhook_secret')
        );
    }
}