<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PayMongoService
{
    protected $secretKey;
    protected $publicKey;
    protected $baseUrl = 'https://api.paymongo.com/v1';
    protected $webhookSecret;

    public function __construct()
    {
        $this->secretKey = config('services.paymongo.secret_key');
        $this->publicKey = config('services.paymongo.public_key');
        $this->webhookSecret = config('services.paymongo.webhook_secret');
    }

    public function createPaymentIntent($amount, $description, $paymentMethodAllowed = ['card'])
    {
        try {
            $payload = [
                'data' => [
                    'attributes' => [
                        'amount' => $amount,
                        'payment_method_allowed' => $paymentMethodAllowed,
                        'currency' => 'PHP',
                        'description' => $description,
                    ],
                ],
            ];

            // Only include card options if card is allowed
            if (in_array('card', $paymentMethodAllowed)) {
                $payload['data']['attributes']['payment_method_options'] = [
                    'card' => [
                        'request_three_d_secure' => 'any',
                    ],
                ];
            }

            $response = Http::withBasicAuth($this->secretKey, '')
                ->post("{$this->baseUrl}/payment_intents", $payload);

            if ($response->successful()) {
                return $response->json()['data'];
            }

            Log::error('PayMongo Payment Intent Error', [
                'error' => $response->json(),
                'amount' => $amount,
                'description' => $description
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('PayMongo Payment Intent Exception', [
                'error' => $e->getMessage(),
                'amount' => $amount,
                'description' => $description
            ]);
            return null;
        }
    }

    public function attachPaymentMethod($paymentIntentId, $paymentMethodId, $returnUrl)
    {
        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->post("{$this->baseUrl}/payment_intents/{$paymentIntentId}/attach", [
                    'data' => [
                        'attributes' => [
                            'payment_method' => $paymentMethodId,
                            'return_url' => $returnUrl,
                        ],
                    ],
                ]);

            if ($response->successful()) {
                return $response->json()['data'];
            }

            Log::error('PayMongo Attach Payment Method Error', [
                'error' => $response->json(),
                'payment_intent_id' => $paymentIntentId,
                'payment_method_id' => $paymentMethodId
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('PayMongo Attach Payment Method Exception', [
                'error' => $e->getMessage(),
                'payment_intent_id' => $paymentIntentId,
                'payment_method_id' => $paymentMethodId
            ]);
            return null;
        }
    }

    public function createCheckoutSession($amount, $description, $paymentMethodType, $metadata = [])
    {
        try {

            $successUrl = url(route('orders.confirmation', [
                'order' => $metadata['order_id'] ?? 'temp'
            ]));

            $response = Http::withBasicAuth($this->secretKey, '')
                ->post("{$this->baseUrl}/checkout_sessions", [
                    'data' => [
                        'attributes' => [
                            'send_email_receipt' => false,
                            'show_description' => true,
                            'show_line_items' => true,
                            'success_url' => $successUrl,
                            'cancel_url' => url(route('checkout')),
                            'description' => $description,
                            'line_items' => [
                                [
                                    'amount' => $amount,
                                    'currency' => 'PHP',
                                    'name' => $description,
                                    'quantity' => 1,
                                ]
                            ],
                            'payment_method_types' => [$paymentMethodType],
                            'metadata' => $metadata,
                        ],
                    ],
                ]);
    
            if ($response->successful()) {
                return $response->json()['data'];
            }
    
            Log::error('PayMongo Checkout Session Error', $response->json());
            return null;
    
        } catch (\Exception $e) {
            Log::error('PayMongo Checkout Session Exception', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function verifyWebhookSignature(Request $request)
    {
        if (empty($this->webhookSecret)) {
            Log::warning('PayMongo webhook secret not configured');
            return false;
        }

        $signature = $request->header('Paymongo-Signature');
        $payload = $request->getContent();
        $computedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);

        return hash_equals($signature, $computedSignature);
    }

    public function retrievePaymentIntent($paymentIntentId)
    {
        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->get("{$this->baseUrl}/payment_intents/{$paymentIntentId}");

            if ($response->successful()) {
                return $response->json()['data'];
            }

            Log::error('PayMongo Retrieve Payment Intent Error', [
                'error' => $response->json(),
                'payment_intent_id' => $paymentIntentId
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('PayMongo Retrieve Payment Intent Exception', [
                'error' => $e->getMessage(),
                'payment_intent_id' => $paymentIntentId
            ]);
            return null;
        }
    }

    public function verifyPayment($paymentIntentId)
    {
        $paymentIntent = $this->retrievePaymentIntent($paymentIntentId);
        
        if (!$paymentIntent) {
            return null;
        }

        $status = $paymentIntent['attributes']['status'];
        $payments = $paymentIntent['attributes']['payments'] ?? [];

        return [
            'status' => $status,
            'paid' => $status === 'succeeded' || 
                    collect($payments)->contains(fn($p) => $p['attributes']['status'] === 'paid'),
            'payment_method' => $payments[0]['attributes']['payment_method']['type'] ?? null
        ];
    }
}
