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

    protected $guarded = [];

    protected $fillable = [
        'name',
        'description',
        'image',
        'price',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'equipment_part', 'part_id', 'equipment_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function orders() : BelongsToMany
    {
        return $this->belongsToMany(Order::class);
    }
}
