<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
    ];

    public function researches(): HasMany
    {
        return $this->hasMany(Research::class);
    }
    public function associations()
    {
        return $this->morphedByMany(
            Association::class,
            'categorizable'
        );
    }
}