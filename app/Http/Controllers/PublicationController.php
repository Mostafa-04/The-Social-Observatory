<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Display a listing.
     */
    public function index()
    {
        $publications = Publication::latest()->get();

        return Inertia::render('admin/Publications/Index', [
            'publications' => $publications,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Publications/Create');
    }

    /**
     * Store publication.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',

            'type' => 'required|in:book,report,policy_brief,white_paper,study',

            'description' => 'nullable|string',

            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'pdf' => 'nullable|mimes:pdf|',

            'pages' => 'nullable|integer|min:1',

            'language' => 'required|string|max:10',

            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request
                ->file('cover_image')
                ->store('publications/images', 'public');
        }

        if ($request->hasFile('pdf')) {
            $validated['pdf'] = $request
                ->file('pdf')
                ->store('publications/pdfs', 'public');
        }

        Publication::create($validated);

        return redirect()
            ->route('publications.index')
            ->with('success', 'Publication created successfully.');
    }

    /**
     * Show publication.
     */
    public function show($id)
    {
        $publication = Publication::findOrFail($id);

        return Inertia::render('admin/Publications/Show', [
            'publication' => $publication,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $publication = Publication::findOrFail($id);

        return Inertia::render('admin/Publications/Edit', [
            'publication' => $publication,
        ]);
    }

    /**
     * Update publication.
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',

            'type' => 'required|in:book,report,policy_brief,white_paper,study',

            'description' => 'nullable|string',

            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'pdf' => 'nullable|mimes:pdf|',

            'pages' => 'nullable|integer|min:1',

            'language' => 'required|string|max:10',

            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('cover_image')) {

            if (
                $publication->cover_image &&
                Storage::disk('public')->exists($publication->cover_image)
            ) {
                Storage::disk('public')->delete($publication->cover_image);
            }

            $validated['cover_image'] = $request
                ->file('cover_image')
                ->store('publications/images', 'public');
        } else {
            $validated['cover_image'] = $publication->cover_image;
        }

        if ($request->hasFile('pdf')) {

            if (
                $publication->pdf &&
                Storage::disk('public')->exists($publication->pdf)
            ) {
                Storage::disk('public')->delete($publication->pdf);
            }

            $validated['pdf'] = $request
                ->file('pdf')
                ->store('publications/pdfs', 'public');
        } else {
            $validated['pdf'] = $publication->pdf;
        }

        $publication->update($validated);

        return redirect()
            ->route('publications.index')
            ->with('success', 'Publication updated successfully.');
    }

    /**
     * Soft delete publication.
     */
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

        $publication->delete();

        return redirect()
            ->route('publications.index')
            ->with('success', 'Publication deleted successfully.');
    }
}