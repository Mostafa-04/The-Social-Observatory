import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "@/Pages/admin/AdminLayout";
import {
    Building2,
    Check,
    CheckSquare,
    ChevronDown,
    Eye,
    FileText,
    Mail,
    MapPin,
    Paperclip,
    Plus,
    RotateCcw,
    Search,
    Send,
    Square,
    Trash2,
    Users,
    X,
} from "lucide-react";

/* ==========================================================================
   SweetAlert2 : thème unifié (boutons, popup, toasts)
   ========================================================================== */

const BRAND_COLOR = "#bf5429";

// Mixin de base : tous les popups héritent du même style
const AppSwal = Swal.mixin({
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: false,
    customClass: {
        popup: "!rounded-3xl !p-8 !shadow-2xl !font-sans",
        title: "!text-xl !font-semibold !text-[#1f2d2d] !p-0 !mt-2",
        htmlContainer: "!text-sm !text-[#68706e] !m-0 !mt-2 !p-0",
        actions: "!mt-6 !gap-3",
        confirmButton:
            "rounded-xl bg-[#bf5429] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/20",
        cancelButton:
            "rounded-xl border border-[#d6d9d8] bg-white px-6 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] focus:outline-none focus:ring-4 focus:ring-[#d6d9d8]/50",
        timerProgressBar: "!bg-[#bf5429]",
    },
});

// Toast discret en haut à droite (pour les avertissements rapides)
const Toast = AppSwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    customClass: {
        popup: "!rounded-2xl !p-4 !shadow-xl !font-sans",
        title: "!text-sm !font-medium !text-[#263333]",
        timerProgressBar: "!bg-[#bf5429]",
    },
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const alertSuccess = (text) =>
    AppSwal.fire({
        icon: "success",
        iconColor: "#2f8f5b",
        title: "Email envoyé",
        text,
        confirmButtonText: "Parfait",
        timer: 6000,
        timerProgressBar: true,
    });

const alertError = (text, title = "Une erreur est survenue") =>
    AppSwal.fire({
        icon: "error",
        iconColor: "#d64545",
        title,
        text,
        confirmButtonText: "Fermer",
    });

const toastWarning = (text) => Toast.fire({ icon: "warning", title: text });

// Confirmation avant envoi : récapitulatif du destinataire / objet / pièces jointes
const confirmSend = ({ recipients, subject, attachments, senderLabel }) =>
    AppSwal.fire({
        icon: "question",
        iconColor: BRAND_COLOR,
        title: "Confirmer l'envoi ?",
        html: `
            <div style="text-align:left" class="mt-4 space-y-2 rounded-2xl bg-[#f6f7f5] p-4 text-sm">
                <div class="flex justify-between gap-4"><span class="text-[#78807e]">Destinataires</span><strong class="text-[#263333]">${recipients}</strong></div>
                <div class="flex justify-between gap-4"><span class="text-[#78807e]">Expéditeur</span><strong class="text-[#263333] truncate">${senderLabel}</strong></div>
                <div class="flex justify-between gap-4"><span class="text-[#78807e]">Objet</span><strong class="text-[#263333] truncate">${subject}</strong></div>
                <div class="flex justify-between gap-4"><span class="text-[#78807e]">Pièces jointes</span><strong class="text-[#263333]">${attachments}</strong></div>
            </div>
            <p class="mt-3 text-xs text-[#78807e]">Cette action ne peut pas être annulée.</p>
        `,
        showCancelButton: true,
        confirmButtonText: "Envoyer maintenant",
        cancelButtonText: "Revenir",
    });

// Popup de chargement pendant l'envoi
const showSending = () =>
    AppSwal.fire({
        title: "Envoi en cours...",
        text: "Merci de patienter, ne fermez pas cette page.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });

/* ==========================================================================
   Utilitaires
   ========================================================================== */

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

const escapeHtml = (value) =>
    String(value ?? "").replace(
        /[&<>"']/g,
        (c) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

const initialsOf = (name) =>
    (name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

const formatSize = (bytes) =>
    bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
        : `${(bytes / 1024 / 1024).toFixed(2)} Mo`;

const GENDER_LABELS = { homme: "Homme", femme: "Femme" };

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

const fieldClass =
    "w-full rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition placeholder:text-[#9aa19f] focus:border-[#bf5429] focus:ring-4 focus:ring-[#bf5429]/10 disabled:cursor-not-allowed disabled:opacity-60";

const selectClass = fieldClass;

/* ==========================================================================
   Liste déroulante avec recherche
   ========================================================================== */

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
        return options.filter((o) => o.label.toLowerCase().includes(q));
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
                aria-expanded={open}
                className={`${selectClass} flex items-center justify-between text-left ${
                    value ? "border-[#bf5429]/50 bg-[#bf5429]/[0.03]" : ""
                }`}
            >
                <span
                    className={`truncate ${
                        selectedLabel ? "text-[#263333]" : "text-[#9aa19f]"
                    }`}
                >
                    {loading ? loadingLabel : selectedLabel || placeholder}
                </span>
                <ChevronDown
                    className={`ml-2 h-4 w-4 shrink-0 text-[#9aa19f] transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && !loading && (
                <div className="absolute z-30 mt-2 w-full min-w-[240px] overflow-hidden rounded-2xl border border-[#e4e7e5] bg-white shadow-xl">
                    <div className="flex items-center gap-2 border-b border-[#eef0ee] px-3.5 py-3">
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

                    <div className="max-h-60 overflow-y-auto py-1">
                        {value && (
                            <button
                                type="button"
                                onClick={() => handleSelect({ value: "" })}
                                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-[#bf5429] hover:bg-[#f6f7f5]"
                            >
                                <X className="h-3.5 w-3.5" />
                                Effacer la sélection
                            </button>
                        )}

                        {filtered.length === 0 && (
                            <p className="px-3.5 py-3 text-sm text-[#9aa19f]">
                                Aucun résultat.
                            </p>
                        )}

                        {filtered.map((option) => {
                            const active = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition hover:bg-[#f6f7f5] ${
                                        active
                                            ? "bg-[#bf5429]/10 font-medium text-[#bf5429]"
                                            : "text-[#263333]"
                                    }`}
                                >
                                    {option.label}
                                    {active && <Check className="h-4 w-4" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ==========================================================================
   Petits composants
   ========================================================================== */

function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#bf5429]/10 py-1 pl-3 pr-1.5 text-xs font-medium text-[#a94320]">
            {label}
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Retirer le filtre ${label}`}
                className="rounded-full p-0.5 transition hover:bg-[#bf5429]/20"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </span>
    );
}

function Checkbox({ checked, onChange, indeterminate = false, label }) {
    return (
        <input
            type="checkbox"
            aria-label={label}
            checked={checked}
            ref={(el) => {
                if (el) el.indeterminate = indeterminate;
            }}
            onChange={onChange}
            className="h-4 w-4 cursor-pointer rounded border-[#c3c8c6] text-[#bf5429] focus:ring-[#bf5429]/30"
        />
    );
}

/* ==========================================================================
   Page
   ========================================================================== */

export default function Index({
    companies,
    filters = {},
    filterOptions = {},
    senders = [],
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [sector, setSector] = useState(filters.sector ?? "");
    const [country, setCountry] = useState(filters.country ?? "");
    const [city, setCity] = useState(filters.city ?? "");

    /* ---------- Pays / villes ---------- */

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

    /* ---------- État sélection / email ---------- */

    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectAllCompanies, setSelectAllCompanies] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [dragging, setDragging] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
        subject: "",
        message: "",
        attachments: [],
        sender: senders[0]?.key ?? "contact",
    });

    const rows = companies?.data ?? [];
    const links = companies?.links ?? [];
    const total = companies?.total ?? rows.length;

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

    /* ---------- Sélection ---------- */

    const currentCompanyIds = rows.map((c) => c.id);

    const isRowChecked = (id) =>
        selectAllCompanies || selectedCompanies.includes(id);

    const allCurrentPageSelected =
        rows.length > 0 && rows.every((c) => isRowChecked(c.id));
    const somePageSelected = rows.some((c) => isRowChecked(c.id));
    const selectedCount = selectAllCompanies ? total : selectedCompanies.length;
    const hasSelection = selectedCount > 0;

    const clearSelection = () => {
        setSelectAllCompanies(false);
        setSelectedCompanies([]);
    };

    const selectEverything = () => {
        setSelectAllCompanies(true);
        setSelectedCompanies([]);
    };

    const toggleSelectAllGlobal = () => {
        if (selectAllCompanies) clearSelection();
        else selectEverything();
    };

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
            toastWarning("Sélectionnez au moins une entreprise.");
            return;
        }
        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (processing) return;
        setShowEmailModal(false);
        clearErrors();
    };

    const addFiles = (fileList) => {
        const incoming = Array.from(fileList || []);
        if (incoming.length === 0) return;

        // Évite les doublons (même nom + même taille)
        const existing = data.attachments || [];
        const merged = [...existing];
        incoming.forEach((file) => {
            const duplicate = merged.some(
                (f) => f.name === file.name && f.size === file.size
            );
            if (!duplicate) merged.push(file);
        });

        setData("attachments", merged);
    };

    const handleFilesChange = (e) => {
        addFiles(e.target.files);
        e.target.value = ""; // permet de re-sélectionner le même fichier
    };

    const removeFile = (index) =>
        setData(
            "attachments",
            data.attachments.filter((_, i) => i !== index)
        );

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();

        if (!hasSelection) {
            toastWarning("Sélectionnez au moins une entreprise.");
            return;
        }
        if (!data.subject.trim()) {
            toastWarning("Veuillez saisir l'objet de l'email.");
            return;
        }
        if (!stripHtml(data.message)) {
            toastWarning("Veuillez saisir le message.");
            return;
        }

        const senderInfo = senders.find((s) => s.key === data.sender);

        const { isConfirmed } = await confirmSend({
            recipients: selectAllCompanies
                ? `Toutes les entreprises (${total})`
                : `${selectedCount} entreprise(s)`,
            senderLabel: escapeHtml(
                senderInfo ? senderInfo.address : data.sender
            ),
            subject: escapeHtml(data.subject.trim()),
            attachments: data.attachments.length
                ? `${data.attachments.length} fichier(s)`
                : "Aucune",
        });

        if (!isConfirmed) return;

        transform((formData) => ({
            ...formData,
            sender: data.sender,
            company_ids: selectAllCompanies ? [] : selectedCompanies,
            send_to_all: selectAllCompanies,
        }));

        post(route("admin.companies.send-email"), {
            forceFormData: true,
            preserveScroll: true,

            onStart: () => {
                showSending();
            },

            onSuccess: (page) => {
                const flash = page?.props?.flash;

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
                        "L'email n'a pas pu être envoyé. Vérifiez les champs et réessayez.",
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

    const totalAttachmentsSize = (data.attachments || []).reduce(
        (sum, f) => sum + f.size,
        0
    );

    /* ======================================================================
       Rendu
       ====================================================================== */

    return (
        <AdminLayout>
            <Head title="Entreprises" />

            {/* Styles locaux : éditeur Quill + animation de la barre flottante */}
            <style>{`
                .quill-clean .ql-toolbar.ql-snow { border: 0; border-bottom: 1px solid #eef0ee; background: #f9faf8; padding: 10px 12px; }
                .quill-clean .ql-container.ql-snow { border: 0; font-size: 14px; }
                .quill-clean .ql-editor { min-height: 180px; max-height: 320px; color: #263333; }
                .quill-clean .ql-editor.ql-blank::before { color: #9aa19f; font-style: normal; }
                .quill-clean .ql-snow .ql-stroke { stroke: #68706e; }
                .quill-clean .ql-snow .ql-fill { fill: #68706e; }
                .quill-clean .ql-snow.ql-toolbar button:hover .ql-stroke,
                .quill-clean .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #bf5429; }
                .quill-clean .ql-snow.ql-toolbar button:hover .ql-fill,
                .quill-clean .ql-snow.ql-toolbar button.ql-active .ql-fill { fill: #bf5429; }
                @keyframes bar-in { from { transform: translate(-50%, 16px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                .selection-bar { animation: bar-in .2s ease-out; }
                @media (prefers-reduced-motion: reduce) { .selection-bar { animation: none; } }
            `}</style>

            <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:px-8 md:py-12">
                {/* ---------- EN-TÊTE ---------- */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1f2d2d] md:text-3xl">
                            Entreprises
                        </h1>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#68706e]">
                            Liste globale des entreprises enregistrées dans
                            l'Observatoire.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-[#68706e] ring-1 ring-[#dfe3e0]">
                            <Users className="h-4 w-4 text-[#bf5429]" />
                            <span>
                                <strong className="font-semibold text-[#263333]">
                                    {total}
                                </strong>{" "}
                                {total > 1 ? "entreprises" : "entreprise"}
                            </span>
                        </div>

                        <Link
                            href={route("admin.companies.create")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a94320] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/20"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une entreprise
                        </Link>
                    </div>
                </div>

                {/* ---------- FILTRES ---------- */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                    }}
                    className="rounded-2xl border border-[#dfe3e0] bg-white p-4 shadow-sm"
                >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un nom, un contact, un site web..."
                                className={`${fieldClass} pl-10`}
                            />
                        </div>

                        <select
                            value={sector}
                            onChange={(e) => {
                                setSector(e.target.value);
                                applyFilters({ sector: e.target.value });
                            }}
                            className={`${selectClass} lg:w-56 ${
                                sector
                                    ? "border-[#bf5429]/50 bg-[#bf5429]/[0.03]"
                                    : ""
                            }`}
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
                                !country
                                    ? "Choisir un pays d'abord"
                                    : "Toutes les villes"
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

                        <button
                            type="submit"
                            className="rounded-xl bg-[#1f2d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2c3d3d] focus:outline-none focus:ring-4 focus:ring-[#1f2d2d]/20"
                        >
                            Filtrer
                        </button>
                    </div>

                    {hasActiveFilters && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eef0ee] pt-3">
                            <span className="text-xs text-[#78807e]">
                                Filtres actifs :
                            </span>

                            {search && (
                                <FilterChip
                                    label={`« ${search} »`}
                                    onRemove={() => {
                                        setSearch("");
                                        applyFilters({ search: "" });
                                    }}
                                />
                            )}
                            {sector && (
                                <FilterChip
                                    label={sector}
                                    onRemove={() => {
                                        setSector("");
                                        applyFilters({ sector: "" });
                                    }}
                                />
                            )}
                            {country && (
                                <FilterChip
                                    label={country}
                                    onRemove={() => handleCountryChange("")}
                                />
                            )}
                            {city && (
                                <FilterChip
                                    label={city}
                                    onRemove={() => {
                                        setCity("");
                                        applyFilters({ city: "" });
                                    }}
                                />
                            )}

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#68706e] transition hover:text-[#bf5429]"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Tout réinitialiser
                            </button>
                        </div>
                    )}
                </form>

                {/* ---------- BANDEAU « TOUT SÉLECTIONNER » ---------- */}
                {allCurrentPageSelected && total > rows.length && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[#bf5429]/20 bg-[#bf5429]/5 px-4 py-3 text-sm text-[#263333]">
                        {selectAllCompanies ? (
                            <>
                                <span>
                                    Les <strong>{total}</strong> entreprises sont
                                    sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="font-semibold text-[#bf5429] underline underline-offset-2"
                                >
                                    Annuler la sélection
                                </button>
                            </>
                        ) : (
                            <>
                                <span>
                                    Les {rows.length} entreprises de cette page
                                    sont sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={selectEverything}
                                    className="font-semibold text-[#bf5429] underline underline-offset-2"
                                >
                                    Sélectionner les {total} entreprises
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ---------- TABLEAU ---------- */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f6f7f5] text-xs text-[#78807e]">
                                <tr>
                                    <th className="w-12 px-5 py-4">
                                        <Checkbox
                                            label="Sélectionner la page"
                                            checked={allCurrentPageSelected}
                                            indeterminate={
                                                somePageSelected &&
                                                !allCurrentPageSelected
                                            }
                                            onChange={(e) =>
                                                toggleCurrentPage(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Entreprise
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Secteur
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Contact
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Localisation
                                    </th>
                                    <th className="px-5 py-4">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#eef0ee]">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7f5] text-[#9aa19f]">
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-sm font-medium text-[#263333]">
                                                    Aucune entreprise trouvée
                                                </p>
                                                <p className="mt-1 text-sm text-[#78807e]">
                                                    {hasActiveFilters
                                                        ? "Modifiez ou réinitialisez les filtres pour élargir la recherche."
                                                        : "Ajoutez la première entreprise pour commencer."}
                                                </p>
                                                {hasActiveFilters && (
                                                    <button
                                                        type="button"
                                                        onClick={resetFilters}
                                                        className="mt-4 rounded-xl border border-[#d6d9d8] px-4 py-2.5 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                                                    >
                                                        Réinitialiser les filtres
                                                    </button>
                                                )}
                                            </div>
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

                                    const checked = isRowChecked(company.id);

                                    return (
                                        <tr
                                            key={company.id}
                                            className={`transition ${
                                                checked
                                                    ? "bg-[#bf5429]/[0.04]"
                                                    : "hover:bg-[#f9faf8]"
                                            }`}
                                        >
                                            <td className="px-5 py-4">
                                                <Checkbox
                                                    label={`Sélectionner ${company.name}`}
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        toggleCompany(
                                                            company.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#bf5429]/10 text-xs font-semibold text-[#bf5429]">
                                                        {initialsOf(company.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-[#263333]">
                                                            {company.name}
                                                        </div>
                                                        {company.website && (
                                                            <div className="truncate text-xs text-[#78807e]">
                                                                {company.website}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {company.sector ? (
                                                    <span className="inline-block rounded-full bg-[#f0f2f0] px-3 py-1 text-xs font-medium text-[#4d5856]">
                                                        {company.sector}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#9aa19f]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="text-[#263333]">
                                                    {contactFullName || "—"}
                                                    {company.contact_gender && (
                                                        <span className="ml-1.5 text-xs text-[#9aa19f]">
                                                            {GENDER_LABELS[
                                                                company
                                                                    .contact_gender
                                                            ] ||
                                                                company.contact_gender}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-0.5 text-xs text-[#78807e]">
                                                    {company.contact_email ||
                                                        company.contact_phone ||
                                                        "—"}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                {[company.city, company.country].filter(
                                                    Boolean
                                                ).length > 0 ? (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-[#9aa19f]" />
                                                        {[company.city, company.country]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "admin.companies.show",
                                                        company.id
                                                    )}
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#bf5429] transition hover:bg-[#bf5429]/10"
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

                {/* ---------- PAGINATION ---------- */}
                {links.length > 3 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`min-w-[40px] rounded-lg px-3.5 py-2 text-center text-sm transition ${
                                    link.active
                                        ? "bg-[#bf5429] font-semibold text-white"
                                        : link.url
                                        ? "border border-[#e4e7e5] bg-white text-[#263333] hover:border-[#bf5429]/40 hover:text-[#bf5429]"
                                        : "cursor-not-allowed text-[#c3c8c6]"
                                }`}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ---------- BARRE FLOTTANTE DE SÉLECTION ---------- */}
            {hasSelection && !showEmailModal && (
                <div className="selection-bar fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#1f2d2d] px-4 py-3 text-white shadow-2xl">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold">
                            {selectedCount}
                        </div>
                        <p className="truncate text-sm">
                            {selectAllCompanies
                                ? "Toutes les entreprises sélectionnées"
                                : selectedCount > 1
                                ? "entreprises sélectionnées"
                                : "entreprise sélectionnée"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSelectAllGlobal}
                        className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                    >
                        {selectAllCompanies ? (
                            <CheckSquare className="h-4 w-4" />
                        ) : (
                            <Square className="h-4 w-4" />
                        )}
                        {selectAllCompanies
                            ? "Tout désélectionner"
                            : `Tout sélectionner (${total})`}
                    </button>

                    <button
                        type="button"
                        onClick={clearSelection}
                        aria-label="Annuler la sélection"
                        className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={openEmailModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4622f] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/40"
                    >
                        <Mail className="h-4 w-4" />
                        Envoyer un email
                    </button>
                </div>
            )}

            {/* Bouton global quand rien n'est sélectionné */}
            {!hasSelection && total > 0 && (
                <button
                    type="button"
                    onClick={toggleSelectAllGlobal}
                    className="fixed bottom-6 right-6 z-30 hidden items-center gap-2 rounded-full border border-[#d6d9d8] bg-white px-4 py-2.5 text-sm font-semibold text-[#263333] shadow-lg transition hover:border-[#bf5429]/50 hover:text-[#bf5429] md:inline-flex"
                >
                    <Square className="h-4 w-4" />
                    Tout sélectionner ({total})
                </button>
            )}

            {/* ---------- MODALE EMAIL ---------- */}
            {showEmailModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d2d]/50 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeEmailModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="email-modal-title"
                        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* En-tête */}
                        <div className="flex items-start justify-between gap-4 border-b border-[#e4e7e5] px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#bf5429]/10 text-[#bf5429]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2
                                        id="email-modal-title"
                                        className="text-lg font-semibold text-[#1f2d2d]"
                                    >
                                        Envoyer un email
                                    </h2>
                                    <p className="mt-0.5 text-sm text-[#78807e]">
                                        {selectAllCompanies
                                            ? `À toutes les entreprises (${total})`
                                            : `À ${selectedCount} entreprise${
                                                  selectedCount > 1 ? "s" : ""
                                              }`}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={processing}
                                aria-label="Fermer"
                                className="rounded-xl p-2 text-[#78807e] transition hover:bg-[#f6f7f5] hover:text-[#263333] disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSendEmail}
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="space-y-5 overflow-y-auto px-6 py-6">
                                {/* Expéditeur + Objet */}
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#263333]">
                                            Expéditeur
                                        </label>
                                        <select
                                            value={data.sender}
                                            onChange={(e) =>
                                                setData("sender", e.target.value)
                                            }
                                            disabled={processing}
                                            className={fieldClass}
                                        >
                                            {senders.map((sender) => (
                                                <option
                                                    key={sender.key}
                                                    value={sender.key}
                                                >
                                                    {sender.name} ({sender.address})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.sender && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.sender}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#263333]">
                                            Objet
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData("subject", e.target.value)
                                            }
                                            disabled={processing}
                                            placeholder="Objet de l'email"
                                            className={fieldClass}
                                        />
                                        {errors.subject && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Message
                                    </label>
                                    <div className="quill-clean overflow-hidden rounded-xl border border-[#d6d9d8] transition focus-within:border-[#bf5429] focus-within:ring-4 focus-within:ring-[#bf5429]/10">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.message}
                                            onChange={(value) =>
                                                setData("message", value)
                                            }
                                            modules={quillModules}
                                            readOnly={processing}
                                            placeholder="Écrivez votre message..."
                                        />
                                    </div>
                                    {errors.message && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* Pièces jointes */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Pièces jointes
                                    </label>

                                    <label
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragging(true);
                                        }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={handleDrop}
                                        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
                                            dragging
                                                ? "border-[#bf5429] bg-[#bf5429]/5"
                                                : "border-[#d6d9d8] hover:border-[#bf5429]/60 hover:bg-[#bf5429]/[0.03]"
                                        }`}
                                    >
                                        <Paperclip className="h-5 w-5 text-[#bf5429]" />
                                        <span className="text-sm font-medium text-[#263333]">
                                            Glissez vos fichiers ici ou cliquez
                                            pour parcourir
                                        </span>
                                        <span className="text-xs text-[#78807e]">
                                            Images, PDF, Word, Excel, PowerPoint
                                            ou ZIP
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
                                        <>
                                            <ul className="mt-3 space-y-2">
                                                {data.attachments.map(
                                                    (file, index) => (
                                                        <li
                                                            key={`${file.name}-${index}`}
                                                            className="flex items-center gap-3 rounded-xl bg-[#f6f7f5] px-3 py-2.5 text-sm"
                                                        >
                                                            <FileText className="h-4 w-4 shrink-0 text-[#bf5429]" />
                                                            <span className="min-w-0 flex-1 truncate text-[#263333]">
                                                                {file.name}
                                                            </span>
                                                            <span className="shrink-0 text-xs text-[#78807e]">
                                                                {formatSize(file.size)}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFile(index)
                                                                }
                                                                disabled={processing}
                                                                aria-label={`Retirer ${file.name}`}
                                                                className="rounded-lg p-1.5 text-[#9aa19f] transition hover:bg-white hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <p className="mt-2 text-xs text-[#78807e]">
                                                {data.attachments.length} fichier(s) ·{" "}
                                                {formatSize(totalAttachmentsSize)} au
                                                total
                                            </p>
                                        </>
                                    )}

                                    {errors.attachments && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.attachments}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Pied de la modale */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#e4e7e5] bg-[#f9faf8] px-6 py-4">
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
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a94320] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/20 disabled:cursor-not-allowed disabled:opacity-60"
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