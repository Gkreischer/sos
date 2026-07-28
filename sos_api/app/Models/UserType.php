<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class UserType extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('user_type')
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => 'Tipo de usuário ' . __("activity.events.{$eventName}"));
    }

    public function users()
    {
        return $this->hasMany(User::class, 'id', 'id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
