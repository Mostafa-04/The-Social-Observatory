<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;


class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/Countries/Index', [
            'countries' => Country::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

public function create()
{
    $response = Http::withToken(config('services.restcountries.key'))
        ->get('https://api.restcountries.com/countries/v5', [
            'region' => 'Africa',
            'limit' => 100,
            'response_fields' => 'names.common,codes.alpha_2',
        ]);

    if ($response->failed()) {
        return back()->withErrors([
            'countries' => 'Impossible de charger les pays.',
        ]);
    }

    $countries = collect($response->json('data.objects', []))
        ->filter(fn ($country) => data_get($country, 'codes.alpha_2') !== 'EH')
        ->map(fn ($country) => [
            'name' => data_get($country, 'names.common'),
            'iso_code' => data_get($country, 'codes.alpha_2'),
        ])
        ->sortBy('name')
        ->values();

    return Inertia::render('admin/Countries/Create', [
        'countries' => $countries,
    ]);
}

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'iso_code' => 'required|string|max:3|unique:countries,iso_code',
            'continent' => 'required|string|max:100',
        ]);

        Country::create($validated);

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $country = Country::findOrFail($id);

        return Inertia::render('admin/Countries/Show', [
            'country' => $country,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
public function edit($id)
{
    $country = Country::findOrFail($id);

    $response = Http::withToken(config('services.restcountries.key'))
        ->get('https://api.restcountries.com/countries/v5', [
            'region' => 'Africa',
            'limit' => 100,
            'response_fields' => 'names.common,codes.alpha_2',
        ]);

    if ($response->failed()) {
        return back()->withErrors([
            'countries' => 'Impossible de charger les pays.',
        ]);
    }

    $countries = collect($response->json('data.objects', []))
        ->filter(fn ($c) => data_get($c, 'codes.alpha_2') !== 'EH')
        ->map(fn ($c) => [
            'name' => data_get($c, 'names.common'),
            'iso_code' => data_get($c, 'codes.alpha_2'),
        ])
        ->sortBy('name')
        ->values();

    return Inertia::render('admin/Countries/Edit', [
        'country' => $country,
        'countries' => $countries,
    ]);
}

public function cities(Country $country): JsonResponse
{
    try {
        $response = Http::timeout(10)->post(
            'https://countriesnow.space/api/v0.1/countries/cities',
            [
                'country' => $country->name,
            ]
        );

        if (!$response->successful()) {
            return response()->json([
                'cities' => [],
                'message' => 'Impossible de récupérer les villes.',
            ], 200);
        }

        $cities = collect($response->json('data', []));

        // Maroc
        if (
            isset($country->iso_code) &&
            strtoupper($country->iso_code) === 'MA'
        ) {
            $saharaCities = [
                'Laâyoune',
                'Dakhla',
                'Boujdour',
                'Es-Semara',
                'Tarfaya',
                'Guelmim',
                'Tan-Tan',
                'Assa-Zag',
                'Aousserd',
            ];

            $cities = $cities->merge($saharaCities);
        }

        return response()->json([
            'cities' => $cities
                ->filter(fn ($city) => is_string($city))
                ->unique()
                ->sort()
                ->values()
                ->all(),
        ]);
    } catch (\Throwable $e) {
        \Log::error('Erreur récupération villes', [
            'country_id' => $country->id,
            'country_name' => $country->name,
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'cities' => [],
            'message' => 'Erreur lors du chargement des villes.',
        ], 200);
    }
}
public function peopleCities(string $country)
{
    $response = Http::post(
        'https://countriesnow.space/api/v0.1/countries/cities',
        [
            'country' => $country,
        ]
    );

    if (!$response->successful()) {
        return response()->json([
            'cities' => [],
        ], 500);
    }

    $cities = collect(
        $response->json('data', [])
    );

    if (strtolower($country) === 'morocco') {
        $saharaCities = [
            'Laâyoune',
            'Dakhla',
            'Boujdour',
            'Es-Semara',
            'Tarfaya',
            'Guelmim',
            'Tan-Tan',
            'Assa-Zag',
            'Aousserd',
        ];

        $cities = $cities->merge($saharaCities);
    }

    return response()->json([
        'cities' => $cities
            ->filter()
            ->unique()
            ->sort()
            ->values(),
    ]);
}
    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $country = Country::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'iso_code' => 'required|string|max:3|unique:countries,iso_code,' . $country->id,
            'continent' => 'required|string|max:100',
        ]);

        $country->update($validated);

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country updated successfully.');
    }

    /**
     * Soft Delete.
     */
    public function destroy($id)
    {
        $country = Country::findOrFail($id);

        $country->delete();

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country deleted successfully.');
    }
}