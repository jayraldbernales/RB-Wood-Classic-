<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Services\PayMongoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(
        protected PayMongoService $paymongo
    ) {}

    /**
     * Display the checkout page with cart items and totals
     */

    public function showSingleProduct(Request $request, Product $product)
    {
        $quantity = $request->quantity ?? 1;
        
        // Format the single product to match the same structure as cart items
        $productItem = [
            'id' => 'single-' . $product->id, // Prefix to distinguish from cart items
            'quantity' => $quantity,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'images' => $product->images->map(function ($image) {
                    return [
                        'url' => $image->url ?? asset('storage/'.$image->image),
                        'id' => $image->id
                    ];
                })
            ]
        ];

        $total = $product->price * $quantity;
        $downPayment = $total * 0.5;

        return Inertia::render('Checkout/Show', [
                'cartItems' => [$productItem], // Wrap in array to match cart structure
                'total' => $total,
                'downPayment' => $downPayment,
                'user' => auth()->user()->only(['name', 'email', 'phone_number', 'address']),
                'isSingleProductCheckout' => true // Add flag to identify single product checkout
            ]);
    }

    /**
     * Process single product checkout
     */
    public function storeSingleProduct(Request $request, Product $product)
    {
        $request->validate([
            'phone_number' => 'required_if:use_different_contact,true',
            'shipping_address' => 'required_if:use_different_address,true',
            'payment_method' => 'required|in:card,cod',
            'message' => 'nullable|string',
            'quantity' => 'required|integer|min:1'
        ]);

        $subtotal = $product->price * $request->quantity;
        
        $order = $this->createOrder($request, $subtotal);
        
        $order->items()->create([
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'price' => $product->price
        ]);

        return $this->handlePayment($order, $request->payment_method);
    }
    public function show(Request $request)
    {
        $selectedItems = $request->input('selectedItems', []);
        
        $cartItems = Cart::with(['product.images'])
            ->where('user_id', auth()->id())
            ->when(!empty($selectedItems), function ($query) use ($selectedItems) {
                return $query->whereIn('id', $selectedItems);
            })
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'images' => $item->product->images->map(function ($image) {
                            return [
                                'url' => $image->url ?? asset('storage/'.$image->image),
                                'id' => $image->id
                            ];
                        })
                    ]
                ];
            });

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'No items selected for checkout');
        }

        $total = $cartItems->reduce(function ($carry, $item) {
            return $carry + ($item['product']['price'] * $item['quantity']);
        }, 0);

        return Inertia::render('Checkout/Show', [
            'cartItems' => $cartItems,
            'total' => $total,
            'downPayment' => $total * 0.5,
            'user' => auth()->user()->only(['name', 'email', 'phone_number', 'address']),
        ]);
    }

    /**
     * Process the checkout and create an order
     */
    public function store(Request $request)
    {
        $request->validate([
            'phone_number' => 'required_if:use_different_contact,true',
            'shipping_address' => 'required_if:use_different_address,true',
            'payment_method' => 'required|in:card,cod',
            'message' => 'nullable|string',
            'selectedItems' => 'sometimes|array' // Add validation for selected items
        ]);
        
        $cartItems = auth()->user()->cartItems()->with('product')
            ->when($request->selectedItems, function ($query) use ($request) {
                return $query->whereIn('id', $request->selectedItems);
            })
            ->get();
        
        if ($cartItems->isEmpty()) {
            return back()->with('error', 'No items selected for checkout');
        }

        $subtotal = $this->calculateSubtotal($cartItems);
        $order = $this->createOrder($request, $subtotal);
        $this->createOrderItems($order, $cartItems);
        
        // Only delete the selected items from cart
        auth()->user()->cartItems()->whereIn('id', $cartItems->pluck('id'))->delete();
        
        return $this->handlePayment($order, $request->payment_method);
    }

    protected function calculateSubtotal($cartItems)
    {
        return $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
    }

    protected function createOrder($request, $subtotal)
    {
        return Order::create([
            'user_id' => auth()->id(),
            'total_amount' => $subtotal,
            'down_payment_amount' => $request->payment_method === 'card' ? $subtotal * 0.5 : 0,
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_method === 'cod' ? 'pending' : 'unpaid',
            'status' => 'pending',
            'message' => $request->message,
            'customer_phone' => $request->phone_number ?? auth()->user()->phone_number,
            'shipping_address' => $request->shipping_address ?? auth()->user()->address,
            'estimated_completion_date' => now()->addMonth(),
        ]);
    }

    protected function createOrderItems($order, $cartItems)
    {
        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);
        }
    }

    protected function handlePayment($order, $method)
    {
        if ($method === 'card') {
            return $this->processCardPayment($order);
        }
        
        return redirect()->route('checkout.success', $order);
    }

    protected function processCardPayment($order)
    {
        try {
            $paymentIntent = $this->paymongo->createPaymentIntent(
                amount: $order->down_payment_amount * 100,
                description: "Downpayment for Order #{$order->id}"
            );
            
            return inertia('Checkout/Payment', [
                'order' => $order,
                'clientSecret' => $paymentIntent->client_secret,
                'publishableKey' => config('services.paymongo.public_key')
            ]);
            
        } catch (\Exception $e) {
            return back()->with('error', 'Payment processing error: '.$e->getMessage());
        }
    }

    public function success(Order $order)
    {
        return inertia('Checkout/Success', [
            'order' => $order->load('items.product')
        ]);
    }
}