<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display all categories.
     */
    public function index()
    {
        return Inertia::render('admin/Categories/Index', [
            'categories' => Category::latest()->get(),
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Categories/Create');
    }

    /**
     * Store new category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|unique:categories,slug',
            'description' => 'nullable|string',
            'type'        => 'required|in:research,publication,insight',
        ]);

        $validated['slug'] = $validated['slug']
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        Category::create($validated);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display one category.
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('admin/Categories/Show', [
            'category' => $category,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update category.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'type'        => 'required|in:research,publication,insight',
        ]);

        $validated['slug'] = $validated['slug']
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $category->update($validated);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Soft Delete.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete(); // Soft Delete

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}