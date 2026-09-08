<?php

namespace App\Http\Controllers;

use App\Models\IapsSubmission;
use App\Models\Publication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IapsSubmissionController extends Controller
{
    /**
     * Afficher le formulaire IAPS.
     */
    public function create(Publication $publication): Response
    {
        return Inertia::render('client/publication/IapsForm', [
            'publication' => $publication,
        ]);
    }

    /**
     * Enregistrer une soumission IAPS.
     */
    public function store(
        Request $request,
        Publication $publication
    ): RedirectResponse {
        $validated = $request->validate([
            /*
            |--------------------------------------------------------------------------
            | SECTION 1 — Coordonnées
            |--------------------------------------------------------------------------
            */

            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:50',
            ],

            'languages' => [
                'required',
                'array',
                'min:1',
            ],

            'languages.*' => [
                'string',
                'max:100',
            ],

            'participant_type' => [
                'required',
                'in:individual,organization',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 2 — Personne physique
            |--------------------------------------------------------------------------
            */

            'individual_profile' => [
                'nullable',
                'string',
                'max:255',
            ],

            'organization_affiliation' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'disciplines' => [
                'nullable',
                'array',
                'max:3',
            ],

            'disciplines.*' => [
                'string',
                'max:255',
            ],

            'other_discipline' => [
                'nullable',
                'string',
                'max:255',
            ],

            'observation_regions' => [
                'nullable',
                'array',
            ],

            'observation_regions.*' => [
                'string',
                'max:100',
            ],

            'observation_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'diaspora_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'observation_location' => [
                'nullable',
                'string',
                'max:500',
            ],

            'contribution_methods' => [
                'nullable',
                'array',
            ],

            'contribution_methods.*' => [
                'string',
                'max:255',
            ],

            'other_contribution_method' => [
                'nullable',
                'string',
                'max:1000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 3 — Personne morale
            |--------------------------------------------------------------------------
            */

            'entity_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'representative_role' => [
                'nullable',
                'string',
                'max:255',
            ],

            'entity_type' => [
                'nullable',
                'string',
                'max:255',
            ],

            'intervention_scale' => [
                'nullable',
                'string',
                'max:255',
            ],

            'headquarters_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'international_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'headquarters_city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'motivations' => [
                'nullable',
                'array',
                'max:2',
            ],

            'motivations.*' => [
                'string',
                'max:255',
            ],

            'other_motivation' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'partnership_opportunities' => [
                'nullable',
                'array',
            ],

            'partnership_opportunities.*' => [
                'string',
                'max:255',
            ],

            'other_partnership' => [
                'nullable',
                'string',
                'max:1000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 4 — Cœur thématique
            |--------------------------------------------------------------------------
            */

            'blind_spots' => [
                'nullable',
                'array',
                'max:3',
            ],

            'blind_spots.*' => [
                'string',
                'max:255',
            ],

            'other_blind_spot' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'field_testimony' => [
                'nullable',
                'string',
                'max:10000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 5 — Engagement éthique
            |--------------------------------------------------------------------------
            */

            'ethical_consent' => [
                'required',
                'accepted',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Sécurité : on force la publication depuis la route
        |--------------------------------------------------------------------------
        */

        $validated['publication_id'] = $publication->id;

        /*
        |--------------------------------------------------------------------------
        | Enregistrement
        |--------------------------------------------------------------------------
        */

        IapsSubmission::create($validated);

        return redirect()
            ->route('publication.show.client', $publication)
            ->with(
                'success',
                'Votre contribution a été enregistrée avec succès.'
            );
    }

       /**
     * Liste paginée des soumissions IAPS, avec recherche et filtre par type.
     */
    public function index(Request $request)
    {
        $submissions = IapsSubmission::query()
            ->with('publication:id,title')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
 
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('entity_name', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('participant_type'), function ($query) use ($request) {
                $query->where('participant_type', $request->string('participant_type'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();
 
        return Inertia::render('admin/IapsSubmissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['search', 'participant_type']),
        ]);
    }
 
    /**
     * Détail organisé d'une soumission IAPS.
     */
    public function show(IapsSubmission $iapsSubmission)
    {
        $iapsSubmission->load('publication:id,title');
 
        return Inertia::render('admin/IapsSubmissions/Show', [
            'submission' => $iapsSubmission,
        ]);
    }
}