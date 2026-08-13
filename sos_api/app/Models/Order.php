<?php

namespace App\Models;

use App\Casts\BrlDecimalCast;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasFactory, LogsActivity, HasUuids;


    protected $with = ['user', 'equipment', 'parts', 'pictures', 'status', 'technician', 'attendant'];

    protected $fillable = ['title', 'status', 'description', 'obs', 'technician_id',  'user_id', 'equipment_id',  'service_price', 'parts_price', 'total_price', 'status_id', 'discount', 'service_description', 'diagnostic', 'signature', 'uid'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('order')
            ->logFillable()
            ->logExcept(['signature'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn(string $eventName) => 'Ordem ' . __("activity.events.{$eventName}"));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function parts(): HasMany
    {
        return $this->HasMany(OrderParts::class, 'order_id', 'id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id', 'id');
    }

    public function attendant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'attendant_id', 'id');
    }

    public function pictures(): HasMany
    {
        return $this->hasMany(OrderPicture::class);
    }

    public function ticket(): HasOne
    {
        return $this->hasOne(Ticket::class);
    }

    protected $casts = [
        'discount' => BrlDecimalCast::class,
        'service_price' => BrlDecimalCast::class,
        'parts_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Generate a new UUID for the model.
     */
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uid'];
    }
}
