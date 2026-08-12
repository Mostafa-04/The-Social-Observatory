<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'logo',
        'website',
        'type',
        'description',
    ];

    /**
     * Les projets associés à ce partenaire.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}