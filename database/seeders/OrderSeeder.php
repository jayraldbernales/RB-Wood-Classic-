<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
// database/seeders/OrderSeeder.php
public function run()
{
    $user = User::first();

    $order = Order::create([
        'user_id' => $user->id,
        'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid()),
        'subtotal' => 5000,
        'tax' => 500,
        'shipping' => 200,
        'total' => 5700,
        'downpayment_amount' => 2850,
        'status' => 'pending',
        'customer_name' => $user->name,
        'customer_email' => $user->email,
    ]);

    $order->items()->create([
        'product_id' => 1,
        'product_name' => 'Custom Furniture Piece',
        'price' => 5000,
        'quantity' => 1,
    ]);

    $order->payments()->create([
        'user_id' => $user->id,
        'payment_method' => 'gcash',
        'amount' => 2850,
        'status' => 'pending',
    ]);
}
}
