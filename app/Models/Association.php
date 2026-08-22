<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Association extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'logo', 'type',
        'website', 'email', 'phone', 'social_links',
        'country_id', 'city', 'address',
        'founding_year', 'beneficiaries_count',
        'data_source', 'source_reference',
        'status', 'created_by',
        'views_count',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Association $association) {
            if (empty($association->slug)) {
                $association->slug = Str::slug($association->name) . '-' . Str::random(5);
            }
        });
    }

    // --- Relations ---

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Même relation polymorphique que Research / Publications / Insights.
     * IMPORTANT : remplace 'categorizable' par le nom réel utilisé
     * dans tes autres modèles si la table pivot a un nom différent
     * (ex: categoryable).
     */
    public function categories()
    {
        return $this->morphToMany(Category::class, 'categorizable');
    }

    // --- Scopes utiles ---

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeInCountry($query, $countryId)
    {
        return $query->where('country_id', $countryId);
    }

    public function scopeInCategory($query, $categoryId)
    {
        return $query->whereHas('categories', fn ($q) => $q->where('categories.id', $categoryId));
    }
}