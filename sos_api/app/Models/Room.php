<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'private',
        'created_by',
    ];

    protected $casts = [
        'private' => 'boolean',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'room_users',
            'room_id',
            'user_id'
        );
    }

    public function blockedUsers()
    {
        return $this->belongsToMany(
            User::class,
            'room_users_blocked',
            'room_id',
            'user_id'
        );
    }
}
