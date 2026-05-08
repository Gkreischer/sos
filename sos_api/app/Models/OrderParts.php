<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderParts extends Model
{
    use HasFactory;

    protected $table = 'orders_parts';

    protected $fillable = ['order_id', 'name', 'quantity', 'price'];

    public function order() : BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
