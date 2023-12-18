<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function equipments()
    {
        return $this->hasMany(Equipment::class);
    }

    public function parts()
    {
        return $this->hasMany(Part::class);
    }
}
