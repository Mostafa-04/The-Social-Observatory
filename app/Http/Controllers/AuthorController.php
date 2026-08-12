<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AuthorController extends Controller
{
    /**
     * Display a listing of authors.
     */
    public function index()
    {
        $authors = Author::latest()->get();

        return Inertia::render('admin/Authors/Index', [
            'authors' => $authors,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Authors/Create');
    }

    /**
     * Store a newly created author.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'linkedin' => 'nullable|url|max:255',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('authors', 'public');
        }

        Author::create($validated);

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author created successfully.');
    }

    /**
     * Show one author.
     */
    public function show($id)
    {
        $author = Author::findOrFail($id);

        return Inertia::render('admin/Authors/Show', [
            'author' => $author,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $author = Author::findOrFail($id);

        return Inertia::render('admin/Authors/Edit', [
            'author' => $author,
        ]);
    }

    /**
     * Update an author.
     */
    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'linkedin' => 'nullable|url|max:255',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        if ($request->hasFile('photo')) {

            if (
                $author->photo &&
                Storage::disk('public')->exists($author->photo)
            ) {
                Storage::disk('public')->delete($author->photo);
            }

            $validated['photo'] = $request->file('photo')->store('authors', 'public');
        } else {
            $validated['photo'] = $author->photo;
        }

        $author->update($validated);

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author updated successfully.');
    }

    /**
     * Soft delete author.
     */
    public function destroy($id)
    {
        $author = Author::findOrFail($id);

        $author->delete();

        return redirect()
            ->route('authors.index')
            ->with('success', 'Author deleted successfully.');
    }
}