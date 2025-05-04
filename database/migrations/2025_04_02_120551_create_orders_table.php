<?php

// database/migrations/[timestamp]_create_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('down_payment_amount', 10, 2);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('unpaid');
            $table->string('status')->default('pending'); // pending, started_making, done
            $table->text('message')->nullable();
            $table->date('start_date')->nullable();
            $table->date('estimated_completion_date')->nullable();
            $table->date('actual_completion_date')->nullable();
            $table->string('paymongo_payment_intent_id')->nullable();
            $table->string('paymongo_payment_method_id')->nullable();
            $table->timestamps();
        });
        
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
