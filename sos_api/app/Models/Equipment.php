<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipments';

    protected $fillable = [
        'name',
        'description',
        'image',
        'category_id',
        'user_id',
        'obs'
    ];

    protected $with = [
        'category',
        'user',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'equipment_image', 'equipment_id', 'image_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'equipment_id');
    }
}
