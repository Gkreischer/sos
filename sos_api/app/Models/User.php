<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'cep',
        'address',
        'cpf',
        'fantasy_name',
        'corporate_name',
        'cnpj',
        'cep',
        'address',
        'phone',
        'district',
        'city',
        'state',
        'country',
        'image',
        'password',
        'type_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'pivot'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected function phone(): Attribute
    {
        return Attribute::make(
            set: fn(string $value) => $this->attributes['phone'] = preg_replace('/[^0-9]/', '', $value),
        );
    }


    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'created_by');
    }

    public function type()
    {
        return $this->belongsTo(UserType::class);
    }
}
