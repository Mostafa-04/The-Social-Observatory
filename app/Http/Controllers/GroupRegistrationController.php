<?php

namespace App\Http\Controllers;

use App\Models\GroupRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Jobs\SendGroupRegistrationConfirmationEmailJob;
use App\Services\PersonService;
use App\Imports\GroupRegistrationsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendGroupRegistrationEmail;
class GroupRegistrationController extends Controller
{

    public function create()
    {

        return Inertia::render('client/JoinGroupForm');
    }
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'group_type'       => ['required', 'in:human_capital,gender_inclusion,health_social_protection,mobility_migration,governance_democracy'],
            'full_name'        => ['required', 'string', 'min:3', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'gender'         => ['nullable', 'in:H,F'],
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
            'gender.in'             => 'Veuillez sélectionner un genre valide.',
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

        $registration = GroupRegistration::create($validated);

        $names = preg_split('/\s+/', trim($registration->full_name), 2);

        app(PersonService::class)->findOrCreate([
            'first_name' => $names[0] ?? '',
            'last_name' => $names[1] ?? '',
            'email' => $registration->email,
            'gender' => $registration->gender,
        ]);

        $groupLabels = [
            'human_capital' => 'Groupe de Travail 1 — Capital Humain, Éducation et Emploi',
            'gender_inclusion' => 'Groupe de Travail 2 — Inclusion Genre, Travail Invisible et Sécurité Sociale',
            'health_social_protection' => 'Groupe de Travail 3 — Santé de la Population et Protection Sociale',
            'mobility_migration' => 'Groupe de Travail 4 — Mobilité, Migration et Intégration',
            'governance_democracy' => 'Groupe de Travail 5 — Gouvernance, Démocratie et Engagement Citoyen',
        ];

        SendGroupRegistrationConfirmationEmailJob::dispatch(
            $registration->email,
            $registration->full_name,
            $groupLabels[$registration->group_type] ?? $registration->group_type,
        );

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

public function import(Request $request)
{
    $request->validate([
        'file' => [
            'required',
            'file',
            'mimes:xlsx,xls',
            'max:10240',
        ],
    ]);

    $import = new GroupRegistrationsImport();

    Excel::import(
        $import,
        $request->file('file')
    );

    return back()->with([
        'success' => 'Les inscriptions ont été importées avec succès.',
        'imported_count' => $import->importedCount,
    ]);
}


public function sendEmail(Request $request)
{
    $validated = $request->validate([
        'subject'          => 'required|string|max:255',
        'message'          => 'required|string',
        'select_all'       => 'boolean',
        'ids'              => 'array',
        'ids.*'            => 'integer|exists:group_registrations,id',
        'search'           => 'nullable|string',
        'group_type'       => 'nullable|string',
        'attachments'      => 'nullable|array',
        'attachments.*'    => 'file|max:10240', // 10 Mo par fichier
    ]);
 
    // Détermine les destinataires : soit "tous ceux qui correspondent aux filtres
    // actuels" (select_all = true, quel que soit le nombre de pages), soit une
    // liste précise d'IDs cochés à la main.
    if ($request->boolean('select_all')) {
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
            ->get();
    } else {
        $registrations = GroupRegistration::whereIn('id', $validated['ids'] ?? [])->get();
    }
 
    if ($registrations->isEmpty()) {
        return back()->withErrors([
            'ids' => "Aucun destinataire sélectionné.",
        ]);
    }
 
    // Les pièces jointes sont stockées une seule fois puis partagées par tous
    // les jobs (un job par destinataire) pour éviter de dupliquer l'upload.
    $attachmentPaths = [];
 
    if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
            $attachmentPaths[] = $file->store('email-attachments', 'local');
        }
    }
 
    foreach ($registrations as $registration) {
        SendGroupRegistrationEmail::dispatch(
            $registration->email,
            $registration->full_name,
            $validated['subject'],
            $validated['message'],
            $attachmentPaths
        );
    }
 
    return back()->with('flash', [
        'email_sent'  => true,
        'sent_count'  => $registrations->count(),
    ]);
}
}