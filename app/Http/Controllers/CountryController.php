<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('admin/Countries/Create');
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

        return Inertia::render('admin/Countries/Edit', [
            'country' => $country,
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