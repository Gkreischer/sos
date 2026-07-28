<?php

namespace App\Models;

use App\Casts\BrlDecimalCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Part extends Model
{
    use HasFactory, LogsActivity;

    protected $with = ['category'];

    protected $fillable = [
        'name',
        'description',
        'image',
        'price',
        'category_id',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('part')
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => 'Material ' . __("activity.events.{$eventName}"));
    }

    protected $casts = [
        'price' => BrlDecimalCast::class,
        'category_id' => 'string',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function order()
    {
        return $this->belongsToMany(Order::class, 'orders_parts');
    }
}
