import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "@/Pages/admin/AdminLayout";
import {
    Building2,
    CheckSquare,
    ChevronDown,
    Eye,
    Mail,
    Paperclip,
    Search,
    Send,
    Square,
    X,
} from "lucide-react";

/* ---------- SweetAlert2 : helpers ---------- */

const BRAND_COLOR = "#bf5429";

const alertSuccess = (text) =>
    Swal.fire({
        icon: "success",
        title: "Email envoyé",
        text,
        confirmButtonText: "OK",
        confirmButtonColor: BRAND_COLOR,
    });

const alertError = (text, title = "Erreur") =>
    Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonText: "Fermer",
        confirmButtonColor: BRAND_COLOR,
    });

const alertWarning = (text) =>
    Swal.fire({
        icon: "warning",
        title: "Attention",
        text,
        confirmButtonText: "OK",
        confirmButtonColor: BRAND_COLOR,
    });

/* Texte brut d'un contenu HTML (pour vérifier que le message n'est pas vide) */
const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

const GENDER_LABELS = {
    homme: "Homme",
    femme: "Femme",
};

// Reprend exactement la liste utilisée dans le formulaire d'inscription,
// pour que le filtre "Secteur" propose les mêmes libellés que ceux saisis.
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

const selectClass =
    "rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10";

/**
 * Liste déroulante avec recherche au clavier, utilisée ici pour les
 * filtres Pays et Ville (alimentées par /api/countries et
 * /api/countries/{country}/cities).
 */
function SearchableSelect({
    placeholder = "Sélectionner...",
    loadingLabel = "Chargement...",
    loading = false,
    disabled = false,
    options = [],
    value,
    onChange,
    className = "",
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
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => {
                    if (!disabled && !loading) setOpen((prev) => !prev);
                }}
                disabled={disabled || loading}
                className={`${selectClass} flex w-full items-center justify-between text-left ${
                    disabled ? "cursor-not-allowed opacity-60" : ""
                }`}
            >
                <span className={selectedLabel ? "text-[#263333]" : "text-[#9aa19f]"}>
                    {loading ? loadingLabel : selectedLabel || placeholder}
                </span>

                <ChevronDown className="h-4 w-4 shrink-0 text-[#9aa19f]" />
            </button>

            {open && !loading && (
                <div className="absolute z-20 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-[#eef0ee] px-3 py-2.5">
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
                        {value && (
                            <button
                                type="button"
                                onClick={() => handleSelect({ value: "" })}
                                className="block w-full px-3 py-2.5 text-left text-sm text-[#9aa19f] hover:bg-[#f6f7f5]"
                            >
                                Effacer la sélection
                            </button>
                        )}

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

export default function Index({ companies, filters = {}, filterOptions = {} }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [sector, setSector] = useState(filters.sector ?? "");
    const [country, setCountry] = useState(filters.country ?? "");
    const [city, setCity] = useState(filters.city ?? "");

    /* ---------- Pays / villes via l'API (comme le formulaire d'inscription) ---------- */

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true);

            try {
                const response = await fetch(route("api.countries"));

                if (!response.ok) throw new Error("Erreur pays");

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

    // Recharge les villes à chaque changement de pays (y compris au chargement,
    // pour retrouver les villes du pays déjà filtré dans l'URL).
    useEffect(() => {
        if (!country) {
            setCities([]);
            return;
        }

        const loadCities = async () => {
            setLoadingCities(true);
            setCities([]);

            try {
                const response = await fetch(
                    route("api.countries.cities", { country })
                );

                if (!response.ok) throw new Error("Erreur villes");

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
    }, [country]);

    const countryOptions = countries.map((c) => ({
        value: c.name,
        label: c.code ? `${c.name} (${c.code})` : c.name,
    }));

    const cityOptions = cities.map((c) => ({ value: c, label: c }));

    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectAllCompanies, setSelectAllCompanies] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } =
        useForm({
            subject: "",
            message: "",
            attachments: [],
        });

    const rows = companies?.data ?? [];
    const links = companies?.links ?? [];
    const total = companies?.total ?? rows.length;

    // Secteurs présents dans les données + liste de référence, sans doublons
    const sectorOptions = Array.from(
        new Set([...(filterOptions.sectors || []), ...SECTORS])
    );

    const hasActiveFilters = Boolean(search || sector || country || city);

    /* ---------- Filtres ---------- */

    const applyFilters = (overrides = {}) => {
        clearSelection();

        router.get(
            route("admin.companies.index"),
            {
                search: overrides.search ?? search,
                sector: overrides.sector ?? sector,
                country: overrides.country ?? country,
                city: overrides.city ?? city,
            },
            { preserveState: true, replace: true }
        );
    };

    // Changer de pays réinitialise la ville : les villes d'un autre pays
    // ne s'appliquent plus au filtre en cours.
    const handleCountryChange = (value) => {
        setCountry(value);
        setCity("");
        applyFilters({ country: value, city: "" });
    };

    const resetFilters = () => {
        setSearch("");
        setSector("");
        setCountry("");
        setCity("");
        clearSelection();

        router.get(
            route("admin.companies.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    /* ---------- Valeurs calculées (sélection) ---------- */

    const currentCompanyIds = rows.map((company) => company.id);

    const isRowChecked = (id) =>
        selectAllCompanies || selectedCompanies.includes(id);

    const allCurrentPageSelected =
        rows.length > 0 && rows.every((company) => isRowChecked(company.id));

    const somePageSelected = rows.some((company) => isRowChecked(company.id));

    const selectedCount = selectAllCompanies ? total : selectedCompanies.length;

    const hasSelection = selectedCount > 0;

    /* ---------- Sélection ---------- */

    const clearSelection = () => {
        setSelectAllCompanies(false);
        setSelectedCompanies([]);
    };

    const selectEverything = () => {
        setSelectAllCompanies(true);
        setSelectedCompanies([]);
    };

    // Bouton global (en-tête) : bascule entre "tout sélectionner" (toutes les
    // entreprises, sur toutes les pages) et "tout désélectionner", quel que
    // soit l'état actuel de la sélection.
    const toggleSelectAllGlobal = () => {
        if (selectAllCompanies) {
            clearSelection();
        } else {
            selectEverything();
        }
    };

    // Checkbox du header : agit uniquement sur la page courante
    const toggleCurrentPage = (checked) => {
        if (selectAllCompanies) {
            if (!checked) clearSelection();
            return;
        }

        setSelectedCompanies((current) =>
            checked
                ? [...new Set([...current, ...currentCompanyIds])]
                : current.filter((id) => !currentCompanyIds.includes(id))
        );
    };

    const toggleCompany = (companyId, checked) => {
        // En mode "toutes les entreprises", on repasse en sélection manuelle
        // en gardant la page courante cochée, sauf la ligne décochée.
        if (selectAllCompanies) {
            setSelectAllCompanies(false);
            setSelectedCompanies(
                currentCompanyIds.filter((id) => id !== companyId)
            );
            return;
        }

        setSelectedCompanies((current) =>
            checked
                ? [...current, companyId]
                : current.filter((id) => id !== companyId)
        );
    };

    /* ---------- Email ---------- */

    const openEmailModal = () => {
        if (!hasSelection) {
            alertWarning("Veuillez sélectionner au moins une entreprise.");
            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (processing) return;

        setShowEmailModal(false);
        clearErrors();
    };

    const handleFilesChange = (e) => {
        setData("attachments", Array.from(e.target.files || []));
    };

    const handleSendEmail = (e) => {
        e.preventDefault();

        if (!hasSelection) {
            alertWarning("Veuillez sélectionner au moins une entreprise.");
            return;
        }

        if (!data.subject.trim()) {
            alertWarning("Veuillez saisir l'objet de l'email.");
            return;
        }

        if (!stripHtml(data.message)) {
            alertWarning("Veuillez saisir le message.");
            return;
        }

        // Les IDs sont ajoutés au moment de l'envoi pour être toujours à jour
        transform((formData) => ({
            ...formData,
            company_ids: selectAllCompanies ? [] : selectedCompanies,
            send_to_all: selectAllCompanies,
        }));

        post(route("admin.companies.send-email"), {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: (page) => {
                const flash = page?.props?.flash;

                // Le contrôleur a redirigé avec un message d'erreur
                if (flash?.error) {
                    alertError(flash.error, "Échec de l'envoi");
                    return;
                }

                setShowEmailModal(false);
                clearSelection();
                reset("subject", "message", "attachments");

                alertSuccess(
                    flash?.success || "Votre email a été envoyé avec succès."
                );
            },

            onError: (formErrors) => {
                const firstError = Object.values(formErrors || {})[0];

                alertError(
                    firstError ||
                        "Une erreur est survenue lors de l'envoi de l'email.",
                    "Échec de l'envoi"
                );
            },
        });
    };

    /* ---------- React Quill ---------- */

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link"],
            ["clean"],
        ],
    };

    return (
        <AdminLayout>
            <Head title="Entreprises" />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                            Entreprises
                        </h1>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Liste globale des entreprises enregistrées dans
                            l'Observatoire.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Bouton global : sélectionne/désélectionne les {total}
                            entreprises, indépendamment de la pagination. */}
                        {total > 0 && (
                            <button
                                type="button"
                                onClick={toggleSelectAllGlobal}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                            >
                                {selectAllCompanies ? (
                                    <CheckSquare className="h-4 w-4 text-[#bf5429]" />
                                ) : (
                                    <Square className="h-4 w-4" />
                                )}

                                {selectAllCompanies
                                    ? "Tout désélectionner"
                                    : `Tout sélectionner (${total})`}
                            </button>
                        )}

                        {hasSelection && (
                            <button
                                type="button"
                                onClick={openEmailModal}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bf5429] bg-white px-5 py-3 text-sm font-semibold text-[#bf5429] transition hover:bg-[#bf5429]/5"
                            >
                                <Mail className="h-4 w-4" />
                                Envoyer un email ({selectedCount})
                            </button>
                        )}

                        <Link
                            href={route("admin.companies.create")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            <Building2 className="h-4 w-4" />
                            Ajouter une entreprise
                        </Link>
                    </div>
                </div>

                {/* FILTRES */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                    }}
                    className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#dfe3e0] bg-white p-4 lg:flex-row lg:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un nom, un contact, un site web..."
                            className="w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-10 pr-4 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                        />
                    </div>

                    <select
                        value={sector}
                        onChange={(e) => {
                            setSector(e.target.value);
                            applyFilters({ sector: e.target.value });
                        }}
                        className={selectClass}
                    >
                        <option value="">Tous les secteurs</option>

                        {sectorOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <SearchableSelect
                        placeholder="Tous les pays"
                        loadingLabel="Chargement des pays..."
                        loading={loadingCountries}
                        options={countryOptions}
                        value={country}
                        onChange={handleCountryChange}
                        className="lg:w-52"
                    />

                    <SearchableSelect
                        placeholder={
                            !country ? "Sélectionner un pays d'abord" : "Toutes les villes"
                        }
                        loadingLabel="Chargement des villes..."
                        loading={loadingCities}
                        disabled={!country}
                        options={cityOptions}
                        value={city}
                        onChange={(value) => {
                            setCity(value);
                            applyFilters({ city: value });
                        }}
                        className="lg:w-52"
                    />

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            Filtrer
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </form>

                {/* BANNIÈRE "SÉLECTIONNER TOUT" (style Gmail) */}
                {allCurrentPageSelected && total > rows.length && (
                    <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-[#bf5429]/5 px-4 py-3 text-sm text-[#263333]">
                        {selectAllCompanies ? (
                            <>
                                <span>
                                    Les {total} entreprises sont sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="font-semibold text-[#bf5429] underline"
                                >
                                    Annuler la sélection
                                </button>
                            </>
                        ) : (
                            <>
                                <span>
                                    {rows.length} entreprises de cette page
                                    sont sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={selectEverything}
                                    className="font-semibold text-[#bf5429] underline"
                                >
                                    Sélectionner les {total} entreprises
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* TABLEAU */}
                <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f6f7f5] text-xs uppercase tracking-wide text-[#78807e]">
                                <tr>
                                    <th className="px-5 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={allCurrentPageSelected}
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate =
                                                        somePageSelected &&
                                                        !allCurrentPageSelected;
                                                }
                                            }}
                                            onChange={(e) =>
                                                toggleCurrentPage(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </th>

                                    <th className="px-5 py-3.5 font-medium">
                                        Entreprise
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Secteur
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Contact
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Ville / Pays
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#eef0ee]">
                                {rows.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center text-sm text-[#78807e]"
                                        >
                                            Aucune entreprise ne correspond à
                                            ces critères.
                                        </td>
                                    </tr>
                                )}

                                {rows.map((company) => {
                                    const contactFullName = [
                                        company.contact_first_name,
                                        company.contact_last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ");

                                    return (
                                        <tr
                                            key={company.id}
                                            className="transition hover:bg-[#f6f7f5]"
                                        >
                                            <td className="px-5 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isRowChecked(
                                                        company.id
                                                    )}
                                                    onChange={(e) =>
                                                        toggleCompany(
                                                            company.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="font-medium text-[#263333]">
                                                    {company.name}
                                                </div>

                                                {company.website && (
                                                    <div className="text-xs text-[#78807e]">
                                                        {company.website}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                {company.sector || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                <div className="text-[#263333]">
                                                    {contactFullName || "—"}
                                                    {company.contact_gender && (
                                                        <span className="ml-1 text-xs text-[#9aa19f]">
                                                            (
                                                            {GENDER_LABELS[
                                                                company
                                                                    .contact_gender
                                                            ] ||
                                                                company.contact_gender}
                                                            )
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-xs">
                                                    {company.contact_email ||
                                                        company.contact_phone ||
                                                        "—"}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                {[company.city, company.country]
                                                    .filter(Boolean)
                                                    .join(", ") || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "admin.companies.show",
                                                        company.id
                                                    )}
                                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#bf5429] hover:text-[#a94320]"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Voir
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                {links.length > 3 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`rounded-lg px-3.5 py-2 text-sm transition ${
                                    link.active
                                        ? "bg-[#bf5429] text-white"
                                        : link.url
                                        ? "bg-white text-[#263333] hover:bg-[#f0f2f0]"
                                        : "cursor-not-allowed bg-white text-[#c3c8c6]"
                                }`}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* EMAIL MODAL */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-[#e4e7e5] px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                    Envoyer un email
                                </h2>

                                <p className="mt-1 text-sm text-[#78807e]">
                                    {selectAllCompanies
                                        ? `Toutes les entreprises (${total})`
                                        : `${selectedCount} entreprise(s) sélectionnée(s)`}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={processing}
                                className="rounded-lg p-2 text-[#78807e] transition hover:bg-[#f6f7f5] hover:text-[#263333]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <form
                            onSubmit={handleSendEmail}
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="overflow-y-auto px-6 py-5">
                                {/* Objet */}
                                <div className="mb-5">
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Objet
                                    </label>

                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) =>
                                            setData("subject", e.target.value)
                                        }
                                        placeholder="Objet de l'email"
                                        className="w-full rounded-xl border border-[#d6d9d8] px-4 py-3 text-sm outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                                    />

                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="mb-5">
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Message
                                    </label>

                                    <div className="overflow-hidden rounded-xl border border-[#d6d9d8]">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.message}
                                            onChange={(value) =>
                                                setData("message", value)
                                            }
                                            modules={quillModules}
                                            placeholder="Écrivez votre message..."
                                        />
                                    </div>

                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* Pièces jointes */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Fichiers / Images
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d6d9d8] px-4 py-4 text-sm text-[#68706e] transition hover:border-[#bf5429] hover:bg-[#bf5429]/5">
                                        <Paperclip className="h-5 w-5 text-[#bf5429]" />

                                        <span>
                                            Ajouter des fichiers ou images
                                        </span>

                                        <input
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                                            onChange={handleFilesChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {data.attachments?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {data.attachments.map(
                                                (file, index) => (
                                                    <div
                                                        key={`${file.name}-${index}`}
                                                        className="flex items-center justify-between rounded-lg bg-[#f6f7f5] px-3 py-2 text-sm"
                                                    >
                                                        <span className="truncate text-[#263333]">
                                                            {file.name}
                                                        </span>

                                                        <span className="ml-3 shrink-0 text-xs text-[#78807e]">
                                                            {(
                                                                file.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {errors.attachments && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.attachments}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* MODAL FOOTER */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#e4e7e5] px-6 py-4">
                                <button
                                    type="button"
                                    onClick={closeEmailModal}
                                    disabled={processing}
                                    className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] disabled:opacity-60"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Envoi...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Envoyer
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}