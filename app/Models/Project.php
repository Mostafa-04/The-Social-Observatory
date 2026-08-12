<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title',
        'description',
        'objective',
        'start_date',
        'end_date',
        'status',
        'featured_image',
        'country_id',
        'partner_id',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
        ];
    }

    /**
     * Pays du projet.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Partenaire principal du projet.
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }
}