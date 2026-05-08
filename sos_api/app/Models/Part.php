<?php

namespace App\Models;

use App\Casts\BrlDecimalCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
        'price' => BrlDecimalCast::class,
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

    public function order() {
        return $this->belongsToMany(Order::class, 'orders_parts');
    }
}
