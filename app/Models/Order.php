<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'down_payment_amount',
        'payment_method',
        'payment_status',
        'status',
        'message',
        'start_date',
        'estimated_completion_date',
        'actual_completion_date',
        'paymongo_payment_intent_id',
        'paymongo_payment_method_id',
    ];

    protected $dates = [
        'start_date',
        'estimated_completion_date',
        'actual_completion_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeStartedMaking($query)
    {
        return $query->where('status', 'started_making');
    }

    public function scopeDone($query)
    {
        return $query->where('status', 'done');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'unpaid');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
}