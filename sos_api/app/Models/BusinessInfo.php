<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class BusinessInfo extends Model
{
    use HasFactory, LogsActivity;

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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('business_info')
            ->logFillable()
            ->logExcept(['password', 'remember_token'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn (string $eventName) => 'Empresa '.__("activity.events.{$eventName}"));
    }
}
