<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventEmailLog extends Model
{
    protected $fillable = [
        'event_email_campaign_id',
        'event_registration_id',
        'email',
        'status',
        'sent_at',
        'error',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(
            EventEmailCampaign::class,
            'event_email_campaign_id'
        );
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(
            EventRegistration::class,
            'event_registration_id'
        );
    }
}