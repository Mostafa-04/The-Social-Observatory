<?php

namespace App\Http\Controllers;

use App\Models\Association;
use App\Models\Category;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssociationController extends Controller
{
    /**
     * Display a listing of associations.
     */
    public function index(Request $request): Response
    {
        $query = Association::query()
            ->with([
                'country:id,name',
                'categories:id,name',
                'createdBy:id,name',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filter by type
        |--------------------------------------------------------------------------
        */

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        /*
        |--------------------------------------------------------------------------
        | Filter by status
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        /*
        |--------------------------------------------------------------------------
        | Filter by country
        |--------------------------------------------------------------------------
        */

        if ($request->filled('country_id')) {
            $query->where('country_id', $request->input('country_id'));
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $associations = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Countries
        |--------------------------------------------------------------------------
        */

        $countries = Country::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/Associations/Index', [
            'associations' => $associations,
            'countries' => $countries,
            'categories' => $categories,

            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'status' => $request->input('status', ''),
                'country_id' => $request->input('country_id', ''),
            ],

            'types' => [
                [
                    'value' => 'association',
                    'label' => 'Association',
                ],
                [
                    'value' => 'initiative',
                    'label' => 'Initiative',
                ],
                [
                    'value' => 'cooperative_sociale',
                    'label' => 'Coopérative sociale',
                ],
                [
                    'value' => 'fondation',
                    'label' => 'Fondation',
                ],
                [
                    'value' => 'reseau',
                    'label' => 'Réseau',
                ],
                [
                    'value' => 'autre',
                    'label' => 'Autre',
                ],
            ],

            'statuses' => [
                [
                    'value' => 'active',
                    'label' => 'Active',
                ],
                [
                    'value' => 'inactive',
                    'label' => 'Inactive',
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new association.
     */
    public function create(): Response
    {
        $countries = Country::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/Associations/Create', [
            'countries' => $countries,
            'categories' => $categories,

            'types' => [
                [
                    'value' => 'association',
                    'label' => 'Association',
                ],
                [
                    'value' => 'initiative',
                    'label' => 'Initiative',
                ],
                [
                    'value' => 'cooperative_sociale',
                    'label' => 'Coopérative sociale',
                ],
                [
                    'value' => 'fondation',
                    'label' => 'Fondation',
                ],
                [
                    'value' => 'reseau',
                    'label' => 'Réseau',
                ],
                [
                    'value' => 'autre',
                    'label' => 'Autre',
                ],
            ],
        ]);
    }

    /**
     * Store a newly created association.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'type' => [
                'required',
                'in:association,initiative,cooperative_sociale,fondation,reseau,autre',
            ],

            'website' => [
                'nullable',
                'url',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'social_links' => [
                'nullable',
                'array',
            ],

            'social_links.facebook' => [
                'nullable',
                'url',
            ],

            'social_links.linkedin' => [
                'nullable',
                'url',
            ],

            'social_links.instagram' => [
                'nullable',
                'url',
            ],

            'social_links.x' => [
                'nullable',
                'url',
            ],

            'country_id' => [
                'required',
                'exists:countries,id',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'founding_year' => [
                'nullable',
                'integer',
                'min:1800',
                'max:' . date('Y'),
            ],

            'beneficiaries_count' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'data_source' => [
                'required',
                'in:manual,import_data_gov_ma,import_odco,autre',
            ],

            'source_reference' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],

            'category_ids' => [
                'nullable',
                'array',
            ],

            'category_ids.*' => [
                'integer',
                'exists:categories,id',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Upload logo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request
                ->file('logo')
                ->store('associations/logos', 'public');
        }

        unset($validated['logo']);

        /*
        |--------------------------------------------------------------------------
        | Created by
        |--------------------------------------------------------------------------
        */

        $validated['created_by'] = Auth::id();

        /*
        |--------------------------------------------------------------------------
        | Create association
        |--------------------------------------------------------------------------
        */

        $association = Association::create($validated);

        /*
        |--------------------------------------------------------------------------
        | Sync categories
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['category_ids'])) {
            $association->categories()->sync($validated['category_ids']);
        }

        return redirect()
            ->route('associations.index')
            ->with('success', 'Association créée avec succès.');
    }

    /**
     * Display the specified association.
     */
    public function show(Association $association): Response
    {
        $association->load([
            'country:id,name',
            'categories:id,name',
            'createdBy:id,name',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Increment views
        |--------------------------------------------------------------------------
        */

        $association->increment('views_count');

        return Inertia::render('admin/Associations/Show', [
            'association' => $association,
        ]);
    }

    /**
     * Show the form for editing the specified association.
     */
    public function edit(Association $association): Response
    {
        $association->load([
            'country:id,name',
            'categories:id,name',
        ]);

        $countries = Country::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/Associations/Edit', [
            'association' => $association,
            'countries' => $countries,
            'categories' => $categories,

            'types' => [
                [
                    'value' => 'association',
                    'label' => 'Association',
                ],
                [
                    'value' => 'initiative',
                    'label' => 'Initiative',
                ],
                [
                    'value' => 'cooperative_sociale',
                    'label' => 'Coopérative sociale',
                ],
                [
                    'value' => 'fondation',
                    'label' => 'Fondation',
                ],
                [
                    'value' => 'reseau',
                    'label' => 'Réseau',
                ],
                [
                    'value' => 'autre',
                    'label' => 'Autre',
                ],
            ],
        ]);
    }

    /**
     * Update the specified association.
     */
    public function update(Request $request, Association $association)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'type' => [
                'required',
                'in:association,initiative,cooperative_sociale,fondation,reseau,autre',
            ],

            'website' => [
                'nullable',
                'url',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'social_links' => [
                'nullable',
                'array',
            ],

            'social_links.facebook' => [
                'nullable',
                'url',
            ],

            'social_links.linkedin' => [
                'nullable',
                'url',
            ],

            'social_links.instagram' => [
                'nullable',
                'url',
            ],

            'social_links.x' => [
                'nullable',
                'url',
            ],

            'country_id' => [
                'required',
                'exists:countries,id',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'founding_year' => [
                'nullable',
                'integer',
                'min:1800',
                'max:' . date('Y'),
            ],

            'beneficiaries_count' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'data_source' => [
                'required',
                'in:manual,import_data_gov_ma,import_odco,autre',
            ],

            'source_reference' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],

            'category_ids' => [
                'nullable',
                'array',
            ],

            'category_ids.*' => [
                'integer',
                'exists:categories,id',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Upload new logo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('logo')) {

            if (
                $association->logo_path &&
                Storage::disk('public')->exists($association->logo_path)
            ) {
                Storage::disk('public')->delete($association->logo_path);
            }

            $validated['logo_path'] = $request
                ->file('logo')
                ->store('associations/logos', 'public');
        }

        unset($validated['logo']);

        /*
        |--------------------------------------------------------------------------
        | Update association
        |--------------------------------------------------------------------------
        */

        $association->update($validated);

        /*
        |--------------------------------------------------------------------------
        | Sync categories
        |--------------------------------------------------------------------------
        */

        $association->categories()->sync(
            $validated['category_ids'] ?? []
        );

        return redirect()
            ->route('associations.index')
            ->with('success', 'Association modifiée avec succès.');
    }

    /**
     * Remove the specified association.
     */
    public function destroy(Association $association)
    {
        /*
        |--------------------------------------------------------------------------
        | Delete logo
        |--------------------------------------------------------------------------
        */

        if (
            $association->logo_path &&
            Storage::disk('public')->exists($association->logo_path)
        ) {
            Storage::disk('public')->delete($association->logo_path);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete association
        |--------------------------------------------------------------------------
        */

        $association->delete();

        return redirect()
            ->route('associations.index')
            ->with('success', 'Association supprimée avec succès.');
    }
}