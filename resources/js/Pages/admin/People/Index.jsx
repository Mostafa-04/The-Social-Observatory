import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "@/Pages/admin/AdminLayout";
import {
    Building2,
    Check,
    CheckSquare,
    ChevronDown,
    FileText,
    Globe,
    History,
    Mail,
    Paperclip,
    Phone,
    RotateCcw,
    Search,
    Send,
    Square,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

/* ==========================================================================
   SweetAlert2 : thème unifié
   ========================================================================== */

const BRAND_COLOR = "#bf5429";

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

const toastWarning = (text) => Toast.fire({ icon: "warning", title: text });

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

const alertError = (text, title = "Échec de l'envoi") =>
    AppSwal.fire({
        icon: "error",
        iconColor: "#d64545",
        title,
        text,
        confirmButtonText: "Fermer",
    });

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

const initialsOf = (first, last) =>
    [first, last]
        .filter(Boolean)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?";

const formatSize = (bytes) =>
    bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
        : `${(bytes / 1024 / 1024).toFixed(2)} Mo`;

const SOURCE_OPTIONS = [
    { value: "", label: "Toutes les inscriptions" },
    { value: "group", label: "Groupe de travail" },
    { value: "contact", label: "Contact Observatoire" },
    { value: "iaps", label: "Soumission IAPS" },
    { value: "event", label: "Événement" },
];

// Les filtres envoient H / F ; on accepte aussi M / O par sécurité
const GENDER_META = {
    H: { label: "Masculin", cls: "bg-blue-50 text-blue-700" },
    M: { label: "Masculin", cls: "bg-blue-50 text-blue-700" },
    F: { label: "Féminin", cls: "bg-pink-50 text-pink-700" },
    O: { label: "Autre", cls: "bg-purple-50 text-purple-700" },
};

const fieldClass =
    "w-full rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition placeholder:text-[#9aa19f] focus:border-[#bf5429] focus:ring-4 focus:ring-[#bf5429]/10 disabled:cursor-not-allowed disabled:opacity-60";

const activeFieldClass = "border-[#bf5429]/50 bg-[#bf5429]/[0.03]";

/* ==========================================================================
   Composants
   ========================================================================== */

function SearchableSelect({
    placeholder = "Sélectionner...",
    searchPlaceholder = "Rechercher...",
    loadingLabel = "Chargement...",
    loading = false,
    options = [],
    value,
    onChange,
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    const selectedLabel =
        options.find((o) => o.value === value)?.label ?? "";

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
                    if (!loading) setOpen((p) => !p);
                }}
                disabled={loading}
                aria-expanded={open}
                className={`${fieldClass} flex items-center justify-between text-left ${
                    value ? activeFieldClass : ""
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
                            placeholder={searchPlaceholder}
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

export default function PeopleIndex({
    people,
    filters,
    groups = {},
    senders = [],
}) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [country, setCountry] = useState(filters?.country ?? "");
    const [gender, setGender] = useState(filters?.gender ?? "");
    const [source, setSource] = useState(filters?.source ?? "");
    const [groupType, setGroupType] = useState(filters?.group_type ?? "");
    const [emailSender, setEmailSender] = useState(
        senders[0]?.key ?? "contact"
    );

    // Sélection :
    // - selectAll = false -> seuls les ids de selectedPeople sont concernés
    // - selectAll = true  -> tous les résultats du filtre, sauf excludedPeople
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [excludedPeople, setExcludedPeople] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailFiles, setEmailFiles] = useState([]);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [dragging, setDragging] = useState(false);

    const rows = people?.data ?? [];
    const links = people?.links ?? [];
    const total = people?.total ?? rows.length;

    /* ---------- Pays ---------- */

    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

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

    const countryOptions = countries.map((c) => ({
        value: c.name,
        label: c.code ? `${c.name} (${c.code})` : c.name,
    }));

    const groupOptions = Object.entries(groups).map(([value, label]) => ({
        value,
        label,
    }));

    /* ---------- Valeurs calculées ---------- */

    const isRowChecked = (id) =>
        selectAll ? !excludedPeople.includes(id) : selectedPeople.includes(id);

    const allPageSelected =
        rows.length > 0 && rows.every((p) => isRowChecked(p.id));
    const somePageSelected = rows.some((p) => isRowChecked(p.id));

    const selectedCount = selectAll
        ? total - excludedPeople.length
        : selectedPeople.length;

    const hasSelection = selectedCount > 0;

    const hasActiveFilters = Boolean(
        search || country || gender || source || groupType
    );

    const sourceLabel = SOURCE_OPTIONS.find((o) => o.value === source)?.label;
    const groupLabel = groups[groupType];

    /* ---------- Sélection ---------- */

    const clearSelection = () => {
        setSelectAll(false);
        setSelectedPeople([]);
        setExcludedPeople([]);
    };

    const selectEverything = () => {
        setSelectAll(true);
        setSelectedPeople([]);
        setExcludedPeople([]);
    };

    const toggleSelectAllGlobal = () => {
        if (selectAll) clearSelection();
        else selectEverything();
    };

    const togglePage = (checked) => {
        const ids = rows.map((p) => p.id);

        if (selectAll) {
            setExcludedPeople((cur) =>
                checked
                    ? cur.filter((id) => !ids.includes(id))
                    : [...new Set([...cur, ...ids])]
            );
            return;
        }

        setSelectedPeople((cur) =>
            checked
                ? [...new Set([...cur, ...ids])]
                : cur.filter((id) => !ids.includes(id))
        );
    };

    const toggleRow = (id, checked) => {
        if (selectAll) {
            setExcludedPeople((cur) =>
                checked ? cur.filter((x) => x !== id) : [...cur, id]
            );
        } else {
            setSelectedPeople((cur) =>
                checked ? [...cur, id] : cur.filter((x) => x !== id)
            );
        }
    };

    /* ---------- Filtres ---------- */

    const applyFilters = (overrides = {}) => {
        clearSelection();

        const nextSource = overrides.source ?? source;

        router.get(
            route("people.index"),
            {
                search: overrides.search ?? search,
                country: overrides.country ?? country,
                gender: overrides.gender ?? gender,
                source: nextSource || undefined,
                group_type:
                    nextSource === "group"
                        ? overrides.group_type ?? groupType
                        : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setCountry("");
        setGender("");
        setSource("");
        setGroupType("");
        clearSelection();

        router.get(
            route("people.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const handleSourceChange = (value) => {
        setSource(value);
        if (value !== "group") setGroupType("");

        applyFilters({
            source: value,
            group_type: value === "group" ? groupType : "",
        });
    };

    /* ---------- Email ---------- */

    const openEmailModal = () => {
        if (!hasSelection) {
            toastWarning("Sélectionnez au moins une personne.");
            return;
        }
        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (sendingEmail) return;
        setShowEmailModal(false);
    };

    const addFiles = (fileList) => {
        const incoming = Array.from(fileList || []);
        if (incoming.length === 0) return;

        setEmailFiles((current) => {
            const merged = [...current];
            incoming.forEach((file) => {
                const duplicate = merged.some(
                    (f) => f.name === file.name && f.size === file.size
                );
                if (!duplicate) merged.push(file);
            });
            return merged;
        });
    };

    const handleFiles = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    const removeFile = (index) =>
        setEmailFiles((cur) => cur.filter((_, i) => i !== index));

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const totalFilesSize = emailFiles.reduce((sum, f) => sum + f.size, 0);

    const sendEmail = async () => {
        if (!hasSelection) {
            toastWarning("Sélectionnez au moins une personne.");
            return;
        }
        if (!emailSubject.trim()) {
            toastWarning("Veuillez saisir l'objet du message.");
            return;
        }
        if (!stripHtml(emailMessage)) {
            toastWarning("Veuillez saisir le message.");
            return;
        }

        const senderInfo = senders.find((s) => s.key === emailSender);

        const { isConfirmed } = await confirmSend({
            recipients: `${selectedCount} personne(s)`,
            senderLabel: escapeHtml(
                senderInfo ? senderInfo.address : emailSender
            ),
            subject: escapeHtml(emailSubject.trim()),
            attachments: emailFiles.length
                ? `${emailFiles.length} fichier(s)`
                : "Aucune",
        });

        if (!isConfirmed) return;

        const formData = new FormData();

        formData.append("subject", emailSubject);
        formData.append("sender", emailSender);
        formData.append("message", emailMessage);
        formData.append("select_all", selectAll ? "1" : "0");

        if (selectAll) {
            if (search) formData.append("search", search);
            if (country) formData.append("country", country);
            if (gender) formData.append("gender", gender);
            if (source) formData.append("source", source);
            if (source === "group" && groupType) {
                formData.append("group_type", groupType);
            }
            excludedPeople.forEach((id) =>
                formData.append("excluded_people[]", id)
            );
        } else {
            selectedPeople.forEach((id) => formData.append("people[]", id));
        }

        emailFiles.forEach((file) => formData.append("files[]", file));

        setSendingEmail(true);
        showSending();

        try {
            const { data } = await axios.post(
                route("people.send-email"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setShowEmailModal(false);
            setEmailSubject("");
            setEmailMessage("");
            setEmailFiles([]);
            clearSelection();

            alertSuccess(data?.message || "Votre email a été envoyé avec succès.");
        } catch (error) {
            console.error(error);

            const errors = error?.response?.data?.errors;
            const firstError = errors ? Object.values(errors)[0]?.[0] : null;

            alertError(
                firstError ||
                    error?.response?.data?.message ||
                    "L'email n'a pas pu être envoyé. Vérifiez les champs et réessayez."
            );
        } finally {
            setSendingEmail(false);
        }
    };

    /* ---------- Quill ---------- */

    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    /* ======================================================================
       Rendu
       ====================================================================== */

    return (
        <AdminLayout>
            <Head title="Personnes" />

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

            <div className="mx-auto max-w-7xl px-4 py-8 pb-28 md:px-8 md:py-12">
                {/* ---------- EN-TÊTE ---------- */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#bf5429]/10 text-[#bf5429]">
                                <Users className="h-5 w-5" />
                            </span>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1f2d2d] md:text-3xl">
                                Personnes
                            </h1>
                        </div>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#68706e]">
                            <strong className="font-semibold text-[#263333]">
                                {total}
                            </strong>{" "}
                            personne(s) enregistrée(s) dans l'Observatoire.
                        </p>
                    </div>

                    <Link
                        href={route("people.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a94320] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/20"
                    >
                        <UserPlus className="h-4 w-4" />
                        Ajouter une personne
                    </Link>
                </div>

                {/* ---------- FILTRES ---------- */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                    }}
                    className="rounded-2xl border border-[#dfe3e0] bg-white p-4 shadow-sm"
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom, email, téléphone, organisation..."
                                className={`${fieldClass} pl-10`}
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#1f2d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2c3d3d] focus:outline-none focus:ring-4 focus:ring-[#1f2d2d]/20"
                        >
                            Rechercher
                        </button>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <SearchableSelect
                            placeholder="Tous les pays"
                            searchPlaceholder="Rechercher un pays..."
                            loadingLabel="Chargement des pays..."
                            loading={loadingCountries}
                            options={countryOptions}
                            value={country}
                            onChange={(value) => {
                                setCountry(value);
                                applyFilters({ country: value });
                            }}
                            className="md:w-56"
                        />

                        <select
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                applyFilters({ gender: e.target.value });
                            }}
                            className={`${fieldClass} md:w-44 ${
                                gender ? activeFieldClass : ""
                            }`}
                        >
                            <option value="">Tous les genres</option>
                            <option value="H">Hommes</option>
                            <option value="F">Femmes</option>
                        </select>

                        <select
                            value={source}
                            onChange={(e) => handleSourceChange(e.target.value)}
                            className={`${fieldClass} md:w-60 ${
                                source ? activeFieldClass : ""
                            }`}
                        >
                            {SOURCE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {source === "group" && (
                            <select
                                value={groupType}
                                onChange={(e) => {
                                    setGroupType(e.target.value);
                                    applyFilters({ group_type: e.target.value });
                                }}
                                className={`${fieldClass} md:w-72 ${
                                    groupType ? activeFieldClass : ""
                                }`}
                            >
                                <option value="">
                                    Tous les groupes de travail
                                </option>
                                {groupOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
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
                            {country && (
                                <FilterChip
                                    label={country}
                                    onRemove={() => {
                                        setCountry("");
                                        applyFilters({ country: "" });
                                    }}
                                />
                            )}
                            {gender && (
                                <FilterChip
                                    label={GENDER_META[gender]?.label ?? gender}
                                    onRemove={() => {
                                        setGender("");
                                        applyFilters({ gender: "" });
                                    }}
                                />
                            )}
                            {source && (
                                <FilterChip
                                    label={sourceLabel}
                                    onRemove={() => handleSourceChange("")}
                                />
                            )}
                            {groupType && source === "group" && (
                                <FilterChip
                                    label={groupLabel ?? groupType}
                                    onRemove={() => {
                                        setGroupType("");
                                        applyFilters({ group_type: "" });
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
                {allPageSelected && total > rows.length && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[#bf5429]/20 bg-[#bf5429]/5 px-4 py-3 text-sm text-[#263333]">
                        {selectAll ? (
                            <>
                                <span>
                                    Les <strong>{selectedCount}</strong>{" "}
                                    personne(s) sont sélectionnées.
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
                                    Les <strong>{rows.length}</strong> personnes
                                    de cette page sont sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={selectEverything}
                                    className="font-semibold text-[#bf5429] underline underline-offset-2"
                                >
                                    Sélectionner les {total} personnes
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
                                            checked={allPageSelected}
                                            indeterminate={
                                                somePageSelected &&
                                                !allPageSelected
                                            }
                                            onChange={(e) =>
                                                togglePage(e.target.checked)
                                            }
                                        />
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Personne
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Fonction
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Organisation
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Pays
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Genre
                                    </th>
                                    <th className="px-5 py-4">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#eef0ee]">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7f5] text-[#9aa19f]">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-sm font-medium text-[#263333]">
                                                    Aucune personne trouvée
                                                </p>
                                                <p className="mt-1 text-sm text-[#78807e]">
                                                    {hasActiveFilters
                                                        ? "Modifiez ou réinitialisez les filtres pour élargir la recherche."
                                                        : "Ajoutez la première personne pour commencer."}
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

                                {rows.map((person) => {
                                    const checked = isRowChecked(person.id);
                                    const genderMeta = GENDER_META[person.gender];

                                    return (
                                        <tr
                                            key={person.id}
                                            className={`transition ${
                                                checked
                                                    ? "bg-[#bf5429]/[0.04]"
                                                    : "hover:bg-[#f9faf8]"
                                            }`}
                                        >
                                            <td className="px-5 py-4">
                                                <Checkbox
                                                    label={`Sélectionner ${person.first_name} ${person.last_name}`}
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        toggleRow(
                                                            person.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#bf5429]/10 text-xs font-semibold text-[#bf5429]">
                                                        {initialsOf(
                                                            person.first_name,
                                                            person.last_name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="font-medium text-[#263333]">
                                                            {person.first_name}{" "}
                                                            {person.last_name}
                                                        </div>

                                                        <a
                                                            href={`mailto:${person.email}`}
                                                            className="mt-0.5 flex items-center gap-1.5 break-all text-xs text-[#78807e] hover:text-[#bf5429]"
                                                        >
                                                            <Mail className="h-3.5 w-3.5 shrink-0" />
                                                            {person.email || "—"}
                                                        </a>

                                                        {person.phone && (
                                                            <a
                                                                href={`tel:${person.phone}`}
                                                                className="mt-0.5 flex items-center gap-1.5 break-all text-xs text-[#78807e] hover:text-[#bf5429]"
                                                            >
                                                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                                                {person.phone}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {person.role ? (
                                                    <span className="inline-block rounded-full bg-[#bf5429]/10 px-3 py-1 text-xs font-medium text-[#a94320]">
                                                        {person.role}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#c3c8c6]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {person.organisation ? (
                                                    <div className="flex items-center gap-1.5 text-[#68706e]">
                                                        <Building2 className="h-4 w-4 shrink-0 text-[#9aa19f]" />
                                                        {person.organisation}
                                                    </div>
                                                ) : (
                                                    <span className="text-[#c3c8c6]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {person.country ? (
                                                    <div className="flex items-center gap-1.5 text-[#68706e]">
                                                        <Globe className="h-4 w-4 shrink-0 text-[#9aa19f]" />
                                                        {person.country}
                                                    </div>
                                                ) : (
                                                    <span className="text-[#c3c8c6]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {person.gender ? (
                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                            genderMeta?.cls ??
                                                            "bg-gray-50 text-gray-700"
                                                        }`}
                                                    >
                                                        {genderMeta?.label ??
                                                            person.gender}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#c3c8c6]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route("people.history", {
                                                        person: person.id,
                                                    })}
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#bf5429] transition hover:bg-[#bf5429]/10"
                                                >
                                                    <History className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Historique
                                                    </span>
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
                        <div className="flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-xl bg-white/10 px-2 text-sm font-semibold">
                            {selectedCount}
                        </div>
                        <p className="truncate text-sm">
                            {selectedCount > 1
                                ? "personnes sélectionnées"
                                : "personne sélectionnée"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSelectAllGlobal}
                        className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                    >
                        {selectAll ? (
                            <CheckSquare className="h-4 w-4" />
                        ) : (
                            <Square className="h-4 w-4" />
                        )}
                        {selectAll
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
                                        À {selectedCount} personne
                                        {selectedCount > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                aria-label="Fermer"
                                className="rounded-xl p-2 text-[#78807e] transition hover:bg-[#f6f7f5] hover:text-[#263333] disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5 overflow-y-auto px-6 py-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Expéditeur
                                    </label>
                                    <select
                                        value={emailSender}
                                        onChange={(e) =>
                                            setEmailSender(e.target.value)
                                        }
                                        disabled={sendingEmail}
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
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#263333]">
                                        Objet
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) =>
                                            setEmailSubject(e.target.value)
                                        }
                                        disabled={sendingEmail}
                                        placeholder="Objet de l'email"
                                        className={fieldClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Message
                                </label>
                                <div className="quill-clean overflow-hidden rounded-xl border border-[#d6d9d8] transition focus-within:border-[#bf5429] focus-within:ring-4 focus-within:ring-[#bf5429]/10">
                                    <ReactQuill
                                        theme="snow"
                                        value={emailMessage}
                                        onChange={setEmailMessage}
                                        readOnly={sendingEmail}
                                        placeholder="Écrivez votre message..."
                                        modules={quillModules}
                                    />
                                </div>
                            </div>

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
                                        Glissez vos fichiers ici ou cliquez pour
                                        parcourir
                                    </span>
                                    <span className="text-xs text-[#78807e]">
                                        Images, PDF, Word, Excel, PowerPoint ou
                                        ZIP
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                                        onChange={handleFiles}
                                        className="hidden"
                                    />
                                </label>

                                {emailFiles.length > 0 && (
                                    <>
                                        <ul className="mt-3 space-y-2">
                                            {emailFiles.map((file, index) => (
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
                                                        disabled={sendingEmail}
                                                        aria-label={`Retirer ${file.name}`}
                                                        className="rounded-lg p-1.5 text-[#9aa19f] transition hover:bg-white hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-2 text-xs text-[#78807e]">
                                            {emailFiles.length} fichier(s) ·{" "}
                                            {formatSize(totalFilesSize)} au total
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-[#e4e7e5] bg-[#f9faf8] px-6 py-4">
                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={sendEmail}
                                disabled={sendingEmail}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a94320] focus:outline-none focus:ring-4 focus:ring-[#bf5429]/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {sendingEmail ? (
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
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}