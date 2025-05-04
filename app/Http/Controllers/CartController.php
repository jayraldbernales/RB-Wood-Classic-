<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = auth()->user()->cartItems()->with('product.images')->get();
        
        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);
    
        $cartItem = auth()->user()->cartItems()->where('product_id', $request->product_id)->first();
    
        if ($cartItem) {
            // Item exists, increment the quantity
            $cartItem->increment('quantity', $request->quantity);
        } else {
            // Item doesn't exist, create with the requested quantity
            Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }
    
        return back()->with('success', 'Product added to cart');
    }

    public function destroy($id)
    {
        auth()->user()->cartItems()->where('id', $id)->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:20'
        ]);

        $cartItem = auth()->user()->cartItems()->findOrFail($id);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true]);
    }
}