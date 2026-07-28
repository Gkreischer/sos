<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Post extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'title',
        'content'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('post')
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => 'Comunicado ' . __("activity.events.{$eventName}"));
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
