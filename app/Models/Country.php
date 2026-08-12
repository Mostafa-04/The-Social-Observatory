<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'iso_code',
        'continent',
    ];

    /**
     * Les projets du pays.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Les événements organisés dans ce pays.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}