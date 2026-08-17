<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class OrderParts extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'orders_parts';

    protected $fillable = ['order_id', 'name', 'quantity', 'price'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('order_parts')
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn (string $eventName) => 'Material de ordem '.__("activity.events.{$eventName}"));
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
