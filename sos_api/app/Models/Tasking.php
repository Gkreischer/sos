<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tasking extends Model
{
    use HasFactory;

    public $fillable = [
        'user_id',
        'category_id',
        'image_id',
        'status',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function parts()
    {
        return $this->belongsToMany(Part::class, 'part_tasking');
    }
}
