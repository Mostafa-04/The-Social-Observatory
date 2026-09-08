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
        'linkedin_url',
        'cv_path',
        'presentation',
        'expertise_domain',
        'motivation',
    ];

    public const GROUPS = [
        'jeunesse'       => 'Groupe de Travail 1 — Jeunesse, Éducation et Emploi',
        'femmes'         => 'Groupe de Travail 2 — Femmes, Travail Invisible et Sécurité Sociale',
        'vieillissement' => 'Groupe de Travail 3 — Vieillissement, Santé de la Population et Transitions Démographiques',
        'pacte'          => 'Groupe de Travail 4 — Pacte National, Territoires et Engagement Citoyen',
    ];

    public function getGroupLabelAttribute(): string
    {
        return self::GROUPS[$this->group_type] ?? $this->group_type;
    }
}