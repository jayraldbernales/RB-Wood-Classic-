<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Services\PayMongoService;
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
            $orderData = [
                'user_id' => auth()->id(),
                'total_amount' => $validated['total_amount'],
                'down_payment_amount' => $validated['down_payment_amount'],
                'remaining_amount' => $validated['total_amount'] - $validated['down_payment_amount'],
                'message' => $validated['message'],
                'payment_method' => $validated['payment_method'],
                'paymongo_payment_intent_id' => $validated['paymongo_payment_intent_id'] ?? null,
                'payment_status' => $validated['is_paid'] ? 'paid' : ($validated['payment_method'] === 'inperson' ? 'unpaid' : 'pending_payment'),
                'status' => $validated['is_paid'] ? 'processing' : 'pending'
            ];

            $order = Order::create($orderData);
            
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
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

            return response()->json([
                'order' => [
                    'id' => $order->id,
                    'total_amount' => $order->total_amount,
                    'payment_status' => $order->payment_status,
                    'paymongo_payment_intent_id' => $order->paymongo_payment_intent_id
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function confirmation(Request $request)
    {
        $order = $request->has('order') 
            ? Order::with('items.product')->find($request->input('order'))
            : (session()->has('order') ? Order::with('items.product')->find(session('order')->id) : null);

        if (!$order) {
            return redirect('Orders/Failed')->with('error', 'Order not found');
        }

        if ($order->paymongo_payment_intent_id) {
            $verification = app(PayMongoService::class)->verifyPayment($order->paymongo_payment_intent_id);
            
            if ($verification && $verification['paid']) {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing'
                ]);
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
