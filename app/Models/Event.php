<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'slug',
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

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function emailCampaigns(): HasMany
    {
        return $this->hasMany(EventEmailCampaign::class);
    }
    public function registrationForms(): HasMany
    {
        return $this->hasMany(RegistrationForm::class);
    }


}