<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Inertia\Inertia;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $orders = Order::with(['items.product.images']) // Added .images here
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Homepage/Orders', [
            'orders' => $orders,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product.images']); // Added .images here

        return Inertia::render('Homepage/Orders', [
            'order' => $order,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
    public function store(Request $request)
{
    $validated = $request->validate([
        'items' => 'required|array',
        'total_amount' => 'required|numeric',
        'down_payment_amount' => 'required|numeric',
        'message' => 'nullable|string',
        'payment_method' => 'required|in:card,gcash,grab_pay,paymaya,inperson',
        'payment_type' => 'required|in:full,downpayment',
        'paymongo_payment_intent_id' => 'nullable|string',
        'is_paid' => 'sometimes|boolean'
    ]);
    
    try {
        $paymentType = $validated['payment_type'] ?? 'full';
        $isPaid = $validated['is_paid'] ?? false;

        if (!$isPaid) {
            $paymentStatus = $validated['payment_method'] === 'inperson' ? 'unpaid' : 'pending_payment';
            $orderStatus = 'pending';
        } else {
            if ($paymentType === 'full') {
                $paymentStatus = 'paid';
                $orderStatus = 'processing';
            } elseif ($paymentType === 'downpayment') {
                $paymentStatus = 'partially_paid';
                $orderStatus = 'processing';
            } else {
                $paymentStatus = 'paid';
                $orderStatus = 'processing';
            }
        }

        $orderData = [
            'user_id' => auth()->id(),
            'total_amount' => $validated['total_amount'],
            'down_payment_amount' => $validated['down_payment_amount'],
            'remaining_amount' => $validated['total_amount'] - $validated['down_payment_amount'],
            'message' => $validated['message'],
            'payment_method' => $validated['payment_method'],
            'payment_intent_id' => $validated['paymongo_payment_intent_id'] ?? null,
            'payment_status' => $paymentStatus,
            'status' => $orderStatus,
            'paid_at' => $isPaid ? now() : null
        ];

        $order = Order::create($orderData);
        
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'id' => $order->id,
                'product_id' => $item['product']['id'],
                'quantity' => $item['quantity'],
                'price' => $item['product']['price'],
            ]);
        }
        
        $cartItemIds = collect($validated['items'])->pluck('id')->filter()->toArray();
        if (!empty($cartItemIds)) {
            Cart::where('user_id', auth()->id())
                ->whereIn('id', $cartItemIds)
                ->delete();
        }

        if ($request->expectsJson()) {
            return response()->json(['order' => $order], 201);
        }

        return redirect()->route('orders.confirmation', ['order' => $order->id]);
        
    } catch (\Exception $e) {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
        return back()->with('error', 'Failed to create order: ' . $e->getMessage());
    }
}


    
public function confirmation(Request $request)
{
    // Check for order ID in URL or session
    $order = null;
    
    if ($request->has('order')) {
        $order = Order::with('items.product')->find($request->input('order'));
    } elseif (session()->has('order')) {
        $order = Order::with('items.product')->find(session('order')->id);
    }

    // If no order found, redirect to home with error
    if (!$order) {
        return redirect('Orders/Failed')->with('error', 'Order not found');
    }

    // Update payment status if paymongo_payment_intent_id exists
    if ($order->paymongo_payment_intent_id) {
        $paymongoService = app(\App\Services\PayMongoService::class);
        $paymentIntent = $paymongoService->retrievePaymentIntent($order->paymongo_payment_intent_id);

        if ($paymentIntent) {
            $status = $paymentIntent['attributes']['status'] ?? null;
            $payments = $paymentIntent['attributes']['payments'] ?? [];

            if ($status === 'succeeded' || collect($payments)->contains(fn($p) => $p['attributes']['status'] === 'succeeded')) {
                $order->payment_status = 'paid';
                $order->status = 'processing';
                $order->save();
            } elseif ($status === 'pending') {
                $order->payment_status = 'pending_payment';
                $order->status = 'pending';
                $order->save();
            }
        }
    }

    return inertia('Orders/Confirmation', [
        'order' => $order,
        'auth' => ['user' => auth()->user()]
    ]);
}

    public function cancel(Order $order)
    {
        if ($order->status !== 'pending') {
            return back()->withErrors(['error' => 'Only pending orders can be cancelled.']);
        }
    
        $order->update(['status' => 'cancelled']);
    
        return back()->with('success', 'Order cancelled successfully.');
    }
    
}
