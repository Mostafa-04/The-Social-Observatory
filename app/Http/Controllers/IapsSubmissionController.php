<?php

namespace App\Http\Controllers;

use App\Models\IapsSubmission;
use App\Models\Publication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Jobs\SendIapsSubmissionConfirmationEmailJob;
use App\Services\PersonService;
use App\Jobs\DispatchIapsBulkEmailJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;


class IapsSubmissionController extends Controller
{
    /**
     * Afficher le formulaire IAPS.
     */
    public function create(Publication $publication): Response
    {
        return Inertia::render('client/publication/IapsForm', [
            'publication' => $publication,
        ]);
    }

    /**
     * Enregistrer une soumission IAPS.
     */
    public function store(
        Request $request,
        Publication $publication
    ): RedirectResponse {
        $validated = $request->validate([
            /*
            |--------------------------------------------------------------------------
            | SECTION 1 — Coordonnées
            |--------------------------------------------------------------------------
            */

            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'gender' => ['nullable', 'in:H,F'],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:50',
            ],

            'languages' => [
                'required',
                'array',
                'min:1',
            ],

            'languages.*' => [
                'string',
                'max:100',
            ],

            'participant_type' => [
                'required',
                'in:individual,organization',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 2 — Personne physique
            |--------------------------------------------------------------------------
            */

            'individual_profile' => [
                'nullable',
                'string',
                'max:255',
            ],

            'organization_affiliation' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'disciplines' => [
                'nullable',
                'array',
                'max:3',
            ],

            'disciplines.*' => [
                'string',
                'max:255',
            ],

            'other_discipline' => [
                'nullable',
                'string',
                'max:255',
            ],

            'observation_regions' => [
                'nullable',
                'array',
            ],

            'observation_regions.*' => [
                'string',
                'max:100',
            ],

            'observation_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'diaspora_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'observation_location' => [
                'nullable',
                'string',
                'max:500',
            ],

            'contribution_methods' => [
                'nullable',
                'array',
            ],

            'contribution_methods.*' => [
                'string',
                'max:255',
            ],

            'other_contribution_method' => [
                'nullable',
                'string',
                'max:1000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 3 — Personne morale
            |--------------------------------------------------------------------------
            */

            'entity_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'representative_role' => [
                'nullable',
                'string',
                'max:255',
            ],

            'entity_type' => [
                'nullable',
                'string',
                'max:255',
            ],

            'intervention_scale' => [
                'nullable',
                'string',
                'max:255',
            ],

            'headquarters_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'international_country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'headquarters_city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'motivations' => [
                'nullable',
                'array',
                'max:2',
            ],

            'motivations.*' => [
                'string',
                'max:255',
            ],

            'other_motivation' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'partnership_opportunities' => [
                'nullable',
                'array',
            ],

            'partnership_opportunities.*' => [
                'string',
                'max:255',
            ],

            'other_partnership' => [
                'nullable',
                'string',
                'max:1000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 4 — Cœur thématique
            |--------------------------------------------------------------------------
            */

            'blind_spots' => [
                'nullable',
                'array',
                'max:3',
            ],

            'blind_spots.*' => [
                'string',
                'max:255',
            ],

            'other_blind_spot' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'field_testimony' => [
                'nullable',
                'string',
                'max:10000',
            ],

            /*
            |--------------------------------------------------------------------------
            | SECTION 5 — Engagement éthique
            |--------------------------------------------------------------------------
            */

            'ethical_consent' => [
                'required',
                'accepted',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Sécurité : on force la publication depuis la route
        |--------------------------------------------------------------------------
        */

        $validated['publication_id'] = $publication->id;

        /*
        |--------------------------------------------------------------------------
        | Enregistrement
        |--------------------------------------------------------------------------
        */

        $submission = IapsSubmission::create($validated);
        $names = preg_split('/\s+/', trim($submission->full_name), 2);

        app(PersonService::class)->findOrCreate([
            'first_name' => $names[0] ?? '',
            'last_name' => $names[1] ?? '',
            'email' => $submission->email,
            'phone' => $submission->phone,
            'organisation' => $submission->organization_affiliation,
            'gender' => $submission->gender,
        ]);
        SendIapsSubmissionConfirmationEmailJob::dispatch(
            $submission->email,
            $submission->full_name,
            $publication->title,
        );

        return redirect()
            ->route('publication.show.client', $publication)
            ->with(
                'success',
                'Votre contribution a été enregistrée avec succès.'
            );
    }

       /**
     * Liste paginée des soumissions IAPS, avec recherche et filtre par type.
     */
    public function index(Request $request)
    {
        $submissions = IapsSubmission::query()
            ->with('publication:id,title')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
 
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('entity_name', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('participant_type'), function ($query) use ($request) {
                $query->where('participant_type', $request->string('participant_type'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();
 
        return Inertia::render('admin/IapsSubmissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['search', 'participant_type']),
        ]);
    }
 
    /**
     * Détail organisé d'une soumission IAPS.
     */
    public function show(IapsSubmission $iapsSubmission)
    {
        $iapsSubmission->load('publication:id,title');
 
        return Inertia::render('admin/IapsSubmissions/Show', [
            'submission' => $iapsSubmission,
        ]);
    }

       /**
     * Prépare l'envoi en masse : validation, stockage des pièces jointes,
     * puis délégation à la file d'attente (php artisan queue:work).
     * La requête HTTP répond immédiatement, même pour des milliers de destinataires.
     */
    public function sendEmail(Request $request): JsonResponse
    {
        $selectAll = $request->boolean('select_all');
 
        $data = $request->validate([
            'subject'                => ['required', 'string', 'max:255'],
            'message'                => ['required', 'string'],
            'select_all'             => ['required', 'boolean'],
            'submissions'            => [Rule::requiredIf(! $selectAll), 'array'],
            'submissions.*'          => ['integer'],
            'excluded_submissions'   => ['nullable', 'array'],
            'excluded_submissions.*' => ['integer'],
            'search'                 => ['nullable', 'string', 'max:255'],
            'participant_type'       => ['nullable', Rule::in(['individual', 'organization'])],
            'files'                  => ['nullable', 'array', 'max:10'],
            'files.*'                => [
                'file',
                'max:10240', // 10 Mo par fichier
                'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip',
            ],
        ], [
            'submissions.required' => 'Veuillez sélectionner au moins une soumission.',
            'subject.required'     => "Veuillez saisir l'objet du message.",
            'message.required'     => 'Veuillez saisir le message.',
            'files.*.max'          => 'Chaque fichier doit faire 10 Mo au maximum.',
            'files.*.mimes'        => "Ce type de fichier n'est pas autorisé.",
        ]);
 
        $ids         = $data['submissions'] ?? [];
        $excludedIds = $data['excluded_submissions'] ?? [];
        $search      = $data['search'] ?? null;
        $type        = $data['participant_type'] ?? null;
 
        $message = $this->sanitizeHtml($data['message']);
 
        if (trim(strip_tags($message)) === '') {
            throw ValidationException::withMessages([
                'message' => 'Veuillez saisir le message.',
            ]);
        }
 
        // Nombre de destinataires réels (avec adresse email)
        $count = IapsSubmission::query()
            ->filterBy($search, $type)
            ->withEmail()
            ->selection($selectAll, $ids, $excludedIds)
            ->count();
 
        if ($count === 0) {
            return response()->json([
                'message' => 'Aucune adresse email valide dans cette sélection.',
            ], 422);
        }
 
        // Pièces jointes : stockées UNE fois, partagées par tous les jobs
        $dir         = 'bulk-mail/' . Str::uuid();
        $attachments = [];
 
        foreach ($request->file('files', []) as $file) {
            $attachments[] = [
                'path' => $file->store($dir, 'local'),
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
            ];
        }
 
        // Contenu de la campagne, lu par chaque job (évite de le dupliquer dans la table jobs)
        Storage::disk('local')->put("{$dir}/campaign.json", json_encode([
            'subject'     => $data['subject'],
            'message'     => $message,
            'attachments' => $attachments,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
 
        DispatchIapsBulkEmailJob::dispatch(
            $dir,
            $selectAll,
            array_map('intval', $ids),
            array_map('intval', $excludedIds),
            $search,
            $type
        );
 
        return response()->json([
            'message' => "L'envoi a été lancé pour {$count} destinataire(s). Les emails partent en arrière-plan.",
        ]);
    }
 
    /** Nettoie le HTML produit par Quill avant de l'envoyer par email. */
    private function sanitizeHtml(string $html): string
    {
        $html = strip_tags(
            $html,
            '<p><br><strong><em><u><s><ol><ul><li><a><h1><h2><h3><blockquote>'
        );
 
        // Supprime les attributs d'événements (onclick=...) et les liens javascript:
        $html = preg_replace('/\son\w+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $html);
        $html = preg_replace('/(href\s*=\s*["\'])\s*javascript:[^"\']*/i', '$1#', $html);
 
        return $html;
    }
}