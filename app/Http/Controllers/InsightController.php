<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Category;
use App\Models\Insight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InsightController extends Controller
{
    /**
     * Display all insights.
     */
    public function index()
    {
        $insights = Insight::with(['category', 'author'])
            ->latest()
            ->get();

        return Inertia::render('admin/Insights/Index', [
            'insights' => $insights,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Insights/Create', [
            'categories' => Category::orderBy('name')->get(),
            'authors' => Author::orderBy('name')->get(),
        ]);
    }

    /**
     * Store insight.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:insights,slug',

            'excerpt' => 'nullable|string',

            'content' => 'required|string',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'category_id' => 'nullable|exists:categories,id',
            'author_id' => 'nullable|exists:authors,id',

            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('insights/images', 'public');
        }

        Insight::create($validated);

        return redirect()
            ->route('insights.index')
            ->with('success', 'Insight created successfully.');
    }

    /**
     * Show insight.
     */
    public function show($id)
    {
        $insight = Insight::with(['category', 'author'])
            ->findOrFail($id);

        return Inertia::render('admin/Insights/Show', [
            'insight' => $insight,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $insight = Insight::findOrFail($id);

        return Inertia::render('admin/Insights/Edit', [
            'insight' => $insight,
            'categories' => Category::orderBy('name')->get(),
            'authors' => Author::orderBy('name')->get(),
        ]);
    }

    /**
     * Update insight.
     */
    public function update(Request $request, $id)
    {
        $insight = Insight::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:insights,slug,' . $id,

            'excerpt' => 'nullable|string',

            'content' => 'required|string',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'category_id' => 'nullable|exists:categories,id',
            'author_id' => 'nullable|exists:authors,id',

            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('featured_image')) {

            if (
                $insight->featured_image &&
                Storage::disk('public')->exists($insight->featured_image)
            ) {
                Storage::disk('public')->delete($insight->featured_image);
            }

            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('insights/images', 'public');
        } else {
            $validated['featured_image'] = $insight->featured_image;
        }

        $insight->update($validated);

        return redirect()
            ->route('insights.index')
            ->with('success', 'Insight updated successfully.');
    }

    /**
     * Soft delete insight.
     */
    public function destroy($id)
    {
        $insight = Insight::findOrFail($id);

        $insight->delete();

        return redirect()
            ->route('insights.index')
            ->with('success', 'Insight deleted successfully.');
    }
}