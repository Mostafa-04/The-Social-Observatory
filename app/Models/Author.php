<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Author extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'position',
        'bio',
        'photo',
        'linkedin',
    ];

    /**
     * Les recherches rédigées par cet auteur.
     */
    public function researches(): HasMany
    {
        return $this->hasMany(Research::class);
    }
}