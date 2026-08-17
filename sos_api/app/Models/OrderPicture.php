<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPicture extends Model
{
    protected $table = 'order_pictures';

    protected $fillable = ['order_id', 'path'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
