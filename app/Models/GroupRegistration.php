<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_type',
        'full_name',
        'email',
        'gender',
        'linkedin_url',
        'cv_path',
        'presentation',
        'expertise_domain',
        'motivation',
    ];

public const GROUPS = [
    'human_capital' => 'Human Capital & Work',
    'gender_inclusion' => 'Gender, Inclusion & Diverse Abilities',
    'health_social_protection' => 'Health, Social Protection & Demographic Transitions',
    'mobility_migration' => 'Mobility, Migration & Diaspora',
    'governance_democracy' => 'Governance, Democracy & the Social Contract',
];

    public function getGroupLabelAttribute(): string
    {
        return self::GROUPS[$this->group_type] ?? $this->group_type;
    }
}