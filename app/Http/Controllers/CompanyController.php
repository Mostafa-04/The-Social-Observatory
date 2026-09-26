<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use App\Jobs\SendCompanyEmailJob;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
 


class CompanyController extends Controller
{
    /**
     * Liste des entreprises
     */
public function index(Request $request): Response
{
    $filters = $request->only(['search', 'sector', 'country', 'city']);
 
    $companies = Company::query()
        ->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_first_name', 'like', "%{$search}%")
                    ->orWhere('contact_last_name', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%");
            });
        })
        ->when($filters['sector'] ?? null, fn ($query, $sector) => $query->where('sector', $sector))
        ->when($filters['country'] ?? null, fn ($query, $country) => $query->where('country', $country))
        ->when($filters['city'] ?? null, fn ($query, $city) => $query->where('city', $city))
        ->latest()
        ->paginate(10)
        ->withQueryString();
 
    return Inertia::render('admin/Companies/Index', [
        'companies' => $companies,
        'filters'   => $filters,
 
        // Le pays/ville viennent maintenant de /api/countries côté frontend ;
        // seul le secteur reste basé sur les données réellement présentes.
        'filterOptions' => [
            'sectors' => Company::query()->whereNotNull('sector')->distinct()->orderBy('sector')->pluck('sector'),
        ],
    ]);
}

    /**
     * Formulaire admin - ajouter une entreprise
     */
    public function create(): Response
    {
        return Inertia::render('admin/Companies/Create');
    }

    /**
     * Enregistrer une entreprise depuis l'admin
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request);

        Company::create($validated);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Entreprise ajoutée avec succès.');
    }

    /**
     * Afficher une entreprise
     */
    public function show(Company $company): Response
    {
        return Inertia::render('admin/Companies/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Règles de validation communes, alignées sur les colonnes
     * réelles de la table companies (fillable du modèle Company).
     */
    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],

            'contact_gender' => ['nullable', 'string', 'max:20'],
            'contact_last_name' => ['nullable', 'string', 'max:255'],
            'contact_first_name' => ['nullable', 'string', 'max:255'],
            'contact_position' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],

            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);
    }

    /**
     * Envoyer un email aux entreprises sélectionnées
     * ou à toutes les entreprises.
     */
    public function sendEmail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_ids' => ['nullable', 'array'],
            'company_ids.*' => [
                'integer',
                'exists:companies,id',
            ],

            'send_to_all' => ['required', 'boolean'],

            'subject' => [
                'required',
                'string',
                'max:255',
            ],

            'message' => [
                'required',
                'string',
            ],

            'attachments' => [
                'nullable',
                'array',
                'max:10',
            ],

            'attachments.*' => [
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Vérifier la sélection
        |--------------------------------------------------------------------------
        */

        if (
            !$validated['send_to_all']
            && empty($validated['company_ids'])
        ) {
            return back()->withErrors([
                'company_ids' => 'Veuillez sélectionner au moins une entreprise.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Sauvegarder les fichiers
        |--------------------------------------------------------------------------
        */

        $attachments = [];

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {

                $path = $file->store(
                    'company-emails',
                    'local'
                );

                $attachments[] = [
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getMimeType(),
                ];
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Envoyer à toutes les entreprises
        |--------------------------------------------------------------------------
        |
        | Le modèle Company n'a plus de colonne "email" : on se base
        | désormais sur "contact_email" pour savoir à qui envoyer.
        */

        if ($validated['send_to_all']) {

            Company::query()
                ->whereNotNull('contact_email')
                ->where('contact_email', '!=', '')
                ->select('id')
                ->chunkById(100, function ($companies) use ($validated, $attachments) {

                    foreach ($companies as $company) {

                        SendCompanyEmailJob::dispatch(
                            companyId: $company->id,
                            subject: $validated['subject'],
                            message: $validated['message'],
                            attachments: $attachments
                        );
                    }
                });

        } else {

            /*
            |--------------------------------------------------------------------------
            | Envoyer aux entreprises sélectionnées
            |--------------------------------------------------------------------------
            */

            Company::query()
                ->whereIn('id', $validated['company_ids'])
                ->whereNotNull('contact_email')
                ->where('contact_email', '!=', '')
                ->select('id')
                ->get()
                ->each(function ($company) use ($validated, $attachments) {

                    SendCompanyEmailJob::dispatch(
                        companyId: $company->id,
                        subject: $validated['subject'],
                        message: $validated['message'],
                        attachments: $attachments
                    );
                });
        }

        return back()->with(
            'success',
            'Les emails ont été ajoutés à la file d’attente.'
        );
    }

    private const COUNTRIES_API = 'https://countries.dev/countries';

    private const CITIES_API = 'https://countriesnow.space/api/v0.1/countries/cities';

    // Toute variante de nom ou de code désignant le Sahara occidental.
    private const EXCLUDED_NAMES = [
        'western sahara',
        'sahara occidental',
        'sahrawi arab democratic republic',
        'republique arabe sahraouie democratique',
        'république arabe sahraouie démocratique',
        'rasd',
    ];

    private const EXCLUDED_CODES = ['EH'];

    public function countries(): JsonResponse
    {
        $countries = Cache::remember('countries.external-list', now()->addDays(7), function () {
            return $this->fetchCountriesFromApi();
        });

        // Échec ET rien en cache : on sert quand même une liste fonctionnelle.
        if ($countries === null) {
            return response()->json([
                'countries' => $this->fallbackCountries(),
                'warning'   => 'Liste des pays chargée depuis la liste de secours.',
            ]);
        }

        return response()->json(['countries' => $countries]);
    }

    public function cities(string $country): JsonResponse
    {
        if ($this->isExcluded($country)) {
            return response()->json(['cities' => []]);
        }

        if (strtolower($country) === 'morocco') {
            return $this->moroccoCities();
        }

        $cacheKey = 'countries.cities.' . strtolower($country);

        $cities = Cache::remember($cacheKey, now()->addDays(30), function () use ($country) {
            return $this->fetchCitiesFromApi($country);
        });

        if ($cities === null) {
            Cache::forget($cacheKey); // on ne fige jamais un échec, on réessaiera plus tard

            return response()->json([
                'cities'  => [],
                'warning' => 'Liste des villes indisponible pour le moment.',
            ]);
        }

        return response()->json(['cities' => $cities]);
    }

    /** @return array<array{name:string,code:?string}>|null null = échec (rien à mettre en cache) */
    private function fetchCountriesFromApi(): ?array
    {
        try {
            $response = Http::timeout(6)
                ->retry(2, 300)
                ->get(self::COUNTRIES_API, [
                    'fields' => 'name,alpha2Code',
                    'sort'   => 'name',
                ]);

            if (! $response->successful()) {
                Log::warning("countries.dev: réponse {$response->status()}");

                return null;
            }

            return collect($response->json())
                ->map(fn ($country) => [
                    'name' => $country['name'] ?? null,
                    'code' => $country['alpha2Code'] ?? null,
                ])
                ->filter(fn ($country) => ! empty($country['name']))
                ->reject(fn ($country) => $this->isExcluded($country['name'], $country['code']))
                ->values()
                ->all();
        } catch (\Throwable $e) {
            Log::warning("countries.dev indisponible : {$e->getMessage()}");

            return null;
        }
    }

    /** @return array<string>|null null = échec (rien à mettre en cache) */
    private function fetchCitiesFromApi(string $country): ?array
    {
        try {
            $response = Http::timeout(6)
                ->retry(2, 300)
                ->post(self::CITIES_API, ['country' => $country]);

            if (! $response->successful()) {
                Log::warning("countriesnow: réponse {$response->status()} pour {$country}");

                return null;
            }

            return collect($response->json('data', []))
                ->filter()
                ->unique()
                ->sort()
                ->values()
                ->all();
        } catch (\Throwable $e) {
            Log::warning("countriesnow indisponible pour {$country} : {$e->getMessage()}");

            return null;
        }
    }

    /** Cas particulier du Maroc : liste externe + villes locales garanties, toujours fusionnées. */
    private function moroccoCities(): JsonResponse
    {
        $moroccoCities = [
            'Laâyoune', 'Dakhla', 'Boujdour', 'Es-Semara', 'Tarfaya',
            'Guelmim', 'Tan-Tan', 'Assa-Zag', 'Aousserd',
        ];

        $cached = Cache::remember('countries.cities.morocco.api', now()->addDays(30), function () {
            return $this->fetchCitiesFromApi('Morocco');
        });

        if ($cached === null) {
            Cache::forget('countries.cities.morocco.api');
        }

        $cities = collect($cached ?? [])
            ->merge($moroccoCities)
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json(['cities' => $cities->all()]);
    }

    private function isExcluded(?string $name, ?string $code = null): bool
    {
        if ($code && in_array(strtoupper($code), self::EXCLUDED_CODES, true)) {
            return true;
        }

        if (! $name) {
            return false;
        }

        $normalized = strtolower(trim($name));

        return in_array($normalized, self::EXCLUDED_NAMES, true);
    }

    /** Utilisée uniquement si countries.dev est injoignable ET qu'aucun cache n'existe encore. */
    private function fallbackCountries(): array
    {
        $names = [
            'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia',
            'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Belarus',
            'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
            'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
            'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile',
            'China', 'Colombia', 'Comoros', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba',
            'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark',
            'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
            'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
            'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
            'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
            'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
            'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos',
            'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
            'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
            'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
            'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands',
            'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
            'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
            'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of the Congo', 'Romania',
            'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
            'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa',
            'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
            'Switzerland', 'Syria', 'São Tomé and Príncipe', 'Taiwan', 'Tajikistan',
            'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
            'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
            'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen',
            'Zambia', 'Zimbabwe',
        ];

        sort($names);

        return array_map(
            fn (string $name) => ['name' => $name, 'code' => null],
            $names
        );
    }
}