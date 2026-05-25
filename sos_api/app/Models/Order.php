<?php

namespace App\Models;

use App\Casts\BrlDecimalCast;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;


    protected $with = ['user', 'equipment', 'orderParts', 'images', 'status', 'technician'];

    protected $fillable = ['title', 'status', 'description', 'obs', 'technician_id',  'user_id', 'equipment_id',  'service_price', 'parts_price', 'total_price', 'status_id', 'discount', 'service_description', 'diagnostic'];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function equipment() : BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function orderParts() : HasMany
    {
        return $this->HasMany(OrderParts::class, 'order_id', 'id');
    }

    public function images() : HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function status() : BelongsTo
    {
        return $this->belongsTo(OrderStatus::class);
    }

    public function technician() : BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id', 'id');
    }

    protected $casts = [
        'discount' => BrlDecimalCast::class,
        'service_price' => BrlDecimalCast::class,
        'parts_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

}
