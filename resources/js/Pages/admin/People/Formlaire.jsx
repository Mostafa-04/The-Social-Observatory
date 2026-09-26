import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    AlertCircle,
    Building2,
    ChevronDown,
    CheckCircle2,
    FileText,
    Mail,
    MapPin,
    Save,
    Search,
    User,
} from "lucide-react";
import Swal from "sweetalert2";

/* ---------- Petits composants ---------- */

const inputClass = (error) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-[#263333] outline-none transition placeholder:text-[#9aa19f] focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/15 disabled:cursor-not-allowed disabled:bg-[#f6f7f5] disabled:text-[#9aa19f] ${
        error ? "border-red-400 bg-red-50/40" : "border-[#d6d9d8] bg-white"
    }`;

function Field({ id, label, required, error, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-[#263333]"
            >
                {label}
                {required && (
                    <span className="ml-0.5 text-[#bf5429]" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 flex items-start gap-1 text-xs text-red-600"
                >
                    <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

function Section({ icon: Icon, title, children }) {
    return (
        <section className="border-t border-[#eef0ee] py-7 first:border-t-0 first:pt-0">
            <h2 className="mb-5 flex items-center gap-2.5 text-base font-semibold text-[#1f2d2d]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bf5429]/10 text-[#bf5429]">
                    <Icon className="h-4 w-4" />
                </span>
                {title}
            </h2>

            {children}
        </section>
    );
}

/**
 * Liste déroulante avec recherche au clavier, pour le champ Pays.
 * Rendu visuel aligné sur inputClass() de cette page.
 */
function SearchableSelect({
    id,
    error,
    placeholder = "Sélectionner...",
    loadingLabel = "Chargement...",
    loading = false,
    disabled = false,
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
                id={id}
                type="button"
                onClick={() => {
                    if (!disabled && !loading) setOpen((prev) => !prev);
                }}
                disabled={disabled || loading}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`${inputClass(
                    error
                )} flex items-center justify-between text-left`}
            >
                <span className={selectedLabel ? "text-[#263333]" : "text-[#9aa19f]"}>
                    {loading ? loadingLabel : selectedLabel || placeholder}
                </span>

                <ChevronDown className="h-4 w-4 shrink-0 text-[#9aa19f]" />
            </button>

            {open && !loading && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-[#eef0ee] px-3 py-2.5">
                        <Search className="h-4 w-4 text-[#9aa19f]" />

                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un pays..."
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
                                        : "text-[#263333]"
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

/* ---------- Page ---------- */

export default function PeopleCreate() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        phone: "",
        organisation: "",
        role: "",
        country: "",
        linkedin: "",
    });

    const [submittedName, setSubmittedName] = useState(null);
    const successRef = useRef(null);

    /* ---------- Pays via /api/countries ---------- */

    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

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

    const countryOptions = countries.map((country) => ({
        value: country.name,
        label: country.code ? `${country.name} (${country.code})` : country.name,
    }));

    const hasErrors = Object.keys(errors).length > 0;

    /* Focus sur le message de succès */
    React.useEffect(() => {
        if (submittedName !== null) {
            successRef.current?.focus();
        }
    }, [submittedName]);

    const submit = (e) => {
        e.preventDefault();

        const firstName = data.first_name;

        post(route("person.form.store"), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Succès",
                    html: `<p>Bonjour <strong>${firstName}</strong></p><p>Les données de la personne ont été enregistrées avec succès dans la base de données</p>`,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#bf5429",
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                }).then((result) => {
                    if (
                        result.isConfirmed ||
                        result.dismiss === Swal.DismissReason.timer
                    ) {
                        reset();
                        setSubmittedName(firstName);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                });
            },
            onError: (formErrors) => {
                const errorMessages = Object.values(formErrors).flat();
                const errorList = errorMessages
                    .map((msg) => `<li>${msg}</li>`)
                    .join("");

                Swal.fire({
                    icon: "error",
                    title: "Erreur de sauvegarde",
                    html: `
                        <p>Veillez corriger les erreurs suivantes:</p>
                        <ul style="text-align: left; margin-top: 10px;">
                            ${errorList}
                        </ul>
                    `,
                    confirmButtonText: "Réessayer",
                    confirmButtonColor: "#bf5429",
                });
            },
        });
    };

    const bind = (name) => ({
        id: name,
        value: data[name],
        onChange: (e) => setData(name, e.target.value),
        className: inputClass(errors[name]),
        "aria-invalid": errors[name] ? "true" : undefined,
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
    });

    return (
        <div className="min-h-screen bg-[#f4f6f5] lg:grid lg:grid-cols-[minmax(320px,420px)_1fr]">
            <Head title="Inscription — The Social Observatory" />

            {/* ---------- PANNEAU MARQUE ---------- */}
            <aside className="border-b-4 border-[#bf5429] bg-[#1f2d2d] px-6 py-10 text-white sm:px-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:border-b-0 lg:border-r-4 lg:px-12 lg:py-14">
                <div>
                    <img
                        src="/logo.png"
                        alt="The Social Observatory"
                        className="h-16 w-16 rounded-xl object-contain sm:h-20 sm:w-20"
                    />

                    <h1 className="mt-8 font-serif text-3xl leading-tight sm:text-4xl">
                        Rejoignez le réseau de l'Observatoire
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#cbd3d1] sm:text-base">
                        Renseignez vos coordonnées pour être enregistré(e)
                        dans notre base de contacts.
                    </p>
                </div>

                <p className="mt-10 hidden max-w-xs text-sm leading-relaxed text-[#8f9a97] lg:block">
                    Depuis Casablanca, pour une meilleure compréhension du
                    progrès social en Afrique.
                </p>
            </aside>

            {/* ---------- FORMULAIRE ---------- */}
            <main className="px-4 py-8 sm:px-8 lg:px-14 lg:py-14">
                <div className="mx-auto max-w-3xl">
                    {/* Message de succès */}
                    {submittedName !== null ? (
                        <div
                            ref={successRef}
                            tabIndex={-1}
                            role="status"
                            aria-live="polite"
                            className="rounded-2xl border border-[#cfe3d6] bg-white p-8 text-center shadow-sm outline-none sm:p-12"
                        >
                            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-9 w-9" />
                            </span>

                            <h2 className="mt-6 text-2xl font-semibold text-[#1f2d2d]">
                                {submittedName
                                    ? `Merci ${submittedName}, c'est enregistré`
                                    : "Inscription enregistrée"}
                            </h2>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#68706e]">
                                {flash?.success ||
                                    "La personne a bien été ajoutée à la base de données de l'Observatoire."}
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setSubmittedName(null)}
                                    className="inline-flex items-center justify-center rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2"
                                >
                                    Ajouter une autre personne
                                </button>

                                <Link
                                    href={route("people.index")}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2"
                                >
                                    Voir la liste
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={submit}
                            noValidate
                            className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm sm:p-8"
                        >
                            <div className="mb-7">
                                <h2 className="text-xl font-semibold text-[#1f2d2d] sm:text-2xl">
                                    Nouvelle personne
                                </h2>

                                <p className="mt-1.5 text-sm text-[#68706e]">
                                    Les champs marqués d'un astérisque (
                                    <span className="text-[#bf5429]">*</span>)
                                    sont obligatoires.
                                </p>
                            </div>

                            {hasErrors && (
                                <div
                                    role="alert"
                                    className="mb-7 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    Certains champs sont invalides. Corrigez
                                    ceux signalés en rouge, puis validez à
                                    nouveau.
                                </div>
                            )}

                            {/* Identité */}
                            <Section icon={User} title="Identité">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Prénom */}
                                    <Field
                                        id="first_name"
                                        label="Prénom"
                                        required
                                        error={errors.first_name}
                                    >
                                        <input
                                            type="text"
                                            autoComplete="given-name"
                                            placeholder="Prénom"
                                            {...bind("first_name")}
                                        />
                                    </Field>

                                    {/* Nom */}
                                    <Field
                                        id="last_name"
                                        label="Nom"
                                        required
                                        error={errors.last_name}
                                    >
                                        <input
                                            type="text"
                                            autoComplete="family-name"
                                            placeholder="Nom"
                                            {...bind("last_name")}
                                        />
                                    </Field>

                                    {/* Genre */}
                                    <Field
                                        id="gender"
                                        label="Genre"
                                        required
                                        error={errors.gender}
                                    >
                                        <select {...bind("gender")}>
                                            <option value="">
                                                Sélectionner un genre
                                            </option>
                                            <option value="M">Masculin</option>
                                            <option value="F">Féminin</option>
                                        </select>
                                    </Field>
                                </div>
                            </Section>

                            {/* Coordonnées */}
                            <Section icon={Mail} title="Coordonnées">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* E-mail */}
                                    <Field
                                        id="email"
                                        label="E-mail"
                                        required
                                        error={errors.email}
                                    >
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="exemple@email.com"
                                            {...bind("email")}
                                        />
                                    </Field>

                                    {/* GSM */}
                                    <Field
                                        id="phone"
                                        label="GSM"
                                        required
                                        error={errors.phone}
                                    >
                                        <input
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="+212 6 00 00 00 00"
                                            {...bind("phone")}
                                        />
                                    </Field>
                                </div>
                            </Section>

                            {/* Organisation et fonction */}
                            <Section
                                icon={Building2}
                                title="Organisation et fonction"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Organisation - Facultatif */}
                                    <Field
                                        id="organisation"
                                        label="Organisation"
                                        error={errors.organisation}
                                    >
                                        <input
                                            type="text"
                                            autoComplete="organization"
                                            placeholder="Nom de l'organisation"
                                            {...bind("organisation")}
                                        />
                                    </Field>

                                    {/* Fonction - Obligatoire */}
                                    <Field
                                        id="role"
                                        label="Fonction"
                                        required
                                        error={errors.role}
                                    >
                                        <input
                                            type="text"
                                            autoComplete="organization-title"
                                            placeholder="Ex. Chercheur, Directeur..."
                                            {...bind("role")}
                                        />
                                    </Field>
                                </div>
                            </Section>

                            {/* Localisation */}
                            <Section icon={MapPin} title="Localisation">
                                <div className="grid gap-5">
                                    <Field
                                        id="country"
                                        label="Pays"
                                        required
                                        error={errors.country}
                                    >
                                        <SearchableSelect
                                            id="country"
                                            error={errors.country}
                                            placeholder="Sélectionner un pays"
                                            loadingLabel="Chargement des pays..."
                                            loading={loadingCountries}
                                            options={countryOptions}
                                            value={data.country}
                                            onChange={(value) =>
                                                setData("country", value)
                                            }
                                        />
                                    </Field>
                                </div>
                            </Section>

                            {/* Profil en ligne */}
                            <Section icon={FileText} title="Profil en ligne">
                                <Field
                                    id="linkedin"
                                    label="LinkedIn"
                                    error={errors.linkedin}
                                >
                                    <input
                                        type="url"
                                        autoComplete="url"
                                        placeholder="https://linkedin.com/in/..."
                                        {...bind("linkedin")}
                                    />
                                </Field>
                            </Section>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#eef0ee] pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href={route("people.index")}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2"
                                >
                                    Annuler
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? "Enregistrement..."
                                        : "Ajouter la personne"}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-6 text-center text-xs text-[#78807e] lg:hidden">
                        Depuis Casablanca, pour une meilleure compréhension du
                        progrès social en Afrique.
                    </p>
                </div>
            </main>
        </div>
    );
}