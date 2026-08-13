<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Category;
use App\Models\Research;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResearchController extends Controller
{
    /**
     * Display all researches.
     */
    public function index()
    {
        $researches = Research::with(['author', 'category'])
            ->latest()
            ->get();

        return Inertia::render('admin/Researches/Index', [
            'researches' => $researches,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Researches/Create', [
            'authors' => Author::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Store research.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:researches,slug',
            'summary' => 'required|string',
            'content' => 'required|string',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'pdf' => 'nullable|mimes:pdf|',

            'author_id' => 'required|exists:authors,id',
            'category_id' => 'required|exists:categories,id',

            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('researches/images', 'public');
        }

        if ($request->hasFile('pdf')) {
            $validated['pdf'] = $request
                ->file('pdf')
                ->store('researches/pdfs', 'public');
        }

        Research::create($validated);

        return redirect()
            ->route('researches.index')
            ->with('success', 'Research created successfully.');
    }

    /**
     * Show one research.
     */
    public function show($id)
    {
        $research = Research::with(['author', 'category'])
            ->findOrFail($id);

        return Inertia::render('admin/Researches/Show', [
            'research' => $research,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $research = Research::findOrFail($id);

        return Inertia::render('admin/Researches/Edit', [
            'research' => $research,
            'authors' => Author::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Update research.
     */
    public function update(Request $request, $id)
    {
        $research = Research::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:researches,slug,' . $research->id,

            'summary' => 'required|string',
            'content' => 'required|string',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'pdf' => 'nullable|mimes:pdf|',

            'author_id' => 'required|exists:authors,id',
            'category_id' => 'required|exists:categories,id',

            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('featured_image')) {

            if (
                $research->featured_image &&
                Storage::disk('public')->exists($research->featured_image)
            ) {
                Storage::disk('public')->delete($research->featured_image);
            }

            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('researches/images', 'public');
        } else {
            $validated['featured_image'] = $research->featured_image;
        }

        if ($request->hasFile('pdf')) {

            if (
                $research->pdf &&
                Storage::disk('public')->exists($research->pdf)
            ) {
                Storage::disk('public')->delete($research->pdf);
            }

            $validated['pdf'] = $request
                ->file('pdf')
                ->store('researches/pdfs', 'public');
        } else {
            $validated['pdf'] = $research->pdf;
        }

        $research->update($validated);

        return redirect()
            ->route('researches.index')
            ->with('success', 'Research updated successfully.');
    }

    /**
     * Soft delete.
     */
    public function destroy($id)
    {
        $research = Research::findOrFail($id);

        $research->delete();

        return redirect()
            ->route('researches.index')
            ->with('success', 'Research deleted successfully.');
    }
}