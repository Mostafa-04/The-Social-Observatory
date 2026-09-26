<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * À ajouter dans le modèle :  use IapsSubmissionScopes;
 * (colonnes supposées : full_name, entity_name, email, participant_type)
 */
trait IapsSubmissionScopes
{
    /** Filtres de la liste (recherche + type de participant). */
    public function scopeFilterBy(Builder $query, ?string $search = null, ?string $type = null): Builder
    {
        return $query
            ->when($search, function (Builder $q, string $search) {
                $q->where(function (Builder $q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('entity_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($type, fn (Builder $q, string $type) => $q->where('participant_type', $type));
    }

    /** Uniquement les lignes qui ont une adresse email. */
    public function scopeWithEmail(Builder $query): Builder
    {
        return $query->whereNotNull('email')->where('email', '!=', '');
    }

    /**
     * Sélection faite dans l'interface :
     * - selectAll = false : uniquement les IDs cochés
     * - selectAll = true  : tous les résultats du filtre, sauf les IDs exclus
     */
    public function scopeSelection(
        Builder $query,
        bool $selectAll,
        array $ids = [],
        array $excludedIds = []
    ): Builder {
        if ($selectAll) {
            return $query->when(
                ! empty($excludedIds),
                fn (Builder $q) => $q->whereNotIn('id', $excludedIds)
            );
        }

        return $query->whereIn('id', $ids);
    }
}
