<?php

namespace App\Http\Controllers;

use App\Models\GroupRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupRegistrationController extends Controller
{

    public function create()
    {

        return Inertia::render('client/JoinGroupForm');
    }
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'group_type'       => ['required', 'in:jeunesse,femmes,vieillissement,pacte'],
            'full_name'        => ['required', 'string', 'min:3', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'linkedin_url'     => ['nullable', 'url', 'max:255'],
            'cv'               => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'], // 10 Mo
            'presentation'     => ['required', 'string', 'max:250'],
            'expertise_domain' => ['nullable', 'string', 'max:255'],
            'motivation'       => ['nullable', 'string', 'max:2000'],
        ], [
            'group_type.required'   => 'Veuillez sélectionner un groupe.',
            'full_name.required'    => 'Le nom complet est requis.',
            'full_name.min'         => 'Le nom doit contenir au moins 3 caractères.',
            'email.required'        => "L'e-mail est requis.",
            'email.email'           => "Veuillez entrer une adresse e-mail valide.",
            'linkedin_url.url'      => "Le lien LinkedIn doit être une URL valide.",
            'cv.mimes'               => 'Le CV doit être au format PDF, DOC ou DOCX.',
            'cv.max'                 => 'Le CV ne doit pas dépasser 10 Mo.',
            'presentation.required' => 'Veuillez vous présenter.',
            'presentation.max'      => 'La présentation ne doit pas dépasser 250 caractères.',
        ]);

        if ($request->hasFile('cv')) {
            $validated['cv_path'] = $request->file('cv')->store('cvs', 'public');
        }
        unset($validated['cv']);

        GroupRegistration::create($validated);

        return back()->with('success', 'Votre inscription a été envoyée avec succès.');
    }

       /**
     * Liste paginée des inscriptions aux groupes de travail, avec recherche
     * et filtre par groupe.
     */
    public function index(Request $request)
    {
        $registrations = GroupRegistration::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
 
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('expertise_domain', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('group_type'), function ($query) use ($request) {
                $query->where('group_type', $request->string('group_type'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();
 
        return Inertia::render('admin/GroupRegistrations/Index', [
            'registrations' => $registrations,
            'filters' => $request->only(['search', 'group_type']),
            'groups' => GroupRegistration::GROUPS,
        ]);
    }
 
    /**
     * Détail organisé d'une inscription à un groupe de travail.
     */
    public function show(GroupRegistration $groupRegistration)
    {
        return Inertia::render('admin/GroupRegistrations/Show', [
            'registration' => $groupRegistration,
        ]);
    }
}