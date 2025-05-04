<?php

// database/migrations/[timestamp]_create_payments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Payment details
            $table->string('payment_method'); // gcash, bank_transfer, etc.
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('PHP');
            $table->string('transaction_id')->nullable();
            $table->string('status'); // pending, successful, failed, refunded
            
            // For manual payments
            $table->string('reference_number')->nullable();
            $table->string('proof_path')->nullable(); // Screenshot of payment
            
            // Gateway response
            $table->json('gateway_response')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};