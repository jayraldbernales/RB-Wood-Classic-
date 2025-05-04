<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PayMongoService;

class PayMongoController extends Controller
{
    protected $paymongoService;

    public function __construct(PayMongoService $paymongoService)
    {
        $this->paymongoService = $paymongoService;
    }

    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'required|string',
        ]);

        $paymentIntent = $this->paymongoService->createPaymentIntent(
            $request->amount,
            $request->description
        );

        if (!$paymentIntent) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment intent',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $paymentIntent,
        ]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        $eventType = $payload['data']['attributes']['type'] ?? null;

        // Verify webhook signature
        $signature = $request->header('Paymongo-Signature');
        if (!$this->verifyWebhookSignature($signature, $request->getContent())) {
            Log::warning('Invalid PayMongo webhook signature', ['payload' => $payload]);
            return response()->json(['status' => 'invalid signature'], 403);
        }

        switch ($eventType) {
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($payload);
                break;
            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($payload);
                break;
            case 'payment_intent.awaiting_payment_method':
                $this->handleAwaitingPaymentMethod($payload);
                break;
        }

        return response()->json(['status' => 'success']);
    }

    protected function verifyWebhookSignature($signature, $payload)
    {
        $secret = config('services.paymongo.webhook_secret');
        $computedSignature = hash_hmac('sha256', $payload, $secret);
        
        return hash_equals($signature, $computedSignature);
    }

    protected function handlePaymentSucceeded($payload)
    {
        $paymentIntentId = $payload['data']['attributes']['data']['id'];
        // Update your order status accordingly
    }

    protected function handlePaymentFailed($payload)
    {
        $paymentIntentId = $payload['data']['attributes']['data']['id'];
        // Update your order status accordingly
    }
}