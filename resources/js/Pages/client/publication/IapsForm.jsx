import React, { useState, useEffect, useMemo, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

/* -------------------------------------------------------------------------- */
/*  Constantes                                                                */
/* -------------------------------------------------------------------------- */

const DIASPORA_LABEL = "Diaspora / Résidence hors continent africain";
const INTERNATIONAL_LABEL = "Siège international / Hors continent africain";

const languages = ["Français", "Anglais", "Arabe", "Swahili", "Portugais"];

const individualProfiles = [
    "Chercheur·e / Enseignant·e-chercheur·e",
    "Praticien·ne de terrain & Travailleur·se social·e",
    "Acteur·rice de la société civile & Plaidoyer",
    "Entrepreneur·e social·e & Porteur·se d’impact",
    "Journaliste, Spécialiste médias & Relais d’opinion",
    "Innovateur·rice technologique & Solutions frugales",
    "Acteur·rice coutumier ou communautaire",
    "Consultant·e indépendant·e & Analyste sectoriel·le",
    "Citoyen·ne observateur·rice engagé·e",
    "Autre",
];

const disciplines = [
    "Sciences sociales fondamentales",
    "Philosophie & Pensée critique africaine",
    "Sciences politiques & Politiques publiques",
    "Sciences des données & Métrologie",
    "Économie Sociale et Solidaire (ESS) & Entrepreneuriat social",
    "Économie populaire & Dynamiques non recensées",
    "Philanthropie africaine & Financement souverain",
    "Action sociale, Travail social & Petite enfance",
    "Foncier, Droit coutumier & Communs",
    "Technologies frugales & Réseaux décentralisés",
];

const regions = [
    "Afrique du Nord",
    "Afrique de l'Ouest",
    "Afrique Centrale",
    "Afrique de l'Est",
    "Afrique Australe",
    "Échelle continentale (Panafricaine)",
    "Diaspora / Hors continent africain",
];

const contributionMethods = [
    "Données et observations de terrain",
    "Méthodologie & Définition conceptuelle",
    "Déploiement terrain & Expérimentation pilote",
    "Veille critique & Évaluation académique",
    "Ateliers de travail",
    "Plaidoyer & Relais d’opinion",
];

const entityTypes = [
    "Gouvernement & Haute Institution publique",
    "Ministère ou Direction publique sectorielle",
    "Organe statistique national",
    "Organisation régionale ou panafricaine",
    "Organisation de la Société Civile (OSC), ONG ou Collectif citoyen",
    "Université, Laboratoire de recherche académique ou Think Tank",
    "Organe de Presse, Médias & Agence d’information",
    "Entreprise privée, FinTech, Opérateur Télécom ou Énergie",
    "Bailleur de fonds, Fondation donatrice & Philanthropie africaine",
    "Structure de l'Économie Sociale et Solidaire (ESS), Coopérative ou Fédérateur professionnel",
    "Autre nature",
];

const interventionScales = [
    "Locale / Municipale",
    "Nationale",
    "Régionale / Sous-continentale",
    "Continentale (Panafricaine)",
    "Internationale (Siège hors Afrique)",
];

const motivations = [
    "Fonder les politiques et investissements sur les besoins réels",
    "Challenger et enrichir les grilles de lecture",
    "Mesurer l’impact authentique",
    "Bâtir une souveraineté de la donnée",
    "Nourrir le débat public et citoyen",
];

const partnerships = [
    "Territoire pilote & Déploiement opérationnel",
    "Partage éthique de données sectorielles",
    "Partenariat de recherche & Validation académique",
    "Portage institutionnel & Plaidoyer",
    "Pérennisation financière & Mécénat éthique",
];

const blindSpots = [
    "Économie populaire & Travail non recensé",
    "Solidarités endogènes",
    "Changement de paradigme (Mindset Shift)",
    "Biens communs, Droits coutumiers & Foncier",
    "Services essentiels décentralisés",
    "Saut technologique frugal",
    "Capabilités & Dignité",
];

const STEP1_FIELDS = [
    "full_name",
    "gender",
    "email",
    "phone",
    "languages",
    "other_language",
    "participant_type",
    "linkedin",
];
const STEP3_FIELDS = ["blind_spots", "other_blind_spot", "field_testimony"];
const STEP4_FIELDS = ["ethical_consent"];

/** Retourne l'étape qui contient un champ donné (pour afficher les erreurs serveur). */
const stepOfField = (field) => {
    if (STEP1_FIELDS.includes(field)) return 1;
    if (STEP3_FIELDS.includes(field)) return 3;
    if (STEP4_FIELDS.includes(field)) return 4;
    return 2;
};

const normalizeText = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

/* -------------------------------------------------------------------------- */
/*  Composants UI                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeader({ number, title, description }) {
    return (
        <div className="mb-8 border-b border-[#d9ddda] pb-6">
            <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2d2d] text-sm font-semibold text-white">
                    {number}
                </span>

                <h2 className="text-xl font-semibold text-[#1f2d2d] md:text-2xl">
                    {title}
                </h2>
            </div>

            {description && (
                <p className="max-w-3xl text-sm leading-7 text-[#68706e]">
                    {description}
                </p>
            )}
        </div>
    );
}

function FieldError({ error }) {
    if (!error) return null;

    return <p className="mt-2 text-sm text-red-600">{error}</p>;
}

function TextInput({
    label,
    value,
    onChange,
    error,
    required = false,
    placeholder = "",
    type = "text",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#263333]">
                {label}
                {required && <span className="ml-1 text-[#bf5429]">*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10 ${
                    error ? "border-red-400" : "border-[#d6d9d8]"
                }`}
            />

            <FieldError error={error} />
        </div>
    );
}

function TextArea({
    label,
    value,
    onChange,
    error,
    required = false,
    placeholder = "",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#263333]">
                {label}
                {required && <span className="ml-1 text-[#bf5429]">*</span>}
            </label>

            <textarea
                rows={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full resize-y rounded-xl border bg-white px-4 py-3.5 text-sm leading-7 text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10 ${
                    error ? "border-red-400" : "border-[#d6d9d8]"
                }`}
            />

            <FieldError error={error} />
        </div>
    );
}

/** Select natif (sans recherche) — pour les petites listes. */
function SelectInput({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
    placeholder = "Sélectionnez une option",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-[#263333]">
                {label}
                {required && <span className="ml-1 text-[#bf5429]">*</span>}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10 ${
                    error ? "border-red-400" : "border-[#d6d9d8]"
                }`}
            >
                <option value="">{placeholder}</option>

                {options.map((option, index) => {
                    const optionValue =
                        typeof option === "object" ? option.value : option;
                    const optionLabel =
                        typeof option === "object" ? option.label : option;

                    return (
                        <option
                            key={`${optionValue}-${index}`}
                            value={optionValue}
                        >
                            {optionLabel}
                        </option>
                    );
                })}
            </select>

            <FieldError error={error} />
        </div>
    );
}

/** Select avec champ « Rechercher » — pour les pays et les villes. */
function SearchableSelect({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
    placeholder = "Sélectionnez une option",
    searchPlaceholder = "Rechercher...",
    emptyText = "Aucun résultat",
    loading = false,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef(null);

    const normalizedOptions = useMemo(
        () =>
            options.map((option) =>
                typeof option === "object"
                    ? option
                    : { value: option, label: option }
            ),
        [options]
    );

    const filteredOptions = useMemo(() => {
        const q = normalizeText(query.trim());

        if (!q) return normalizedOptions;

        return normalizedOptions.filter((option) =>
            normalizeText(option.label).includes(q)
        );
    }, [normalizedOptions, query]);

    const selected = normalizedOptions.find((option) => option.value === value);

    // Fermer au clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const choose = (optionValue) => {
        onChange(optionValue);
        setOpen(false);
        setQuery("");
    };

    const closeMenu = () => {
        setOpen(false);
        setQuery("");
    };

    return (
        <div ref={containerRef} className="relative">
            <label className="mb-2 block text-sm font-medium text-[#263333]">
                {label}
                {required && <span className="ml-1 text-[#bf5429]">*</span>}
            </label>

            <button
                type="button"
                disabled={disabled || loading}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3.5 text-left text-sm outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 ${
                    error ? "border-red-400" : "border-[#d6d9d8]"
                }`}
            >
                <span
                    className={selected ? "text-[#263333]" : "text-[#9aa19f]"}
                >
                    {loading
                        ? "Chargement..."
                        : selected?.label || value || placeholder}
                </span>

                <span className="ml-2 text-xs text-[#78807e]">▾</span>
            </button>

            {open && !disabled && !loading && (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-lg">
                    <div className="border-b border-[#eceeed] p-2">
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") closeMenu();

                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    if (filteredOptions[0]) {
                                        choose(filteredOptions[0].value);
                                    }
                                }
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-lg border border-[#d6d9d8] px-3 py-2 text-sm outline-none focus:border-[#bf5429]"
                        />
                    </div>

                    <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-[#78807e]">
                                {emptyText}
                            </li>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <li key={`${option.value}-${index}`}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={option.value === value}
                                        onClick={() => choose(option.value)}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#bf5429]/5 ${
                                            option.value === value
                                                ? "bg-[#bf5429]/10 font-medium text-[#bf5429]"
                                                : "text-[#263333]"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            <FieldError error={error} />
        </div>
    );
}

/**
 * Champ ville :
 *  - pas de pays choisi        → select désactivé
 *  - villes disponibles (API)  → select avec recherche
 *  - aucune ville / diaspora   → saisie libre
 */
function CityField({
    label,
    required = false,
    value,
    onChange,
    error,
    cities,
    loading,
    country,
    placeholder = "",
}) {
    if (!country) {
        return (
            <SearchableSelect
                label={label}
                required={required}
                value=""
                onChange={() => {}}
                options={[]}
                disabled
                placeholder="Choisissez d'abord un pays"
                error={error}
            />
        );
    }

    if (!loading && cities.length === 0) {
        return (
            <TextInput
                label={label}
                required={required}
                value={value}
                onChange={onChange}
                error={error}
                placeholder={placeholder}
            />
        );
    }

    return (
        <SearchableSelect
            label={label}
            required={required}
            value={value}
            onChange={onChange}
            options={cities}
            loading={loading}
            error={error}
            placeholder="Sélectionnez une ville"
            searchPlaceholder="Rechercher une ville..."
        />
    );
}

function CheckboxGroup({ label, options, values, onChange, max, error }) {
    const toggle = (option) => {
        if (values.includes(option)) {
            onChange(values.filter((item) => item !== option));
            return;
        }

        if (max && values.length >= max) {
            return;
        }

        onChange([...values, option]);
    };

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium text-[#263333]">
                    {label}
                </label>

                {max && (
                    <span className="text-xs text-[#78807e]">
                        {values.length}/{max} sélection{max > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {options.map((option) => {
                    const checked = values.includes(option);
                    const disabled =
                        Boolean(max) && !checked && values.length >= max;

                    return (
                        <label
                            key={option}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                                checked
                                    ? "border-[#bf5429] bg-[#bf5429]/5"
                                    : "border-[#d6d9d8] bg-white hover:border-[#aeb5b2]"
                            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                onChange={() => toggle(option)}
                                className="mt-0.5 h-4 w-4 accent-[#bf5429]"
                            />

                            <span className="text-sm leading-6 text-[#394342]">
                                {option}
                            </span>
                        </label>
                    );
                })}
            </div>

            <FieldError error={error} />
        </div>
    );
}

/**
 * Barre de progression des étapes (numérotée : le contenu est bien une
 * séquence, du contact vers l'engagement final).
 */
function StepProgress({ currentStep, totalSteps, labels }) {
    return (
        <div className="mb-8 flex items-center justify-between">
            {labels.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isDone = stepNumber < currentStep;

                return (
                    <div
                        key={label}
                        className="flex flex-1 items-center last:flex-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                                    isActive || isDone
                                        ? "bg-[#bf5429] text-white"
                                        : "bg-[#e4e7e5] text-[#78807e]"
                                }`}
                            >
                                {stepNumber}
                            </span>

                            <span
                                className={`hidden text-center text-xs font-medium sm:block ${
                                    isActive
                                        ? "text-[#1f2d2d]"
                                        : "text-[#9aa19f]"
                                }`}
                            >
                                {label}
                            </span>
                        </div>

                        {stepNumber !== totalSteps && (
                            <div
                                className={`mx-2 h-[2px] flex-1 rounded transition ${
                                    isDone ? "bg-[#bf5429]" : "bg-[#e4e7e5]"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function IapsForm({ publication }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm({
        // SECTION 1
        full_name: "",
        gender: "",
        email: "",
        phone: "",
        languages: [],
        other_language: "",
        participant_type: "",
        linkedin: "",

        // SECTION 2 (individuel)
        individual_profile: "",
        organization_affiliation: "",
        disciplines: [],
        other_discipline: "",
        observation_regions: [],
        observation_country: "",
        diaspora_country: "",
        observation_location: "",
        contribution_methods: [],
        other_contribution_method: "",

        // SECTION 2 (organisation)
        entity_name: "",
        representative_role: "",
        entity_type: "",
        intervention_scale: "",
        headquarters_country: "",
        international_country: "",
        headquarters_city: "",
        motivations: [],
        other_motivation: "",
        partnership_opportunities: [],
        other_partnership: "",

        // SECTION 3
        blind_spots: [],
        other_blind_spot: "",
        field_testimony: "",

        // SECTION 4
        ethical_consent: false,
    });

    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [citiesFor, setCitiesFor] = useState(null); // pays pour lequel `cities` est chargé
    const [step, setStep] = useState(1);

    const totalSteps = 4;
    const isIndividual = data.participant_type === "individual";
    const isOrganization = data.participant_type === "organization";

    const stepLabels = [
        "Coordonnées",
        isOrganization ? "Organisation" : "Contributeur",
        "Cœur thématique",
        "Engagement",
    ];

    // Pays actif selon le type de participant
    const activeCountry = isIndividual
        ? data.observation_country
        : isOrganization
        ? data.headquarters_country
        : "";

    const hasRealCountry =
        Boolean(activeCountry) &&
        activeCountry !== DIASPORA_LABEL &&
        activeCountry !== INTERNATIONAL_LABEL;

    /* ---------- Charger les pays ---------- */
    useEffect(() => {
        const controller = new AbortController();

        const loadCountries = async () => {
            setLoadingCountries(true);

            try {
                const response = await fetch(route("api.countries"), {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des pays.");
                }

                const result = await response.json();

                setCountries(result.countries || []);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setCountries([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingCountries(false);
                }
            }
        };

        loadCountries();

        return () => controller.abort();
    }, []);

    /* ---------- Charger les villes du pays choisi ---------- */
    useEffect(() => {
        if (!hasRealCountry) {
            setCities([]);
            setCitiesFor(null);
            setLoadingCities(false);
            return;
        }

        const controller = new AbortController();

        const loadCities = async () => {
            setLoadingCities(true);
            setCities([]);

            try {
                const response = await fetch(
                    route("api.countries.cities", { country: activeCountry }),
                    {
                        signal: controller.signal,
                        headers: { Accept: "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des villes.");
                }

                const result = await response.json();

                // Accepte ["Casablanca"] ou [{ name: "Casablanca" }]
                const list = (result.cities || [])
                    .map((city) =>
                        typeof city === "string" ? city : city?.name
                    )
                    .filter(Boolean);

                setCities(
                    [...new Set(list)].sort((a, b) => a.localeCompare(b))
                );
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setCities([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingCities(false);
                    setCitiesFor(activeCountry);
                }
            }
        };

        loadCities();

        return () => controller.abort();
    }, [activeCountry, hasRealCountry]);

    const countryOptions = useMemo(
        () =>
            countries.map((country) => ({
                value: country.name,
                label: country.name,
            })),
        [countries]
    );

    // Évite un flash de saisie libre avant le début du chargement des villes
    const citiesPending =
        loadingCities || (hasRealCountry && citiesFor !== activeCountry);

    /* ---------- Navigation & validation ---------- */
    const requiredFieldsForStep = () => {
        if (step === 1) {
            return [
                "full_name",
                "gender",
                "email",
                "phone",
                "participant_type",
            ];
        }

        if (step === 2) {
            return isIndividual
                ? ["observation_location"]
                : [
                      "entity_name",
                      "representative_role",
                      "entity_type",
                      "headquarters_city",
                  ];
        }

        return [];
    };

    const goNext = () => {
        clearErrors();

        const newErrors = {};

        requiredFieldsForStep().forEach((field) => {
            if (!String(data[field] ?? "").trim()) {
                newErrors[field] = "Ce champ est obligatoire.";
            }
        });

        if (
            step === 1 &&
            data.email &&
            !/^\S+@\S+\.\S+$/.test(data.email.trim())
        ) {
            newErrors.email = "Adresse e-mail invalide.";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        setStep((current) => Math.min(current + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goBack = () => {
        setStep((current) => Math.max(current - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const setArray = (field, values) => {
        setData(field, values);
    };

    /* ---------- Soumission ---------- */
    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/publications/${publication.id}/iaps-form`, {
            preserveScroll: true,

            onSuccess: () => {
                reset();
                clearErrors();
                setStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });

                Swal.fire({
                    icon: "success",
                    title: "Contribution enregistrée !",
                    text: "Votre contribution a été enregistrée avec succès. Un e-mail de confirmation vous a été envoyé.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#bf5429",
                });
            },

            onError: (serverErrors) => {
                // Revenir à l'étape qui contient la première erreur
                const firstField = Object.keys(serverErrors)[0];

                if (firstField) {
                    setStep(stepOfField(firstField));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Une erreur est survenue lors de l'enregistrement de votre contribution. Veuillez vérifier les informations saisies.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#bf5429",
                });
            },
        });
    };

    return (
        <>
            <Head title="Co-construisons l'IAPS" />

            <div className="min-h-screen bg-[#f6f7f5]">
                {/* HERO */}
                <header className="border-b border-[#dfe3e0] bg-[#1f2d2d] text-white">
                    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                                Formulaire de co-construction IAPS
                            </div>

                            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                                Nos réalités, nos mesures —
                                <span className="mt-2 block text-[#d9a07f]">
                                    Co-construisons l’Indice Africain du
                                    Progrès Social (IAPS)
                                </span>
                            </h1>

                            <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
                                Mesurer le progrès social est un acte de
                                souveraineté et de dignité collective.
                                Bâtissons ensemble nos propres repères.
                            </p>
                        </div>
                    </div>
                </header>

                {/* FORM */}
                <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
                    <StepProgress
                        currentStep={step}
                        totalSteps={totalSteps}
                        labels={stepLabels}
                    />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* ÉTAPE 1 */}
                        {step === 1 && (
                            <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                                <SectionHeader
                                    number="1"
                                    title="Accueil, Coordonnées & Aiguillage Initial"
                                    description="Coordonnées directes et orientation initiale du participant."
                                />

                                <div className="space-y-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <TextInput
                                            label="Nom & Prénom"
                                            required
                                            value={data.full_name}
                                            onChange={(value) =>
                                                setData("full_name", value)
                                            }
                                            error={errors.full_name}
                                        />

                                        <SelectInput
                                            label="Genre"
                                            required
                                            options={[
                                                { value: "H", label: "Homme" },
                                                { value: "F", label: "Femme" },
                                            ]}
                                            value={data.gender}
                                            onChange={(value) =>
                                                setData("gender", value)
                                            }
                                            error={errors.gender}
                                        />

                                        <TextInput
                                            label="E-mail de contact"
                                            required
                                            type="email"
                                            value={data.email}
                                            onChange={(value) =>
                                                setData("email", value)
                                            }
                                            error={errors.email}
                                        />

                                        <TextInput
                                            label="Numéro Téléphone & WhatsApp"
                                            required
                                            placeholder="+212..."
                                            value={data.phone}
                                            onChange={(value) =>
                                                setData("phone", value)
                                            }
                                            error={errors.phone}
                                        />
                                    </div>

                                    <CheckboxGroup
                                        label="Langue(s) principale(s) d'échange et de contribution"
                                        options={languages}
                                        values={data.languages}
                                        onChange={(values) =>
                                            setArray("languages", values)
                                        }
                                        error={errors.languages}
                                    />

                                    <TextInput
                                        label="Autre langue africaine ou internationale"
                                        value={data.other_language}
                                        onChange={(value) =>
                                            setData("other_language", value)
                                        }
                                        error={errors.other_language}
                                    />

                                    <div>

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <TextInput
                                                label="LinkedIn"
                                                type="url"
                                                placeholder="https://www.linkedin.com/in/..."
                                                value={data.linkedin}
                                                onChange={(value) =>
                                                    setData("linkedin", value)
                                                }
                                                error={errors.linkedin}
                                            />
                                            <br/>
                                        <label className="mb-3 block text-sm font-medium text-[#263333]">
                                            Vous participez à ce chantier
                                            continental au titre de :
                                            <span className="ml-1 text-[#bf5429]">
                                                *
                                            </span>
                                        </label>
                                        <br/>
                                            <label
                                                className={`cursor-pointer rounded-2xl border p-5 transition ${
                                                    isIndividual
                                                        ? "border-[#bf5429] bg-[#bf5429]/5"
                                                        : "border-[#d6d9d8] hover:border-[#aeb5b2]"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="participant_type"
                                                    value="individual"
                                                    checked={isIndividual}
                                                    onChange={(e) =>
                                                        setData(
                                                            "participant_type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mr-3 accent-[#bf5429]"
                                                />

                                                <span className="font-medium text-[#263333]">
                                                    Personne physique
                                                </span>

                                                <p className="mt-2 pl-6 text-sm leading-6 text-[#6b7471]">
                                                    À titre individuel /
                                                    Expert indépendant
                                                </p>
                                            </label>

                                            <label
                                                className={`cursor-pointer rounded-2xl border p-5 transition ${
                                                    isOrganization
                                                        ? "border-[#bf5429] bg-[#bf5429]/5"
                                                        : "border-[#d6d9d8] hover:border-[#aeb5b2]"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="participant_type"
                                                    value="organization"
                                                    checked={isOrganization}
                                                    onChange={(e) =>
                                                        setData(
                                                            "participant_type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mr-3 accent-[#bf5429]"
                                                />

                                                <span className="font-medium text-[#263333]">
                                                    Personne morale
                                                </span>

                                                <p className="mt-2 pl-6 text-sm leading-6 text-[#6b7471]">
                                                    Au nom d'une entité ou
                                                    institution
                                                </p>
                                            </label>
                                        </div>

                                        <FieldError
                                            error={errors.participant_type}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ÉTAPE 2 — INDIVIDU */}
                        {step === 2 && isIndividual && (
                            <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                                <SectionHeader
                                    number="2"
                                    title="Parcours Contributeurs Individuels"
                                    description="Profil, expertise, territoire d'observation et modalités de contribution."
                                />

                                <div className="space-y-8">
                                    <SelectInput
                                        label="Profil principal"
                                        value={data.individual_profile}
                                        onChange={(value) =>
                                            setData("individual_profile", value)
                                        }
                                        options={individualProfiles}
                                        error={errors.individual_profile}
                                    />

                                    <TextInput
                                        label="Organisation de rattachement & Rôle"
                                        value={data.organization_affiliation}
                                        onChange={(value) =>
                                            setData(
                                                "organization_affiliation",
                                                value
                                            )
                                        }
                                        error={errors.organization_affiliation}
                                        placeholder="Ex. : Maître de conférences à l'Université X..."
                                    />

                                    <CheckboxGroup
                                        label="Disciplines d’ancrage & Champs d'expertise"
                                        options={disciplines}
                                        values={data.disciplines}
                                        onChange={(values) =>
                                            setArray("disciplines", values)
                                        }
                                        max={3}
                                        error={errors.disciplines}
                                    />

                                    <TextInput
                                        label="Autre discipline"
                                        value={data.other_discipline}
                                        onChange={(value) =>
                                            setData("other_discipline", value)
                                        }
                                        error={errors.other_discipline}
                                    />

                                    <CheckboxGroup
                                        label="Ancrage territorial d'observation"
                                        options={regions}
                                        values={data.observation_regions}
                                        onChange={(values) =>
                                            setArray(
                                                "observation_regions",
                                                values
                                            )
                                        }
                                        error={errors.observation_regions}
                                    />

                                    <SearchableSelect
                                        label="Pays d'observation principale"
                                        value={data.observation_country}
                                        onChange={(value) =>
                                            // Forme fonctionnelle : conserve les autres champs
                                            setData((previous) => ({
                                                ...previous,
                                                observation_country: value,
                                                observation_location: "",
                                                diaspora_country: "",
                                            }))
                                        }
                                        options={[
                                            ...countryOptions,
                                            DIASPORA_LABEL,
                                        ]}
                                        loading={loadingCountries}
                                        searchPlaceholder="Rechercher un pays..."
                                        error={errors.observation_country}
                                    />

                                    {data.observation_country ===
                                        DIASPORA_LABEL && (
                                        <TextInput
                                            label="Si Diaspora / Hors Afrique, précisez le pays de résidence"
                                            value={data.diaspora_country}
                                            onChange={(value) =>
                                                setData(
                                                    "diaspora_country",
                                                    value
                                                )
                                            }
                                            error={errors.diaspora_country}
                                        />
                                    )}

                                    <CityField
                                        label="Ville, quartier ou localité spécifique d'observation"
                                        required
                                        country={data.observation_country}
                                        cities={cities}
                                        loading={citiesPending}
                                        value={data.observation_location}
                                        onChange={(value) =>
                                            setData(
                                                "observation_location",
                                                value
                                            )
                                        }
                                        error={errors.observation_location}
                                        placeholder="Ex. : Casablanca, Dakar, Goma, Nairobi..."
                                    />

                                    <CheckboxGroup
                                        label="Modalités souhaitées de contribution"
                                        options={contributionMethods}
                                        values={data.contribution_methods}
                                        onChange={(values) =>
                                            setArray(
                                                "contribution_methods",
                                                values
                                            )
                                        }
                                        error={errors.contribution_methods}
                                    />

                                    <TextArea
                                        label="Proposez une autre modalité"
                                        value={data.other_contribution_method}
                                        onChange={(value) =>
                                            setData(
                                                "other_contribution_method",
                                                value
                                            )
                                        }
                                        error={errors.other_contribution_method}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ÉTAPE 2 — ORGANISATION */}
                        {step === 2 && isOrganization && (
                            <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                                <SectionHeader
                                    number="2"
                                    title="Parcours Organisations & Institutions"
                                    description="Identification de la structure, échelle d'intervention, motivations et synergies envisagées."
                                />

                                <div className="space-y-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <TextInput
                                            label="Nom officiel de l'entité"
                                            required
                                            value={data.entity_name}
                                            onChange={(value) =>
                                                setData("entity_name", value)
                                            }
                                            error={errors.entity_name}
                                        />

                                        <TextInput
                                            label="Rôle / Titre du représentant légal ou répondant"
                                            required
                                            value={data.representative_role}
                                            onChange={(value) =>
                                                setData(
                                                    "representative_role",
                                                    value
                                                )
                                            }
                                            error={errors.representative_role}
                                        />
                                    </div>

                                    <SelectInput
                                        label="Typologie de la personne morale"
                                        required
                                        value={data.entity_type}
                                        onChange={(value) =>
                                            setData("entity_type", value)
                                        }
                                        options={entityTypes}
                                        error={errors.entity_type}
                                    />

                                    <SelectInput
                                        label="Échelle d'intervention"
                                        value={data.intervention_scale}
                                        onChange={(value) =>
                                            setData("intervention_scale", value)
                                        }
                                        options={interventionScales}
                                        error={errors.intervention_scale}
                                    />

                                    <SearchableSelect
                                        label="Pays du siège / d'implantation principale"
                                        value={data.headquarters_country}
                                        onChange={(value) =>
                                            setData((previous) => ({
                                                ...previous,
                                                headquarters_country: value,
                                                headquarters_city: "",
                                                international_country: "",
                                            }))
                                        }
                                        options={[
                                            ...countryOptions,
                                            INTERNATIONAL_LABEL,
                                        ]}
                                        loading={loadingCountries}
                                        searchPlaceholder="Rechercher un pays..."
                                        error={errors.headquarters_country}
                                    />

                                    {data.headquarters_country ===
                                        INTERNATIONAL_LABEL && (
                                        <TextInput
                                            label="Si siège hors continent africain, précisez le pays"
                                            value={data.international_country}
                                            onChange={(value) =>
                                                setData(
                                                    "international_country",
                                                    value
                                                )
                                            }
                                            error={errors.international_country}
                                        />
                                    )}

                                    <CityField
                                        label="Ville du siège"
                                        required
                                        country={data.headquarters_country}
                                        cities={cities}
                                        loading={citiesPending}
                                        value={data.headquarters_city}
                                        onChange={(value) =>
                                            setData("headquarters_city", value)
                                        }
                                        error={errors.headquarters_city}
                                        placeholder="Ex. : Rabat, Abidjan, Kigali..."
                                    />

                                    <CheckboxGroup
                                        label="Finalités motivant votre rapprochement avec l'IAPS"
                                        options={motivations}
                                        values={data.motivations}
                                        onChange={(values) =>
                                            setArray("motivations", values)
                                        }
                                        max={2}
                                        error={errors.motivations}
                                    />

                                    <TextArea
                                        label="Partagez une autre motivation"
                                        value={data.other_motivation}
                                        onChange={(value) =>
                                            setData("other_motivation", value)
                                        }
                                        error={errors.other_motivation}
                                    />

                                    <CheckboxGroup
                                        label="Pistes de synergies concrètes envisagées avec l'Observatoire Social"
                                        options={partnerships}
                                        values={data.partnership_opportunities}
                                        onChange={(values) =>
                                            setArray(
                                                "partnership_opportunities",
                                                values
                                            )
                                        }
                                        error={errors.partnership_opportunities}
                                    />

                                    <TextArea
                                        label="Autre forme de partenariat"
                                        value={data.other_partnership}
                                        onChange={(value) =>
                                            setData("other_partnership", value)
                                        }
                                        error={errors.other_partnership}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ÉTAPE 3 */}
                        {step === 3 && (
                            <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                                <SectionHeader
                                    number="3"
                                    title="Cœur Thématique, Souveraineté & Mindset"
                                    description="Cette section est commune à l'ensemble des répondants."
                                />

                                <div className="space-y-8">
                                    <CheckboxGroup
                                        label="Quels angles morts statistiques et conceptuels est-il le plus urgent d'intégrer dans l'IAPS ?"
                                        options={blindSpots}
                                        values={data.blind_spots}
                                        onChange={(values) =>
                                            setArray("blind_spots", values)
                                        }
                                        max={3}
                                        error={errors.blind_spots}
                                    />

                                    <TextArea
                                        label="Autre angle mort"
                                        value={data.other_blind_spot}
                                        onChange={(value) =>
                                            setData("other_blind_spot", value)
                                        }
                                        error={errors.other_blind_spot}
                                    />

                                    <TextArea
                                        label="Expression libre / Témoignage de terrain"
                                        value={data.field_testimony}
                                        onChange={(value) =>
                                            setData("field_testimony", value)
                                        }
                                        error={errors.field_testimony}
                                        placeholder="Développez librement votre pensée."
                                    />
                                </div>
                            </section>
                        )}

                        {/* ÉTAPE 4 */}
                        {step === 4 && (
                            <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                                <SectionHeader
                                    number="4"
                                    title="Engagement Éthique & Souveraineté des Données"
                                    description="Votre accord est nécessaire pour finaliser la contribution."
                                />

                                <label
                                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                                        data.ethical_consent
                                            ? "border-[#bf5429] bg-[#bf5429]/5"
                                            : "border-[#d6d9d8]"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.ethical_consent}
                                        onChange={(e) =>
                                            setData(
                                                "ethical_consent",
                                                e.target.checked
                                            )
                                        }
                                        className="mt-1 h-5 w-5 accent-[#bf5429]"
                                    />

                                    <div>
                                        <p className="text-sm font-medium leading-6 text-[#263333]">
                                            J'accepte que mes contributions
                                            soient traitées exclusivement dans
                                            le cadre de la co-construction de
                                            l’Indice Africain du Progrès Social
                                            (IAPS) par l’Observatoire Social.
                                        </p>

                                        <p className="mt-3 text-sm leading-7 text-[#68706e]">
                                            Garantie de souveraineté : Vos
                                            données demeurent strictement
                                            confidentielles, protégées contre
                                            toute cession ou exploitation
                                            commerciale, et sont sanctuarisées
                                            au profit de ce bien commun
                                            panafricain.
                                        </p>
                                    </div>
                                </label>

                                <FieldError error={errors.ethical_consent} />
                            </section>
                        )}

                        {/* NAVIGATION / ENVOI */}
                        {step < totalSteps ? (
                            <div className="flex items-center justify-between gap-4">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="rounded-xl border border-[#d6d9d8] bg-white px-6 py-3.5 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                                    >
                                        Précédent
                                    </button>
                                ) : (
                                    <span />
                                )}

                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="rounded-xl bg-[#bf5429] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                                >
                                    Suivant
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[#1f2d2d] p-6 md:p-8">
                                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Votre contribution
                                        </h3>

                                        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                                            Merci de prendre le temps de
                                            partager vos réalités et vos
                                            perspectives.
                                        </p>
                                    </div>

                                    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row md:w-auto">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            className="rounded-xl border border-white/20 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40"
                                        >
                                            Précédent
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !data.ethical_consent
                                            }
                                            className="w-full rounded-xl bg-[#bf5429] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                                        >
                                            {processing
                                                ? "Enregistrement..."
                                                : "Envoyer ma contribution"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </main>
            </div>
        </>
    );
}