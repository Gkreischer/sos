<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    public $fillable = [
        'name',
        'path',
        'equipment_id',
        'part_id',
        'tasking_id',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    public function tasking()
    {
        return $this->belongsTo(Tasking::class);
    }
}
