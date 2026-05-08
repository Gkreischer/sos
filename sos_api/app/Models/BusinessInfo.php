<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessInfo extends Model
{
    use HasFactory;

    protected $table = 'business_info';

    protected $fillable = [
        'name',
        'email',
        'cnpj',
        'cep',
        'address',
        'address_number',
        'image',
        'phone',
        'city',
        'state',
        'country',
    ];
}
