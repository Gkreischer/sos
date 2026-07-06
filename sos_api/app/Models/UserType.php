<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class UserType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'id', 'id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
