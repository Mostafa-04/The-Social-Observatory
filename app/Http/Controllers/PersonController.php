<?php

namespace App\Http\Controllers;

use App\Models\EventRegistration;
use App\Models\GroupRegistration;
use App\Models\IapsSubmission;
use App\Models\ObservatoryContact;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Jobs\SendPersonEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class PersonController extends Controller
{

        private const GROUPS = [
        'jeunesse'       => 'Groupe de Travail 1 — Jeunesse, Éducation et Emploi',
        'femmes'         => 'Groupe de Travail 2 — Femmes, Travail Invisible et Sécurité Sociale',
        'vieillissement' => 'Groupe de Travail 3 — Vieillissement, Santé de la Population et Transitions Démographiques',
        'pacte'          => 'Groupe de Travail 4 — Pacte National, Territoires et Engagement Citoyen',
    ];
    /**
     * Une seule source de vérité pour la recherche :
     * utilisée par index() ET par sendEmail(), pour que
     * "tout sélectionner" corresponde exactement aux résultats affichés.
     */
    private function applySearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }
 
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('organisation', 'like', "%{$search}%")
                ->orWhere('role', 'like', "%{$search}%");
        });
    }
 
/*
|--------------------------------------------------------------------------
| Remplacez votre méthode index() actuelle par celle-ci, et ajoutez les
| 3 méthodes privées juste après applySearch(). GROUPS reste inchangé.
|--------------------------------------------------------------------------
| Nouveaux filtres, tous combinables entre eux et avec "search" :
|  - country : correspondance exacte sur people.country
|  - gender  : correspondance exacte sur people.gender (M / F)
|  - source  : où la personne est-elle inscrite ailleurs ?
|              'group'   -> group_registrations (avec sous-filtre group_type)
|              'contact' -> observatory_contacts
|              'iaps'    -> iaps_submissions
|              'event'   -> event_registrations
|  - group_type : un des 4 groupes de GROUPS, utilisé seulement si source=group
|
| Le rapprochement se fait par email (et par téléphone quand la table
| cible n'a pas toujours d'email), exactement comme dans history().
|--------------------------------------------------------------------------
*/
 

 
/**
 * Personne présente dans group_registrations, en correspondant par email.
 * $groupType (optionnel) restreint à un groupe de travail précis.
 */
private function applyGroupFilter(Builder $query, ?string $groupType): Builder
{
    return $query->whereExists(function ($sub) use ($groupType) {
        $sub->select(DB::raw(1))
            ->from('group_registrations')
            ->whereColumn('group_registrations.email', 'people.email')
            ->when($groupType, fn ($q) => $q->where('group_registrations.group_type', $groupType));
    });
}
 
/** Personne présente dans observatory_contacts, par email OU téléphone. */
private function applyContactFilter(Builder $query): Builder
{
    return $query->whereExists(function ($sub) {
        $sub->select(DB::raw(1))
            ->from('observatory_contacts')
            ->where(function ($q) {
                $q->whereColumn('observatory_contacts.email', 'people.email')
                    ->orWhereColumn('observatory_contacts.phone', 'people.phone');
            });
    });
}
 
/** Personne présente dans iaps_submissions, par email OU téléphone. */
private function applyIapsFilter(Builder $query): Builder
{
    return $query->whereExists(function ($sub) {
        $sub->select(DB::raw(1))
            ->from('iaps_submissions')
            ->where(function ($q) {
                $q->whereColumn('iaps_submissions.email', 'people.email')
                    ->orWhereColumn('iaps_submissions.phone', 'people.phone');
            });
    });
}
 
/** Personne présente dans event_registrations, par téléphone. */
private function applyEventFilter(Builder $query): Builder
{
    return $query->whereExists(function ($sub) {
        $sub->select(DB::raw(1))
            ->from('event_registrations')
            ->whereColumn('event_registrations.phone', 'people.phone');
    });
}
 
public function index(Request $request)
{
    $search    = $request->input('search');
    $country   = $request->input('country');
    $gender    = $request->input('gender');
    $source    = $request->input('source');      // group | contact | iaps | event
    $groupType = $request->input('group_type');  // utilisé seulement si source = group
 
    $people = $this->applySearch(Person::query(), $search)
        ->when($country, fn ($q, $c) => $q->where('country', $c))
        ->when($gender, fn ($q, $g) => $q->where('gender', $g))
        ->when($source === 'group', fn ($q) => $this->applyGroupFilter($q, $groupType))
        ->when($source === 'contact', fn ($q) => $this->applyContactFilter($q))
        ->when($source === 'iaps', fn ($q) => $this->applyIapsFilter($q))
        ->when($source === 'event', fn ($q) => $this->applyEventFilter($q))
        ->select([
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'organisation',
            'role',
            'gender',
            'country',
            'linkedin',
        ])
        ->orderBy('last_name')
        ->orderBy('first_name')
        ->paginate(50)
        ->withQueryString();
 
    return Inertia::render('admin/People/Index', [
        'people' => $people,
        'groups' => self::GROUPS,
        'filters' => [
            'search'     => $search,
            'country'    => $country,
            'gender'     => $gender,
            'source'     => $source,
            'group_type' => $groupType,
        ],
    ]);
}
 
    public function sendEmail(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'select_all' => ['required', 'boolean'],
            'search' => ['nullable', 'string', 'max:255'],
            'people' => ['nullable', 'array'],
            'people.*' => ['integer'],
            'excluded_people' => ['nullable', 'array'],
            'excluded_people.*' => ['integer'],
            'files' => ['nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip'],
        ]);
 
        // 1) Construire la liste des destinataires
        $query = Person::query()
            ->whereNotNull('email')
            ->where('email', '!=', '');
 
        if ($request->boolean('select_all')) {
            $this->applySearch($query, $data['search'] ?? null);
 
            if (! empty($data['excluded_people'])) {
                $query->whereNotIn('id', $data['excluded_people']);
            }
        } else {
            $query->whereIn('id', $data['people'] ?? []);
        }
 
        $count = (clone $query)->count();
 
        if ($count === 0) {
            return response()->json([
                'message' => "Aucune personne avec une adresse email valide n'a été trouvée.",
            ], 422);
        }
 
        // 2) Stocker les pièces jointes
        $attachments = collect($request->file('files', []))
            ->map(fn ($file) => [
                'path' => $file->store('mail-attachments'),
                'name' => $file->getClientOriginalName(),
            ])
            ->all();
 
        // 3) Un job par destinataire, par paquets
        $query->select(['id', 'email'])
            ->chunkById(200, function ($chunk) use ($data, $attachments) {
                foreach ($chunk as $person) {
                    SendPersonEmail::dispatch(
                        $person->email,
                        $data['subject'],
                        $data['message'],
                        $attachments
                    );
                }
            });
 
        return response()->json([
            'message' => "Envoi en cours pour {$count} personne(s).",
        ]);
    }

    public function history(Person $person)
    {
        /*
        |--------------------------------------------------------------------------
        | IAPS
        |--------------------------------------------------------------------------
        */
        $iaps = IapsSubmission::query()
            ->where(function ($query) use ($person) {
                if ($person->email) {
                    $query->where('email', $person->email);
                }
                if ($person->phone) {
                    $query->orWhere('phone', $person->phone);
                }
            })
            ->get();
 
        /*
        |--------------------------------------------------------------------------
        | Observatory Contacts
        |--------------------------------------------------------------------------
        */
        $contacts = ObservatoryContact::query()
            ->where(function ($query) use ($person) {
                if ($person->email) {
                    $query->where('email', $person->email);
                }
                if ($person->phone) {
                    $query->orWhere('phone', $person->phone);
                }
            })
            ->get();
 
        /*
        |--------------------------------------------------------------------------
        | Group registrations
        |--------------------------------------------------------------------------
        */
        $groupsRaw = GroupRegistration::query()
            ->when(
                $person->email,
                fn ($query) => $query->where('email', $person->email)
            )
            ->get();
 
        // إضافة اسم المجموعة الكامل
        $groups = $groupsRaw->map(function ($group) {
            $group->group_name = self::GROUPS[$group->group_type] ?? $group->group_type;
            return $group;
        })->all();
 
        /*
        |--------------------------------------------------------------------------
        | Event registrations
        |--------------------------------------------------------------------------
        */
        $events = $person->phone
            ? EventRegistration::query()
                ->where('phone', $person->phone)
                ->get()
            : collect();
 
        return Inertia::render('admin/People/History', [
            'person' => $person,
            'groups' => self::GROUPS,
            'history' => [
                'iaps' => $iaps,
                'contacts' => $contacts,
                'groups' => $groups,
                'events' => $events,
            ],
        ]);
    }
 

    public function create()
    {
       

        return Inertia::render('admin/People/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:M,F,O'],
            'email' => ['required', 'email', 'max:255', 'unique:people,email'],
            'phone' => ['required', 'string', 'max:50', 'unique:people,phone'],
            'role' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255', 'url'],
        ]);

        Person::create($data);

        return redirect()
            ->route('people.index')
            ->with('success', 'Personne ajoutée avec succès.');
    }


        public function storeForm(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:M,F,O'],
            'email' => ['required', 'email', 'max:255', 'unique:people,email'],
            'phone' => ['required', 'string', 'max:50', 'unique:people,phone'],
            'role' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255', 'url'],
        ]);

        Person::create($data);

        return redirect()
            ->route('client.home')
            ->with('success', 'Personne ajoutée avec succès.');
    }


    public function Formlaire()
    {
       

        return Inertia::render('admin/People/Formlaire');
    }
}