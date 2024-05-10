<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $with = ['user', 'equipment', 'parts'];

    protected $fillable = ['title', 'status', 'description', 'obs', 'technician_id',  'user_id', 'equipment_id',  'service_price', 'parts_price', 'total_price', ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function equipment() : BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function parts() : BelongsToMany
    {
        return $this->belongsToMany(Part::class, 'orders_parts', 'order_id', 'part_id')->withPivot('quantity', 'price')->withTimestamps();
    }

    public function images() : HasMany
    {
        return $this->hasMany(Image::class);
    }
}
