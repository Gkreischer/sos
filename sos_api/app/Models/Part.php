<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Part extends Model
{
    use HasFactory;

    protected $with = ['category'];

    protected $fillable = [
        'name',
        'description',
        'image',
        'price',
        'category_id',
    ];

    protected $casts = [
        'price' => 'float',
        'category_id' => 'string',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function orders() : BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'orders_parts', 'part_id', 'order_id')->withPivot('quantity', 'price')->withTimestamps();
    }
}
