<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Exports\PublicationDownloadsExport;
use Maatwebsite\Excel\Facades\Excel;

class PublicationController extends Controller
{
    /**
     * Display a listing.
     */


        public function index()
        {
            $publications = Publication::withCount('downloads')
                ->latest()
                ->get();

            return Inertia::render('admin/Publications/Index', [
                'publications' => $publications,
            ]);
        }

        public function Indexdownloads(Publication $publication)
        {
            $downloads = $publication->downloads()
                ->latest()
                ->get(['id', 'name', 'email', 'ip_address', 'created_at']);

            return Inertia::render('admin/Publications/Downloads', [
                'publication' => $publication->only('id', 'title'),
                'downloads' => $downloads,
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

public function download(Request $request, Publication $publication)
{
    $validated = $request->validate([
        'name'  => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255'],
    ]);

    // Enregistrer la demande de téléchargement
    PublicationDownload::create([
        'publication_id' => $publication->id,
        'name'           => $validated['name'],
        'email'          => $validated['email'],
        'ip_address'     => $request->ip(),
    ]);

    // Vérifier que le PDF existe
    if (
        !$publication->pdf ||
        !Storage::disk('public')->exists($publication->pdf)
    ) {
        return response()->json([
            'success' => false,
            'message' => 'PDF not available.',
        ], 404);
    }

    // Télécharger directement le PDF
    return Storage::disk('public')->download(
        $publication->pdf,
        basename($publication->pdf),
        [
            'Content-Type' => 'application/pdf',
        ]
    );
}
    public function downloadsExport(Publication $publication)
    {
        $filename = 'inscriptions-' . str($publication->title)->slug() . '.xlsx';

        return Excel::download(new PublicationDownloadsExport($publication), $filename);
    }
}