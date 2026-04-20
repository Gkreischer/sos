<?php

namespace App\Models;

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
        'price' => 'decimal:2',
        'category_id' => 'string',
    ];

    protected function price() : Attribute
    {
        return Attribute::make(
            // Remove R$ from the price and change the decimal separator to a dot
            get: fn (string $value) => $value,
            set: fn (string $value) => trim(preg_replace('/R\$/', '', $value)),
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
