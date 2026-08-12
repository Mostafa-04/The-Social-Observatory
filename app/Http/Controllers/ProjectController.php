<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Partner;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display all projects.
     */
    public function index()
    {
        $projects = Project::with(['country', 'partner'])
            ->latest()
            ->get();

        return Inertia::render('admin/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Open create page.
     */
    public function create()
    {
        return Inertia::render('admin/Projects/Create', [
            'countries' => Country::orderBy('name')->get(),
            'partners' => Partner::orderBy('name')->get(),
        ]);
    }

    /**
     * Store project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'objective' => 'nullable|string',

            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',

            'status' => 'required|in:planned,ongoing,completed,cancelled',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'country_id' => 'required|exists:countries,id',
            'partner_id' => 'nullable|exists:partners,id',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('projects/images', 'public');
        }

        Project::create($validated);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Show project.
     */
    public function show($id)
    {
        $project = Project::with(['country', 'partner'])
            ->findOrFail($id);

        return Inertia::render('admin/Projects/Show', [
            'project' => $project,
        ]);
    }

    /**
     * Open edit page.
     */
    public function edit($id)
    {
        $project = Project::findOrFail($id);

        return Inertia::render('admin/Projects/Edit', [
            'project' => $project,
            'countries' => Country::orderBy('name')->get(),
            'partners' => Partner::orderBy('name')->get(),
        ]);
    }

    /**
     * Update project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'objective' => 'nullable|string',

            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',

            'status' => 'required|in:planned,ongoing,completed,cancelled',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            'country_id' => 'required|exists:countries,id',
            'partner_id' => 'nullable|exists:partners,id',
        ]);

        if ($request->hasFile('featured_image')) {

            if (
                $project->featured_image &&
                Storage::disk('public')->exists($project->featured_image)
            ) {
                Storage::disk('public')->delete($project->featured_image);
            }

            $validated['featured_image'] = $request
                ->file('featured_image')
                ->store('projects/images', 'public');
        } else {
            $validated['featured_image'] = $project->featured_image;
        }

        $project->update($validated);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Soft delete project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        $project->delete();

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}