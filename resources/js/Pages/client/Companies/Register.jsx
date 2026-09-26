import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { ChevronDown, Loader2, Search, Send } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Jetons de design
|--------------------------------------------------------------------------
| Couleurs   : reprend la charte déjà en place dans l'admin (#bf5429,
|              #1f2d2d, #68706e, #f6f7f5) pour rester cohérent avec le
|              reste du produit, sans introduire une palette parasite.
| Typo       : "Source Serif 4" pour le panneau institutionnel (ton
|              éditorial, sérieux), "Inter" pour le formulaire (lisible,
|              neutre). Deux familles nettement différenciées.
| Disposition: deux colonnes — panneau fixe à gauche qui porte l'identité
|              et le contexte, formulaire à droite qui reste 100%
|              fonctionnel. Empilé sur mobile.
|--------------------------------------------------------------------------
*/

/* ---------- Données de référence ---------- */

// À adapter selon votre liste réelle de secteurs (ou à charger depuis l'API)
const SECTORS = [
    "Agriculture & Agroalimentaire",
    "Industrie & Manufacturing",
    "BTP & Construction",
    "Commerce & Distribution",
    "Transport & Logistique",
    "Tourisme & Hôtellerie",
    "Technologies de l'information",
    "Finance & Assurance",
    "Éducation & Formation",
    "Santé",
    "Autre",
];

const GENDERS = [
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
];

const STEPS = [
    {
        title: "Vous soumettez vos informations",
        text: "Ce formulaire prend environ trois minutes à compléter.",
    },
    {
        title: "Notre équipe les vérifie",
        text: "Un membre de l'Observatoire valide les données transmises.",
    },
    {
        title: "Votre organisation rejoint le réseau",
        text: "Vous recevez une confirmation par email une fois validée.",
    },
];

/* ---------- Helpers de formatage ---------- */

// Nom de l'entreprise / nom de famille : tout en majuscules
const toUpperCase = (value) => value.toUpperCase();

// Prénom : première lettre en majuscule, le reste en minuscules
const capitalizeFirstLetter = (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const inputClass = (error) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-[#1f2d2d] outline-none transition placeholder:text-[#9aa19f] disabled:cursor-not-allowed disabled:bg-[#f6f7f5] disabled:text-[#9aa19f] ${
        error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-[#d9dcda] focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
    }`;

const BRAND_COLOR = "#bf5429";

/* ---------- SweetAlert2 ---------- */

const alertSuccess = () =>
    Swal.fire({
        icon: "success",
        title: "Inscription envoyée",
        text: "Merci. Votre organisation a bien été enregistrée, notre équipe va l'examiner.",
        confirmButtonText: "Parfait",
        confirmButtonColor: BRAND_COLOR,
    });

const alertError = (text) =>
    Swal.fire({
        icon: "error",
        title: "L'envoi a échoué",
        text,
        confirmButtonText: "Fermer",
        confirmButtonColor: BRAND_COLOR,
    });

/* ---------- Composants réutilisables ---------- */

function FieldError({ error }) {
    if (!error) return null;

    return <p className="mt-1.5 text-sm text-red-600">{error}</p>;
}

function FieldLabel({ children, required }) {
    return (
        <label className="mb-2 block text-sm font-medium text-[#1f2d2d]">
            {children}
            {required && <span className="ml-0.5 text-[#bf5429]">*</span>}
        </label>
    );
}

/**
 * Liste déroulante avec recherche au clavier (utilisée pour le pays et la ville).
 */
function SearchableSelect({
    placeholder = "Sélectionner...",
    loadingLabel = "Chargement...",
    loading = false,
    disabled = false,
    error = false,
    options = [],
    value,
    onChange,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    const selectedLabel =
        options.find((option) => option.value === value)?.label ?? "";

    const filtered = useMemo(() => {
        if (!query) return options;

        const q = query.toLowerCase();

        return options.filter((option) =>
            option.label.toLowerCase().includes(q)
        );
    }, [options, query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
        setQuery("");
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => {
                    if (!disabled && !loading) setOpen((prev) => !prev);
                }}
                disabled={disabled || loading}
                className={`${inputClass(
                    error
                )} flex items-center justify-between text-left ${
                    disabled ? "opacity-60" : ""
                }`}
            >
                <span className={selectedLabel ? "text-[#1f2d2d]" : "text-[#9aa19f]"}>
                    {loading ? loadingLabel : selectedLabel || placeholder}
                </span>

                <ChevronDown className="h-4 w-4 shrink-0 text-[#9aa19f]" />
            </button>

            {open && !loading && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#d9dcda] bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-[#e4e7e5] px-3 py-2.5">
                        <Search className="h-4 w-4 text-[#9aa19f]" />

                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-full text-sm outline-none placeholder:text-[#9aa19f]"
                        />
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                        {filtered.length === 0 && (
                            <p className="px-3 py-2.5 text-sm text-[#9aa19f]">
                                Aucun résultat.
                            </p>
                        )}

                        {filtered.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`block w-full px-3 py-2.5 text-left text-sm hover:bg-[#f6f7f5] ${
                                    option.value === value
                                        ? "bg-[#bf5429]/10 text-[#bf5429]"
                                        : "text-[#1f2d2d]"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/** Bloc de section du formulaire : titre + grille de champs. */
function FormSection({ title, description, children }) {
    return (
        <section className="border-b border-[#eef0ee] px-6 py-8 last:border-b-0 md:px-10">
            <h2 className="text-[17px] font-semibold text-[#1f2d2d]">
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-sm text-[#78807e]">{description}</p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {children}
            </div>
        </section>
    );
}

/** Petite marque en l'absence de logo réel — à remplacer par <img src="/logo.svg" /> si disponible. */
function BrandMark() {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="20" cy="20" r="19" stroke="#e8ceb9" strokeWidth="1" />
            <circle cx="20" cy="20" r="12.5" stroke="#e8ceb9" strokeWidth="1" />
            <circle cx="20" cy="20" r="4" fill="#bf5429" />
        </svg>
    );
}

/** Motif discret de points, en clin d'œil au thème "observation" des données. */
function ConstellationPattern() {
    const dots = [
        [24, 40], [96, 24], [180, 64], [252, 20], [64, 108],
        [150, 132], [220, 100], [40, 180], [120, 208], [200, 176],
        [270, 150], [90, 260], [180, 250], [30, 300], [240, 230],
    ];

    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
            viewBox="0 0 300 340"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            {dots.map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.2} fill="#fff" />
            ))}
        </svg>
    );
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        sector: "",
        country: "Morocco",

        contact_gender: "",
        contact_last_name: "",
        contact_first_name: "",
        contact_position: "",
        contact_email: "",
        contact_phone: "",

        address: "",
        city: "",

        linkedin: "",
        website: "",
    });

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    /* ---------- Charger les pays ---------- */

    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true);

            try {
                const response = await fetch(route("api.countries"));

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des pays.");
                }

                const result = await response.json();

                setCountries(result.countries || []);
            } catch (error) {
                console.error(error);
                setCountries([]);
            } finally {
                setLoadingCountries(false);
            }
        };

        loadCountries();
    }, []);

    /* ---------- Charger les villes ---------- */

    useEffect(() => {
        if (!data.country) {
            setCities([]);
            return;
        }

        const loadCities = async () => {
            setLoadingCities(true);
            setCities([]);

            try {
                const response = await fetch(
                    route("api.countries.cities", { country: data.country })
                );

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des villes.");
                }

                const result = await response.json();

                setCities(result.cities || []);
            } catch (error) {
                console.error(error);
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        loadCities();
    }, [data.country]);

    const countryOptions = countries.map((country) => ({
        value: country.name,
        label: country.name,
    }));

    // Aucune ville disponible pour ce pays : on laisse saisir la ville à la main
    const noCityList = data.country && !loadingCities && cities.length === 0;

const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
        title: "Enregistrement en cours...",
        text: "Veuillez patienter.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    post(route("company.register.store"), {
        preserveScroll: true,

        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Inscription réussie",
                text: "Votre organisation a été enregistrée avec succès.",
                confirmButtonText: "OK",
                confirmButtonColor: "#bf5429",
            });

            reset();
        },

        onError: (formErrors) => {
            const firstError = Object.values(formErrors || {})[0];

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    firstError ||
                    "Merci de vérifier les champs indiqués ci-dessous et de réessayer.",
                confirmButtonText: "OK",
                confirmButtonColor: "#bf5429",
            });
        },
    });
};

    return (
        <>
            <Head title="Inscription — The Social Observatory">
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600&display=swap"
                />
            </Head>

            <div className="min-h-screen bg-[#f6f7f5] lg:grid lg:grid-cols-[380px_1fr]">
                {/* PANNEAU INSTITUTIONNEL */}
                <aside className="relative overflow-hidden bg-[#152622] px-6 py-10 text-white md:px-10 lg:sticky lg:top-0 lg:h-screen lg:px-10 lg:py-14">
                    <ConstellationPattern />

                    <div className="relative flex h-full flex-col">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo" className="h-12 w-12" />

                            <div
                                className="text-lg leading-tight"
                                style={{ fontFamily: "'Source Serif 4', serif" }}
                            >
                                The Social
                                <br />
                                Observatory
                            </div>
                        </div>

                        <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
                            L'Observatoire recense les organisations engagées
                            dans le progrès social en Afrique et les met en
                            réseau avec des chercheurs, institutions et
                            décideurs.
                        </p>

                        <div className="mt-10 space-y-6 border-t border-white/10 pt-8 lg:mt-auto">
                            {STEPS.map((step, index) => (
                                <div key={step.title} className="flex gap-4">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 text-xs font-medium text-white/80">
                                        {index + 1}
                                    </span>

                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {step.title}
                                        </p>
                                        <p className="mt-0.5 text-sm text-white/60">
                                            {step.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* FORMULAIRE */}
                <main className="px-4 py-10 md:px-10 lg:py-14">
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-8">
                            <h1
                                className="text-[28px] leading-tight text-[#1f2d2d] md:text-[32px]"
                                style={{ fontFamily: "'Source Serif 4', serif" }}
                            >
                                Inscrivez votre organisation
                            </h1>

                            <p className="mt-2 text-[15px] text-[#68706e]">
                                Les champs marqués d'une{" "}
                                <span className="font-semibold text-[#bf5429]">
                                    *
                                </span>{" "}
                                sont obligatoires.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm"
                        >
                            {/* Informations générales */}
                            <FormSection
                                title="Informations générales"
                                description="L'identité de votre organisation."
                            >
                                <div className="md:col-span-2">
                                    <FieldLabel required>
                                        Nom de l'organisation
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", toUpperCase(e.target.value))
                                        }
                                        className={inputClass(errors.name)}
                                        placeholder="NOM DE L'ORGANISATION"
                                    />

                                    <FieldError error={errors.name} />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Secteur d'activité
                                    </FieldLabel>

                                    <select
                                        value={data.sector}
                                        onChange={(e) => setData("sector", e.target.value)}
                                        className={inputClass(errors.sector)}
                                    >
                                        <option value="">
                                            Sélectionner un secteur
                                        </option>

                                        {SECTORS.map((sector) => (
                                            <option key={sector} value={sector}>
                                                {sector}
                                            </option>
                                        ))}
                                    </select>

                                    <FieldError error={errors.sector} />
                                </div>

                                <div>
                                    <FieldLabel required>Pays</FieldLabel>

                                    <SearchableSelect
                                        placeholder="Sélectionner un pays"
                                        loadingLabel="Chargement des pays..."
                                        loading={loadingCountries}
                                        error={errors.country}
                                        options={countryOptions}
                                        value={data.country}
                                        onChange={(value) =>
                                            setData({
                                                ...data,
                                                country: value,
                                                city: "",
                                            })
                                        }
                                    />

                                    <FieldError error={errors.country} />
                                </div>
                            </FormSection>

                            {/* Adresse */}
                            <FormSection
                                title="Adresse"
                                description="Où se trouve votre organisation."
                            >
                                <div className="md:col-span-2">
                                    <FieldLabel required>
                                        Adresse postale
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className={inputClass(errors.address)}
                                        placeholder="Adresse"
                                    />

                                    <FieldError error={errors.address} />
                                </div>

                                <div>
                                    <FieldLabel required>Ville</FieldLabel>

                                    {noCityList ? (
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            placeholder="Saisir la ville"
                                            className={inputClass(errors.city)}
                                        />
                                    ) : (
                                        <SearchableSelect
                                            placeholder={
                                                !data.country
                                                    ? "Sélectionner d'abord un pays"
                                                    : loadingCities
                                                    ? "Chargement des villes..."
                                                    : "Sélectionner une ville"
                                            }
                                            loadingLabel="Chargement des villes..."
                                            loading={loadingCities}
                                            disabled={!data.country}
                                            error={errors.city}
                                            options={cities.map((city) => ({
                                                value: city,
                                                label: city,
                                            }))}
                                            value={data.city}
                                            onChange={(value) =>
                                                setData("city", value)
                                            }
                                        />
                                    )}

                                    <FieldError error={errors.city} />
                                </div>

                                <div>
                                    <FieldLabel>LinkedIn</FieldLabel>

                                    <input
                                        type="text"
                                        value={data.linkedin}
                                        onChange={(e) =>
                                            setData("linkedin", e.target.value)
                                        }
                                        className={inputClass(errors.linkedin)}
                                        placeholder="https://linkedin.com/company/..."
                                    />

                                    <FieldError error={errors.linkedin} />
                                </div>

                                <div>
                                    <FieldLabel>Site web</FieldLabel>

                                    <input
                                        type="text"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData("website", e.target.value)
                                        }
                                        className={inputClass(errors.website)}
                                        placeholder="https://example.com"
                                    />

                                    <FieldError error={errors.website} />
                                </div>
                            </FormSection>

                            {/* Personne de contact */}
                            <FormSection
                                title="Personne de contact"
                                description="Qui contacter au sein de l'organisation."
                            >
                                <div>
                                    <FieldLabel required>Genre</FieldLabel>

                                    <select
                                        value={data.contact_gender}
                                        onChange={(e) =>
                                            setData("contact_gender", e.target.value)
                                        }
                                        className={inputClass(errors.contact_gender)}
                                    >
                                        <option value="">Sélectionner</option>

                                        {GENDERS.map((gender) => (
                                            <option key={gender.value} value={gender.value}>
                                                {gender.label}
                                            </option>
                                        ))}
                                    </select>

                                    <FieldError error={errors.contact_gender} />
                                </div>

                                <div>
                                    <FieldLabel required>Fonction</FieldLabel>

                                    <input
                                        type="text"
                                        value={data.contact_position}
                                        onChange={(e) =>
                                            setData("contact_position", e.target.value)
                                        }
                                        className={inputClass(errors.contact_position)}
                                        placeholder="Directeur, RH, Responsable..."
                                    />

                                    <FieldError error={errors.contact_position} />
                                </div>

                                <div>
                                    <FieldLabel required>Nom</FieldLabel>

                                    <input
                                        type="text"
                                        value={data.contact_last_name}
                                        onChange={(e) =>
                                            setData(
                                                "contact_last_name",
                                                toUpperCase(e.target.value)
                                            )
                                        }
                                        className={inputClass(errors.contact_last_name)}
                                        placeholder="NOM"
                                    />

                                    <FieldError error={errors.contact_last_name} />
                                </div>

                                <div>
                                    <FieldLabel required>Prénom</FieldLabel>

                                    <input
                                        type="text"
                                        value={data.contact_first_name}
                                        onChange={(e) =>
                                            setData(
                                                "contact_first_name",
                                                capitalizeFirstLetter(e.target.value)
                                            )
                                        }
                                        className={inputClass(errors.contact_first_name)}
                                        placeholder="Prénom"
                                    />

                                    <FieldError error={errors.contact_first_name} />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Email du contact
                                    </FieldLabel>

                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) =>
                                            setData("contact_email", e.target.value)
                                        }
                                        className={inputClass(errors.contact_email)}
                                        placeholder="contact@example.com"
                                    />

                                    <FieldError error={errors.contact_email} />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        GSM du contact
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) =>
                                            setData("contact_phone", e.target.value)
                                        }
                                        className={inputClass(errors.contact_phone)}
                                        placeholder="+212..."
                                    />

                                    <FieldError error={errors.contact_phone} />
                                </div>
                            </FormSection>

                            {/* Submit */}
                            <div className="flex items-center justify-end gap-3 bg-[#f6f7f5] px-6 py-6 md:px-10">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}

                                    {processing
                                        ? "Envoi en cours..."
                                        : "Envoyer les informations"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}