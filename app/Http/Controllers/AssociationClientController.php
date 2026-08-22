<?php

namespace App\Http\Controllers;

use App\Models\Association;
use App\Models\Category;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssociationClientController extends Controller
{
    /**
     * Page publique : /ecosystem
     * Liste filtrable + stats affichées en haut de page.
     */
    public function index(Request $request)
    {
        $query = Association::query()
            ->active()
            ->with(['country', 'categories']);

        if ($request->filled('type')) {
            $query->ofType($request->string('type'));
        }

        if ($request->filled('country')) {
            $query->inCountry($request->integer('country'));
        }

        if ($request->filled('category')) {
            $query->inCategory($request->integer('category'));
        }

        if ($request->filled('q')) {
            $search = $request->string('q');
            $query->where('name', 'like', "%{$search}%");
        }

        $associations = $query
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('client/Ecosystem/Index', [
            'associations' => $associations,
            'filters'      => $request->only(['type', 'country', 'category', 'q']),
            'countries'    => Country::orderBy('name')->get(['id', 'name']),
            'categories'   => Category::orderBy('name')->get(['id', 'name']),
            'stats'        => $this->computeStats(),
        ]);
    }

    /**
     * Endpoint JSON réutilisable : /api/ecosystem/stats
     * Utile pour la page d'accueil (cartes) ou tout autre widget.
     */
    public function stats()
    {
        return response()->json($this->computeStats());
    }

    /**
     * Calcule toutes les statistiques nécessaires : total, par type,
     * par pays, par catégorie, par année de fondation.
     */
    private function computeStats(): array
    {
        $byType = Association::active()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        $byCountry = Association::active()
            ->join('countries', 'countries.id', '=', 'associations.country_id')
            ->select('countries.name as country', DB::raw('count(*) as total'))
            ->groupBy('countries.name')
            ->orderByDesc('total')
            ->limit(15)
            ->get();

        $byCategory = Association::active()
            ->join('categorizables', function ($join) {
                $join->on('categorizables.categorizable_id', '=', 'associations.id')
                     ->where('categorizables.categorizable_type', '=', Association::class);
            })
            ->join('categories', 'categories.id', '=', 'categorizables.category_id')
            ->select('categories.name as category', DB::raw('count(*) as total'))
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $byYear = Association::active()
            ->whereNotNull('founding_year')
            ->select('founding_year', DB::raw('count(*) as total'))
            ->groupBy('founding_year')
            ->orderBy('founding_year')
            ->get();

        return [
            'total'   => Association::active()->count(),
            'by_type' => [
                'association'          => (int) ($byType['association'] ?? 0),
                'initiative'           => (int) ($byType['initiative'] ?? 0),
                'cooperative_sociale'  => (int) ($byType['cooperative_sociale'] ?? 0),
                'fondation'            => (int) ($byType['fondation'] ?? 0),
                'reseau'               => (int) ($byType['reseau'] ?? 0),
                'autre'                => (int) ($byType['autre'] ?? 0),
            ],
            'by_country'  => $byCountry,
            'by_category' => $byCategory,
            'by_year'     => $byYear,
        ];
    }

        public function show(string $slug)
    {
        $association = Association::query()
            ->active()
            ->with(['country', 'categories'])
            ->where('slug', $slug)
            ->firstOrFail();
 
        // Incrémente le compteur de vues à chaque consultation
        $association->increment('views_count');
 
        return Inertia::render('client/Ecosystem/Show', [
            'association' => $association,
        ]);
    }
}