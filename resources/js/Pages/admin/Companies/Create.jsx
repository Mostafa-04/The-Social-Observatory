import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    ChevronDown,
    Loader2,
    Mail,
    MapPin,
    Save,
    Search,
    User,
        Check,

} from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";

import { createPortal } from "react-dom";

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

/* ---------- Styles partagés ---------- */

const inputClass = (error) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#263333] outline-none transition placeholder:text-[#9aa19f] disabled:cursor-not-allowed disabled:bg-[#f6f7f5] disabled:text-[#9aa19f] ${
        error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-[#d6d9d8] focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
    }`;

/* ---------- Helpers de formatage ---------- */

// Nom de l'entreprise / nom de famille : tout en majuscules
const toUpperCase = (value) => value.toUpperCase();

// Prénom : première lettre en majuscule, le reste en minuscules
const capitalizeFirstLetter = (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/* ---------- Composants réutilisables ---------- */

function Section({ icon: Icon, title, description, children }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#e4e7e5] bg-[#f6f7f5] px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#bf5429]/10">
                    <Icon className="h-[18px] w-[18px] text-[#bf5429]" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-[#1f2d2d]">
                        {title}
                    </h2>

                    {description && (
                        <p className="text-xs text-[#78807e]">{description}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

function FieldWrapper({ label, required, error, hint, className = "", children }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-medium text-[#263333]">
                {label}
                {required && <span className="ml-0.5 text-[#bf5429]">*</span>}
            </label>

            {children}

            {hint && !error && (
                <p className="mt-1.5 text-xs text-[#78807e]">{hint}</p>
            )}

            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function TextField({
    label,
    required,
    hint,
    error,
    className,
    type = "text",
    ...inputProps
}) {
    return (
        <FieldWrapper
            label={label}
            required={required}
            hint={hint}
            error={error}
            className={className}
        >
            <input
                type={type}
                className={inputClass(error)}
                {...inputProps}
            />
        </FieldWrapper>
    );
}

function SelectField({
    label,
    required,
    error,
    hint,
    className,
    placeholder = "Sélectionner...",
    options,
    value,
    onChange,
    disabled,
}) {
    return (
        <FieldWrapper
            label={label}
            required={required}
            error={error}
            hint={hint}
            className={className}
        >
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={inputClass(error)}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
}

function SearchableSelect({
    label,
    required,
    error,
    className,
    placeholder = "Sélectionner...",
    loadingLabel = "Chargement...",
    loading,
    options = [],
    value,
    onChange,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const selectedLabel =
        options.find((option) => option.value === value)?.label ?? "";

    const filtered = useMemo(() => {
        if (!query.trim()) {
            return options;
        }

        const search = query.toLowerCase().trim();

        return options.filter((option) =>
            option.label.toLowerCase().toLowerCase().includes(search)
        );
    }, [options, query]);

    /**
     * Calculer la position du dropdown
     */
    const updateDropdownPosition = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width,
        });
    };

    /**
     * Ouvrir le dropdown
     */
    const handleOpen = () => {
        if (loading) return;

        updateDropdownPosition();

        setOpen((prev) => !prev);
        setQuery("");
    };

    /**
     * Fermer si on clique dehors
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;

            if (
                buttonRef.current &&
                !buttonRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /**
     * Recalculer la position lors du scroll / resize
     */
    useEffect(() => {
        if (!open) return;

        const handlePositionUpdate = () => {
            updateDropdownPosition();
        };

        window.addEventListener("resize", handlePositionUpdate);
        window.addEventListener("scroll", handlePositionUpdate, true);

        return () => {
            window.removeEventListener(
                "resize",
                handlePositionUpdate
            );

            window.removeEventListener(
                "scroll",
                handlePositionUpdate,
                true
            );
        };
    }, [open]);

    /**
     * Sélectionner un pays
     */
    const handleSelect = (option) => {
        onChange(option.value);

        setOpen(false);
        setQuery("");
    };

    return (
        <FieldWrapper
            label={label}
            required={required}
            error={error}
            className={className}
        >
            {/* Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                disabled={loading}
                className={`${inputClass(
                    error
                )} flex w-full items-center justify-between text-left`}
            >
                <span
                    className={
                        selectedLabel
                            ? "text-[#263333]"
                            : "text-[#9aa19f]"
                    }
                >
                    {loading
                        ? loadingLabel
                        : selectedLabel || placeholder}
                </span>

                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#78807e] transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown */}
            {open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "fixed",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width,
                            zIndex: 999999,
                        }}
                        className="overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-2xl"
                    >
                        {/* Search */}
                        <div className="flex items-center gap-2 border-b border-[#e4e7e5] bg-white px-3 py-3">
                            <Search className="h-4 w-4 shrink-0 text-[#9aa19f]" />

                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value)
                                }
                                placeholder="Rechercher un pays..."
                                className="w-full bg-transparent text-sm text-[#263333] outline-none placeholder:text-[#9aa19f]"
                            />
                        </div>

                        {/* Countries */}
                        <div className="max-h-64 overflow-y-auto bg-white py-1">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-[#9aa19f]">
                                    Aucun résultat.
                                </div>
                            ) : (
                                filtered.map((option) => {
                                    const isSelected =
                                        option.value === value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleSelect(option)
                                            }
                                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                                                isSelected
                                                    ? "bg-[#bf5429]/10 text-[#bf5429]"
                                                    : "text-[#263333] hover:bg-[#f6f7f5]"
                                            }`}
                                        >
                                            <span>
                                                {option.label}
                                            </span>

                                            {isSelected && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </FieldWrapper>
    );
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        sector: "",
        country: "",

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

    /* ---------- Charger les villes quand le pays change ---------- */

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

    const sectorOptions = SECTORS.map((sector) => ({
        value: sector,
        label: sector,
    }));

    /* ---------- Submit ---------- */

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.companies.store"));
    };

    // Aucune ville disponible pour ce pays : on laisse saisir la ville à la main
    const noCityList =
        data.country && !loadingCities && cities.length === 0;

    return (
        <AdminLayout>
            <Head title="Ajouter une entreprise" />

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                            Ajouter une entreprise
                        </h1>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Renseignez les informations de l'organisation. Les
                            champs marqués d'une{" "}
                            <span className="font-semibold text-[#bf5429]">
                                *
                            </span>{" "}
                            sont obligatoires. L'ID est généré
                            automatiquement.
                        </p>
                    </div>

                    <Link
                        href={route("admin.companies.index")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour à la liste
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <Section
                        icon={Building2}
                        title="Informations générales"
                        description="Identité et secteur de l'organisation"
                    >
                        <TextField
                            label="Nom de l'organisation"
                            required
                            placeholder="NOM DE L'ORGANISATION"
                            className="md:col-span-2"
                            value={data.name}
                            onChange={(e) =>
                                setData("name", toUpperCase(e.target.value))
                            }
                            error={errors.name}
                        />

                        <SelectField
                            label="Secteur d'activité"
                            required
                            placeholder="Sélectionner un secteur"
                            options={sectorOptions}
                            value={data.sector}
                            onChange={(value) => setData("sector", value)}
                            error={errors.sector}
                        />

                        <SearchableSelect
                            label="Pays"
                            required
                            placeholder="Sélectionner un pays"
                            loadingLabel="Chargement des pays..."
                            loading={loadingCountries}
                            options={countryOptions}
                            value={data.country}
                            onChange={(value) =>
                                setData({
                                    ...data,
                                    country: value,
                                    city: "",
                                })
                            }
                            error={errors.country}
                        />
                    </Section>

                    {/* Adresse */}
                    <Section
                        icon={MapPin}
                        title="Adresse de l'organisation"
                        description="Localisation de l'organisation"
                    >
                        <TextField
                            label="Adresse postale"
                            required
                            placeholder="Rue, numéro, quartier..."
                            className="md:col-span-2"
                            value={data.address}
                            onChange={(e) =>
                                setData("address", e.target.value)
                            }
                            error={errors.address}
                        />

                        {/* Ville */}
                        <FieldWrapper label="Ville" required error={errors.city}>
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
                                    label=""
                                    required={false}
                                    placeholder={
                                        !data.country
                                            ? "Sélectionner d'abord un pays"
                                            : loadingCities
                                            ? "Chargement des villes..."
                                            : "Sélectionner une ville"
                                    }
                                    loadingLabel="Chargement des villes..."
                                    loading={loadingCities}
                                    options={cities.map((city) => ({
                                        value: city,
                                        label: city,
                                    }))}
                                    value={data.city}
                                    onChange={(value) =>
                                        setData("city", value)
                                    }
                                    error={errors.city}
                                    disabled={!data.country}
                                />
                            )}
                        </FieldWrapper>

                        <TextField
                            label="LinkedIn"
                            placeholder="https://linkedin.com/company/..."
                            value={data.linkedin}
                            onChange={(e) =>
                                setData("linkedin", e.target.value)
                            }
                            error={errors.linkedin}
                        />

                        <TextField
                            label="Site web"
                            placeholder="https://example.com"
                            value={data.website}
                            onChange={(e) =>
                                setData("website", e.target.value)
                            }
                            error={errors.website}
                        />
                    </Section>

                    {/* Personne de contact */}
                    <Section
                        icon={User}
                        title="Personne de contact"
                        description="Interlocuteur au sein de l'organisation"
                    >
                        <SelectField
                            label="Genre"
                            required
                            placeholder="Sélectionner"
                            options={GENDERS}
                            value={data.contact_gender}
                            onChange={(value) =>
                                setData("contact_gender", value)
                            }
                            error={errors.contact_gender}
                        />

                        <TextField
                            label="Fonction"
                            required
                            placeholder="Directeur, RH, Responsable..."
                            value={data.contact_position}
                            onChange={(e) =>
                                setData("contact_position", e.target.value)
                            }
                            error={errors.contact_position}
                        />

                        <TextField
                            label="Nom"
                            required
                            placeholder="NOM"
                            value={data.contact_last_name}
                            onChange={(e) =>
                                setData(
                                    "contact_last_name",
                                    toUpperCase(e.target.value)
                                )
                            }
                            error={errors.contact_last_name}
                        />

                        <TextField
                            label="Prénom"
                            required
                            placeholder="Prénom"
                            value={data.contact_first_name}
                            onChange={(e) =>
                                setData(
                                    "contact_first_name",
                                    capitalizeFirstLetter(e.target.value)
                                )
                            }
                            error={errors.contact_first_name}
                        />

                        <TextField
                            label="Email du contact"
                            required
                            type="email"
                            placeholder="contact@example.com"
                            value={data.contact_email}
                            onChange={(e) =>
                                setData("contact_email", e.target.value)
                            }
                            error={errors.contact_email}
                        />

                        <TextField
                            label="GSM du contact"
                            required
                            placeholder="+212..."
                            value={data.contact_phone}
                            onChange={(e) =>
                                setData("contact_phone", e.target.value)
                            }
                            error={errors.contact_phone}
                        />
                    </Section>

                    {/* ACTIONS */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route("admin.companies.index")}
                            className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}

                            {processing
                                ? "Enregistrement..."
                                : "Ajouter l'entreprise"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}