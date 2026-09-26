import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ChevronDown, Save, Search } from "lucide-react";
import Swal from "sweetalert2";
import AdminLayout from "@/Pages/admin/AdminLayout";

const BRAND_COLOR = "#bf5429";

const inputClass = (error) =>
    `w-full rounded-xl border ${
        error ? "border-red-400" : "border-[#d6d9d8]"
    } bg-white px-4 py-3 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10`;

/* ---------- SweetAlert2 ---------- */

const alertSuccess = (firstName) =>
    Swal.fire({
        icon: "success",
        title: "Succès",
        html: `<p>Bonjour <strong>${firstName}</strong></p><p>Les données de la personne ont été enregistrées avec succès dans la base de données.</p>`,
        confirmButtonText: "OK",
        confirmButtonColor: BRAND_COLOR,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

const alertErrors = (formErrors) => {
    const messages = Object.values(formErrors || {}).flat();
    const list = messages.map((msg) => `<li>${msg}</li>`).join("");

    Swal.fire({
        icon: "error",
        title: "Erreur de sauvegarde",
        html: `
            <p>Veuillez corriger les erreurs suivantes :</p>
            <ul style="text-align:left;margin-top:10px;">${list}</ul>
        `,
        confirmButtonText: "Réessayer",
        confirmButtonColor: BRAND_COLOR,
    });
};

/**
 * Liste déroulante avec recherche au clavier, pour le champ Pays.
 * Alimentée par /api/countries (voir route "api.countries").
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
                )} flex items-center justify-between text-left ${
                    disabled ? "cursor-not-allowed opacity-60" : ""
                }`}
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

export default function PeopleCreate() {
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

    /* ---------- Submit ---------- */

    const submit = (e) => {
        e.preventDefault();

        const firstName = data.first_name;

        post(route("people.store"), {
            preserveScroll: true,
            onSuccess: () => {
                alertSuccess(firstName);
                reset();
            },
            onError: (formErrors) => alertErrors(formErrors),
        });
    };

    return (
        <AdminLayout>
            <Head title="Ajouter une personne" />

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <div className="mb-8">
                    <Link
                        href={route("people.index")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#68706e] transition hover:text-[#bf5429]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux personnes
                    </Link>

                    <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                        Ajouter une personne
                    </h1>

                    <p className="mt-2 text-sm text-[#68706e]">
                        Ajouter une nouvelle personne à la liste globale de
                        l'Observatoire.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-7"
                >
                    {/* Informations personnelles */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-lg font-semibold text-[#1f2d2d]">
                            Informations personnelles
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Prénom */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Prénom{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    id="first_name"
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    className={inputClass(errors.first_name)}
                                    placeholder="Prénom"
                                />

                                {errors.first_name && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            {/* Nom */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Nom{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    id="last_name"
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    className={inputClass(errors.last_name)}
                                    placeholder="Nom"
                                />

                                {errors.last_name && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                            {/* Genre */}
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Genre{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className={inputClass(errors.gender)}
                                >
                                    <option value="">
                                        Sélectionner un genre
                                    </option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>

                                {errors.gender && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-lg font-semibold text-[#1f2d2d]">
                            Coordonnées
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* E-mail */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    E-mail{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className={inputClass(errors.email)}
                                    placeholder="exemple@email.com"
                                />

                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Téléphone (GSM) */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    GSM{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className={inputClass(errors.phone)}
                                    placeholder="+212 6 00 00 00 00"
                                />

                                {errors.phone && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Organisation et fonction */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-lg font-semibold text-[#1f2d2d]">
                            Organisation et fonction
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Organisation - Facultatif */}
                            <div>
                                <label
                                    htmlFor="organisation"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Organisation
                                </label>

                                <input
                                    id="organisation"
                                    type="text"
                                    value={data.organisation}
                                    onChange={(e) =>
                                        setData("organisation", e.target.value)
                                    }
                                    className={inputClass(errors.organisation)}
                                    placeholder="Nom de l'organisation"
                                />

                                {errors.organisation && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.organisation}
                                    </p>
                                )}
                            </div>

                            {/* Fonction - Obligatoire */}
                            <div>
                                <label
                                    htmlFor="role"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Fonction{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    id="role"
                                    type="text"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    className={inputClass(errors.role)}
                                    placeholder="Ex. Chercheur, Directeur..."
                                />

                                {errors.role && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Localisation */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-lg font-semibold text-[#1f2d2d]">
                            Localisation
                        </h2>

                        <div className="grid gap-5">
                            {/* Pays - Obligatoire, select recherchable */}
                            <div>
                                <label
                                    htmlFor="country"
                                    className="mb-2 block text-sm font-medium text-[#263333]"
                                >
                                    Pays{" "}
                                    <span className="text-[#bf5429]">*</span>
                                </label>

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

                                {errors.country && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="mb-8">
                        <h2 className="mb-5 text-lg font-semibold text-[#1f2d2d]">
                            Profil en ligne
                        </h2>

                        <div>
                            <label
                                htmlFor="linkedin"
                                className="mb-2 block text-sm font-medium text-[#263333]"
                            >
                                LinkedIn
                            </label>

                            <input
                                id="linkedin"
                                type="url"
                                value={data.linkedin}
                                onChange={(e) =>
                                    setData("linkedin", e.target.value)
                                }
                                className={inputClass(errors.linkedin)}
                                placeholder="https://linkedin.com/in/..."
                            />

                            {errors.linkedin && (
                                <p className="mt-1.5 text-xs text-red-500">
                                    {errors.linkedin}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#eef0ee] pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href={route("people.index")}
                            className="inline-flex items-center justify-center rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />

                            {processing
                                ? "Enregistrement..."
                                : "Ajouter la personne"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}