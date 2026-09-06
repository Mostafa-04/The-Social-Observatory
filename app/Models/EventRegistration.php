<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'registration_form_id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'status',
        'registered_at',
    ];

    protected $casts = [
        'email' => 'encrypted',
        'registered_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function registrationForm(): BelongsTo
    {
        return $this->belongsTo(RegistrationForm::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(RegistrationAnswer::class);
    }
}