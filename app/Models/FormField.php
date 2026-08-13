<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormField extends Model
{
    protected $fillable = [
        'registration_form_id',
        'label',
        'name',
        'type',
        'options',
        'is_required',
        'is_system',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'is_system' => 'boolean',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(
            RegistrationForm::class,
            'registration_form_id'
        );
    }

    public function answers(): HasMany
    {
        return $this->hasMany(RegistrationAnswer::class);
    }
}