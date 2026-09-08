<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IapsSubmission extends Model
{
    protected $fillable = [
        'publication_id',

        // SECTION 1
        'full_name',
        'email',
        'phone',
        'languages',
        'participant_type',

        // SECTION 2 — Personne physique
        'individual_profile',
        'organization_affiliation',
        'disciplines',
        'other_discipline',
        'observation_regions',
        'observation_country',
        'diaspora_country',
        'observation_location',
        'contribution_methods',
        'other_contribution_method',

        // SECTION 3 — Personne morale
        'entity_name',
        'representative_role',
        'entity_type',
        'intervention_scale',
        'headquarters_country',
        'international_country',
        'headquarters_city',
        'motivations',
        'other_motivation',
        'partnership_opportunities',
        'other_partnership',

        // SECTION 4
        'blind_spots',
        'other_blind_spot',
        'field_testimony',

        // SECTION 5
        'ethical_consent',
    ];

    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'disciplines' => 'array',
            'observation_regions' => 'array',
            'contribution_methods' => 'array',
            'motivations' => 'array',
            'partnership_opportunities' => 'array',
            'blind_spots' => 'array',
            'ethical_consent' => 'boolean',
        ];
    }

    /**
     * Publication liée à cette soumission.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }
}