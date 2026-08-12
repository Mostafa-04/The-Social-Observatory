<?php

namespace App\Http\Controllers;

use App\Models\Research;
use App\Models\Insight;
use App\Models\Publication;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        return Inertia::render('Search/Index', [
            'query'   => $query,
            'results' => $query !== '' ? $this->search($query, 10) : [],
        ]);
    }

    /**
     * Endpoint JSON léger pour les suggestions live dans la barre de recherche
     * (utilisé via fetch() côté Navbar, pas de rendu Inertia ici).
     */
    public function suggestions(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        if (mb_strlen($query) < 3) {
            return response()->json(['results' => []]);
        }

        return response()->json([
            'results' => $this->search($query, 3),
        ]);
    }

    /**
     * Recherche partagée entre la page de résultats et les suggestions live.
     */
    private function search(string $query, int $perType = 10): array
    {
        $results = [];

        // --- Research ---
        $results = array_merge($results, Research::query()
            ->where('status', 'published')
            ->where('title', 'like', "%{$query}%")
            ->latest('published_at')
            ->take($perType)
            ->get()
            ->map(fn ($item) => [
                'id'      => $item->id,
                'type'    => 'research',
                'title'   => $item->title,
                'excerpt' => $item->summary,
                'url'     => route('research.show.client', $item->id),
            ])->toArray());

        // --- Insights ---
        $results = array_merge($results, Insight::query()
            ->where('status', 'published')
            ->where('title', 'like', "%{$query}%")
            ->latest('published_at')
            ->take($perType)
            ->get()
            ->map(fn ($item) => [
                'id'      => $item->id,
                'type'    => 'insight',
                'title'   => $item->title,
                'excerpt' => $item->excerpt,
                'url'     => route('insight.show.client', $item->id),
            ])->toArray());

        // --- Publications ---
        $results = array_merge($results, Publication::query()
            ->where('title', 'like', "%{$query}%")
            ->latest('published_at')
            ->take($perType)
            ->get()
            ->map(fn ($item) => [
                'id'      => $item->id,
                'type'    => 'publication',
                'title'   => $item->title,
                'excerpt' => $item->description,
                'url'     => route('publication.show.client', $item->id),
            ])->toArray());

        // --- Events ---
        $results = array_merge($results, Event::query()
            ->where('title', 'like', "%{$query}%")
            ->orderBy('date')
            ->take($perType)
            ->get()
            ->map(fn ($item) => [
                'id'      => $item->id,
                'type'    => 'event',
                'title'   => $item->title,
                'excerpt' => $item->description,
                'url'     => route('event.show.client', $item->id),
            ])->toArray());

        return $results;
    }
}