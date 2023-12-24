<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function tasking()
    {
        return $this->belongsToMany(Tasking::class, 'part_tasking', 'part_id', 'tasking_id');
    }
}
