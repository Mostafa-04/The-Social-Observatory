<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title',
        'description',
        'event_type',
        'country_id',
        'city',
        'location',
        'date',
        'start_time',
        'end_time',
        'registration_link',
        'image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'start_time' => 'datetime: H:i',
            'end_time' => 'datetime: H:i',
        ];
    }

    /**
     * Pays de l'événement.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}