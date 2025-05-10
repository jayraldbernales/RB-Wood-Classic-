<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayMongoService
{
    protected $secretKey;
    protected $baseUrl = 'https://api.paymongo.com/v1';

    public function __construct()
    {
        $this->secretKey = config('services.paymongo.secret_key');
    }

    public function createCheckoutSession($amount, $description, $paymentMethod, $metadata = [])
    {
        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->post("$this->baseUrl/checkout_sessions", [
                    'data' => [
                        'attributes' => [
                            'send_email_receipt' => false,
                            'show_description' => true,
                            'line_items' => [[
                                'amount' => $amount,
                                'currency' => 'PHP',
                                'name' => $description,
                                'quantity' => 1
                            ]],
                            'payment_method_types' => [$paymentMethod],
                            'success_url' => route('orders.confirmation'),
                            'cancel_url' => route('checkout'),
                            'metadata' => $metadata
                        ]
                    ]
                ]);

            if ($response->successful()) {
                return $response->json()['data'];
            }

            Log::error('PayMongo Checkout Error', $response->json());
            return null;

        } catch (\Exception $e) {
            Log::error('PayMongo Exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function verifyWebhookSignature($request)
    {
        $secret = config('services.paymongo.webhook_secret');
        $signature = $request->header('Paymongo-Signature');
        $payload = $request->getContent();

        return hash_equals(
            $signature,
            hash_hmac('sha256', $payload, $secret)
        );
    }

    public function retrievePayment($paymentIntentId)
    {
        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->get("$this->baseUrl/payment_intents/$paymentIntentId");

            return $response->successful() ? $response->json()['data'] : null;

        } catch (\Exception $e) {
            Log::error('Payment Retrieval Failed', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
