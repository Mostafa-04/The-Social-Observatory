import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import Swal from "sweetalert2";
import {
    Plus,
    Search,
    Upload,
    Mail,
    Phone,
    X,
    Users,
    Loader2,
    XCircle,
    Paperclip,
    FileText,
    Trash2,
    CheckSquare,
    Square,
    UserPlus,
    ChevronDown,
    Check,
    RotateCcw,
    Globe,
    Building2,
} from "lucide-react";

import "react-quill/dist/quill.snow.css";

/* ReactQuill est lourd : chargé uniquement quand le modal email s'ouvre */
const ReactQuill = lazy(() => import("react-quill"));

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "blockquote"],
        ["clean"],
    ],
};

/*
 * RÈGLE À NE JAMAIS OUBLIER : chaque bouton présent dans le toolbar
 * ci-dessus doit avoir son nom de format listé ici. Sinon Quill
 * applique le style au clic puis le retire aussitôt.
 */
const QUILL_FORMATS = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "blockquote",
];

/* =========================================================
   Design tokens
========================================================= */

const STATUS_META = {
    approved: {
        label: "Approuvé",
        badge: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
        dot: "bg-[#2F6B4F]",
    },
    pending: {
        label: "En attente",
        badge: "bg-[#BF5429]/10 text-[#a8451f]",
        dot: "bg-[#BF5429]",
    },
    rejected: {
        label: "Rejeté",
        badge: "bg-[#B3261E]/10 text-[#B3261E]",
        dot: "bg-[#B3261E]",
    },
};

const STATUS_OPTIONS = [
    { value: "pending", label: "En attente" },
    { value: "approved", label: "Approuvé" },
    { value: "rejected", label: "Rejeté" },
];

const STATUS_TABS = [{ value: "all", label: "Tous" }, ...STATUS_OPTIONS];

const GENDER_OPTIONS = [
    { value: "H", label: "Homme" },
    { value: "F", label: "Femme" },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

const INITIAL_FORM = {
    name: "",
    organisation: "",
    role: "",
    gender: "",
    email: "",
    phone: "",
    linkedin: "",
    country: "",
    status: "pending",
};

const INPUT_BASE =
    "w-full rounded-xl border border-[#D6D9D8] bg-white px-3.5 py-2.5 text-[13.5px] text-[#1f2d2d] outline-none transition placeholder:text-[#8A9290] focus:border-[#BF5429] focus:ring-4 focus:ring-[#BF5429]/10 disabled:cursor-not-allowed disabled:opacity-60";

const INPUT_INVALID =
    "!border-[#B3261E] focus:!border-[#B3261E] focus:!ring-[#B3261E]/10";

/* =========================================================
   SweetAlert2 : thème unifié
========================================================= */

const BASE_CLASSES = {
    popup: "!rounded-3xl !p-8 !shadow-2xl !font-sans",
    title: "!text-xl !font-semibold !text-[#1f2d2d] !p-0 !mt-2",
    htmlContainer: "!text-[13.5px] !text-[#5B6462] !m-0 !mt-2 !p-0",
    actions: "!mt-6 !gap-3",
    confirmButton:
        "rounded-xl bg-[#BF5429] px-6 py-3 text-[13.5px] font-semibold text-white transition hover:bg-[#a8451f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/20",
    cancelButton:
        "rounded-xl border border-[#D6D9D8] bg-white px-6 py-3 text-[13.5px] font-semibold text-[#1f2d2d] transition hover:bg-[#F7F8F7] focus:outline-none focus:ring-4 focus:ring-[#D6D9D8]/50",
    timerProgressBar: "!bg-[#BF5429]",
};

const DANGER_CLASSES = {
    ...BASE_CLASSES,
    confirmButton:
        "rounded-xl bg-[#B3261E] px-6 py-3 text-[13.5px] font-semibold text-white transition hover:bg-[#961f19] focus:outline-none focus:ring-4 focus:ring-[#B3261E]/20",
};

const AppSwal = Swal.mixin({
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: false,
    customClass: BASE_CLASSES,
});

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    buttonsStyling: false,
    customClass: {
        popup: "!rounded-2xl !p-4 !shadow-xl !font-sans",
        title: "!text-[13.5px] !font-medium !text-[#1f2d2d]",
        timerProgressBar: "!bg-[#BF5429]",
    },
    didOpen: (el) => {
        el.addEventListener("mouseenter", Swal.stopTimer);
        el.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const toastSuccess = (title) => Toast.fire({ icon: "success", title });
const toastError = (title) => Toast.fire({ icon: "error", title });
const toastWarning = (title) => Toast.fire({ icon: "warning", title });

const alertError = (text, title = "Une erreur est survenue") =>
    AppSwal.fire({
        icon: "error",
        iconColor: "#B3261E",
        title,
        html: text,
        confirmButtonText: "Fermer",
    });

const showLoading = (title, text) =>
    AppSwal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });

const closeIfLoading = () => {
    if (Swal.isVisible() && Swal.isLoading()) Swal.close();
};

/* =========================================================
   Helpers
========================================================= */

const normalize = (value) =>
    String(value ?? "")
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const isEmptyHtml = (html) =>
    !String(html ?? "")
        .replace(/<(.|\n)*?>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

const escapeHtml = (value) =>
    String(value ?? "").replace(
        /[&<>"']/g,
        (c) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const initialsOf = (name) =>
    String(name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?";

const formatDate = (date) => {
    if (!date) return null;
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
        ? null
        : parsed.toLocaleDateString("fr-FR");
};

/* =========================================================
   Hook : chargement des pays via route("api.countries")
========================================================= */

function useCountries(enabled) {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!enabled || loadedRef.current) return;

        const controller = new AbortController();

        const loadCountries = async () => {
            setLoading(true);
            setFailed(false);

            try {
                const response = await fetch(route("api.countries"), {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des pays.");
                }

                const result = await response.json();

                const list = (result.countries || [])
                    .map((country) => {
                        const name =
                            typeof country === "string"
                                ? country
                                : country.name ??
                                  country.label ??
                                  country.nom ??
                                  country.name_fr;

                        return name ? { value: name, label: name } : null;
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.label.localeCompare(b.label, "fr"));

                setCountries(list);
                loadedRef.current = true;
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setCountries([]);
                    setFailed(true);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadCountries();

        return () => controller.abort();
    }, [enabled, attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    return { countries, loading, failed, retry };
}

/* =========================================================
   Modal : en-tête fixe, corps scrollable, pied fixe
========================================================= */

function Modal({
    title,
    subtitle,
    icon: Icon,
    onClose,
    locked = false,
    maxWidth = "max-w-xl",
    children,
}) {
    const onCloseRef = useRef(onClose);
    const lockedRef = useRef(locked);

    onCloseRef.current = onClose;
    lockedRef.current = locked;

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !lockedRef.current) {
                onCloseRef.current();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d2d]/50 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !locked) onClose();
            }}
        >
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(8px) scale(.98); }
                    to { opacity: 1; transform: none; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .modal-panel { animation: none !important; }
                }
            `}</style>

            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                style={{ animation: "modalIn .18s ease-out" }}
                className={`modal-panel flex max-h-[92dvh] w-full ${maxWidth} flex-col overflow-hidden rounded-3xl bg-white shadow-2xl`}
            >
                <div className="flex shrink-0 items-start gap-4 border-b border-[#E4E7E5] px-6 py-5">
                    {Icon && (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#BF5429]/10 text-[#BF5429]">
                            <Icon size={20} strokeWidth={2} />
                        </span>
                    )}

                    <div className="min-w-0 flex-1">
                        <h2 className="font-display text-lg leading-tight text-[#1f2d2d]">
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="mt-1 text-[13px] text-[#5B6462]">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={locked}
                        aria-label="Fermer"
                        className="rounded-xl p-2 text-[#8A9290] transition hover:bg-[#F7F8F7] hover:text-[#1f2d2d] disabled:opacity-40"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

const MODAL_FORM = "flex min-h-0 flex-1 flex-col";
const MODAL_BODY = "min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6";
const MODAL_FOOTER =
    "flex shrink-0 items-center justify-end gap-3 border-t border-[#E4E7E5] bg-[#F9FAF8] px-6 py-4";

/* =========================================================
   Composants de formulaire
========================================================= */

function Field({ label, required, error, hint, className = "", children }) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                {label}
                {required && <span className="text-[#BF5429]"> *</span>}
            </label>

            {children}

            {error ? (
                <p className="mt-1.5 text-[12px] text-[#B3261E]">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-[12px] text-[#8A9290]">{hint}</p>
            ) : null}
        </div>
    );
}

function FormSection({ title, children }) {
    return (
        <section className="space-y-4">
            <h3 className="border-b border-[#E4E7E5] pb-2 text-[13px] font-semibold text-[#1f2d2d]">
                {title}
            </h3>

            {children}
        </section>
    );
}

function Segmented({ label, value, onChange, options }) {
    return (
        <div
            role="radiogroup"
            aria-label={label}
            className="flex gap-1 rounded-xl border border-[#D6D9D8] bg-[#F7F8F7] p-1"
        >
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.value)}
                        className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF5429]/40 ${
                            selected
                                ? "bg-white text-[#BF5429] shadow-sm ring-1 ring-[#BF5429]/30"
                                : "text-[#5B6462] hover:text-[#1f2d2d]"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

function RowCheckbox({ checked, onChange, label }) {
    return (
        <input
            type="checkbox"
            aria-label={label}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 cursor-pointer rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30"
        />
    );
}

/* =========================================================
   Select pays avec recherche (clavier : ↑ ↓ Entrée Échap)
========================================================= */

function CountrySelect({
    value,
    onChange,
    options,
    loading,
    failed,
    onRetry,
    invalid,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const searchRef = useRef(null);
    const listRef = useRef(null);

    const filtered = useMemo(() => {
        const q = normalize(query);

        return q
            ? options.filter((country) => normalize(country.label).includes(q))
            : options;
    }, [options, query]);

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
    }, []);

    const select = (countryValue) => {
        onChange(countryValue);
        close();
        triggerRef.current?.focus();
    };

    useEffect(() => {
        if (!open) return;

        const handleMouseDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleMouseDown);

        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, close]);

    useEffect(() => {
        if (!open) return;

        searchRef.current?.focus();

        const selectedIndex = options.findIndex((c) => c.value === value);

        setActive(selectedIndex >= 0 ? selectedIndex : 0);

        const frame = requestAnimationFrame(() => {
            panelRef.current?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        });

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!open) return;

        listRef.current
            ?.querySelector('[data-active="true"]')
            ?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    const handleSearchKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((index) => Math.min(index + 1, filtered.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (filtered[active]) select(filtered[active].value);
        } else if (event.key === "Escape") {
            event.stopPropagation();
            close();
            triggerRef.current?.focus();
        }
    };

    if (failed) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#B3261E]/30 bg-[#B3261E]/5 px-3.5 py-2.5 text-[13px] text-[#B3261E]">
                <span>Impossible de charger les pays.</span>

                <button
                    type="button"
                    onClick={onRetry}
                    className="font-medium underline hover:no-underline"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                disabled={loading}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => (open ? close() : setOpen(true))}
                className={`flex w-full items-center gap-2 rounded-xl border bg-white py-2.5 pl-3.5 text-left text-[13.5px] outline-none transition focus:border-[#BF5429] focus:ring-4 focus:ring-[#BF5429]/10 disabled:cursor-wait disabled:bg-[#F7F8F7] ${
                    value ? "pr-16" : "pr-9"
                } ${
                    invalid
                        ? "border-[#B3261E]"
                        : open
                        ? "border-[#BF5429]"
                        : "border-[#D6D9D8] hover:border-[#BF5429]/50"
                }`}
            >
                <span
                    className={`flex-1 truncate ${
                        value ? "text-[#1f2d2d]" : "text-[#8A9290]"
                    }`}
                >
                    {loading
                        ? "Chargement des pays..."
                        : value || "Sélectionnez un pays"}
                </span>
            </button>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9290]">
                {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                ) : (
                    <ChevronDown
                        size={15}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                )}
            </span>

            {value && !loading && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Effacer le pays"
                    className="absolute right-9 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#8A9290] transition hover:text-[#1f2d2d]"
                >
                    <XCircle size={15} strokeWidth={2} />
                </button>
            )}

            {open && (
                <div
                    ref={panelRef}
                    className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-2xl border border-[#E4E7E5] bg-white shadow-xl"
                >
                    <div className="relative border-b border-[#E4E7E5] p-2">
                        <Search
                            size={14}
                            strokeWidth={2}
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                        />

                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActive(0);
                            }}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Rechercher un pays..."
                            className={`${INPUT_BASE} py-2 pl-8`}
                        />
                    </div>

                    <ul
                        ref={listRef}
                        role="listbox"
                        className="max-h-56 overflow-y-auto py-1"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-[13px] text-[#8A9290]">
                                Aucun pays ne correspond à « {query} ».
                            </li>
                        ) : (
                            filtered.map((country, index) => {
                                const selected = country.value === value;
                                const isActive = index === active;

                                return (
                                    <li
                                        key={`${country.value}-${index}`}
                                        role="option"
                                        aria-selected={selected}
                                        data-active={isActive}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                select(country.value)
                                            }
                                            onMouseEnter={() =>
                                                setActive(index)
                                            }
                                            className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[13.5px] transition-colors ${
                                                isActive ? "bg-[#BF5429]/5" : ""
                                            } ${
                                                selected
                                                    ? "font-semibold text-[#BF5429]"
                                                    : "text-[#1f2d2d]"
                                            }`}
                                        >
                                            <span className="truncate">
                                                {country.label}
                                            </span>

                                            {selected && (
                                                <Check
                                                    size={15}
                                                    strokeWidth={2.2}
                                                    className="shrink-0"
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   Page
========================================================= */

export default function Index({ contacts, flash, filters, senders = [] }) {
    /* ---------- State ---------- */

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [fetchingAllIds, setFetchingAllIds] = useState(false);

    const [search, setSearch] = useState(filters?.search ?? "");
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? "all");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const [importing, setImporting] = useState(false);
    const [adding, setAdding] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [dragging, setDragging] = useState(false);

    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
    const [attachments, setAttachments] = useState([]);
    const [emailSender, setEmailSender] = useState(
        senders[0]?.key ?? "contact"
    );

    const importInputRef = useRef(null);
    const debounceRef = useRef(null);

    const {
        countries,
        loading: loadingCountries,
        failed: countriesFailed,
        retry: retryCountries,
    } = useCountries(showAddModal);

    /* ---------- Données dérivées ---------- */

    const contactData = contacts?.data || [];

    const totalContactsCount =
        contacts?.meta?.total ?? contacts?.total ?? contactData.length;

    /* ---------- Recherche serveur avec debounce (350ms) ---------- */

    const runSearch = useCallback((nextSearch, nextStatus) => {
        router.get(
            route("admin.observatory-contacts.index"),
            {
                search: nextSearch || undefined,
                status: nextStatus === "all" ? undefined : nextStatus,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, []);

    useEffect(() => {
        if (
            search === (filters?.search ?? "") &&
            statusFilter === (filters?.status ?? "all")
        ) {
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            runSearch(search, statusFilter);
        }, 350);

        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    /* ---------- Flash messages → SweetAlert2 ---------- */

    useEffect(() => {
        if (flash?.success) toastSuccess(flash.success);

        if (flash?.error) alertError(escapeHtml(flash.error));

        if (flash?.import_errors?.length > 0) {
            const rows = flash.import_errors
                .map(
                    (error) => `
                        <div class="mb-2 rounded-xl border border-[#F0D5CC] bg-[#FDF6F3] px-3.5 py-3 text-left">
                            <div class="text-xs text-[#8A9290]">Ligne ${escapeHtml(error.row)} — ${escapeHtml(error.attribute)}</div>
                            <div class="mt-1 text-[13px] text-[#B3261E]">
                                ${(error.errors || []).map(escapeHtml).join("<br/>")}
                            </div>
                        </div>`
                )
                .join("");

            AppSwal.fire({
                icon: "warning",
                iconColor: "#BF5429",
                title: "Erreurs dans le fichier Excel",
                html: `
                    <p class="mb-3">${flash.import_errors.length} ligne(s) n'ont pas pu être importées. Corrigez-les puis relancez l'import.</p>
                    <div style="max-height:320px;overflow:auto;">${rows}</div>`,
                width: 620,
                confirmButtonText: "J'ai compris",
            });
        }
    }, [flash]);

    /* ---------- Filtrage côté client (page courante) ---------- */

    const filteredContacts = useMemo(() => {
        const searchValue = normalize(search);

        return contactData.filter((contact) => {
            const matchesSearch =
                !searchValue ||
                [
                    contact.name,
                    contact.organisation,
                    contact.role,
                    contact.gender,
                    contact.email,
                    contact.phone,
                    contact.country,
                ].some((field) => normalize(field).includes(searchValue));

            const matchesStatus =
                statusFilter === "all" || contact.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [contactData, search, statusFilter]);

    const visibleIds = filteredContacts.map((contact) => contact.id);

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const someVisibleSelected = visibleIds.some((id) =>
        selectedIds.includes(id)
    );

    const hasActiveFilters = Boolean(search || statusFilter !== "all");

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    /* ---------- Sélection ---------- */

    const handleSelectAllAcrossPages = async () => {
        setFetchingAllIds(true);

        try {
            const response = await fetch(
                route("admin.observatory-contacts.ids", {
                    search: search || undefined,
                    status: statusFilter === "all" ? undefined : statusFilter,
                }),
                { headers: { Accept: "application/json" } }
            );

            if (!response.ok) throw new Error("Request failed");

            const data = await response.json();

            setSelectedIds(data.ids);
            setSelectAllAcrossPages(true);
        } catch (error) {
            toastError("Impossible de récupérer tous les contacts.");
        } finally {
            setFetchingAllIds(false);
        }
    };

    const clearSelectAllAcrossPages = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
    };

    const handleToggleSelectAllContacts = () => {
        if (selectAllAcrossPages) clearSelectAllAcrossPages();
        else handleSelectAllAcrossPages();
    };

    const toggleContact = (id) => {
        setSelectedIds((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );

        setSelectAllAcrossPages(false);
    };

    const toggleSelectAll = () => {
        if (allVisibleSelected) {
            setSelectedIds((previous) =>
                previous.filter((id) => !visibleIds.includes(id))
            );
        } else {
            setSelectedIds((previous) => [
                ...new Set([...previous, ...visibleIds]),
            ]);
        }

        setSelectAllAcrossPages(false);
    };

    /* ---------- Ajout d'un contact ---------- */

    const setField = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));

        setFormErrors((previous) => {
            if (!previous[name]) return previous;

            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleFormChange = (event) => {
        setField(event.target.name, event.target.value);
    };

    const closeAddModal = () => {
        if (adding) return;
        setShowAddModal(false);
        setFormErrors({});
    };

    const handleAddContact = (event) => {
        event.preventDefault();

        setAdding(true);
        setFormErrors({});

        router.post(route("admin.observatory-contacts.store"), form, {
            preserveScroll: true,

            onSuccess: () => {
                setForm(INITIAL_FORM);
                setShowAddModal(false);
                toastSuccess("Contact ajouté.");
            },

            onError: (errors) => {
                setFormErrors(errors);
                toastError("Corrigez les champs en erreur.");
            },

            onFinish: () => setAdding(false),
        });
    };

    const otherErrors = Object.entries(formErrors).filter(
        ([key]) => !(key in INITIAL_FORM)
    );

    /* ---------- Import Excel ---------- */

    const handleImport = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setImporting(true);
        showLoading("Importation en cours...", file.name);

        router.post(route("admin.observatory-contacts.import"), formData, {
            forceFormData: true,
            preserveScroll: true,

            onFinish: () => {
                setImporting(false);
                // Si aucun message flash ne remplace la fenêtre de chargement
                setTimeout(closeIfLoading, 50);

                if (importInputRef.current) importInputRef.current.value = "";
            },
        });
    };

    /* ---------- Suppression ---------- */

    const handleDelete = (contact) => {
        AppSwal.fire({
            icon: "warning",
            iconColor: "#B3261E",
            title: "Supprimer ce contact ?",
            html: `<strong>${escapeHtml(
                contact.name || "Ce contact"
            )}</strong> sera définitivement supprimé. Cette action est irréversible.`,
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            customClass: DANGER_CLASSES,
        }).then((result) => {
            if (!result.isConfirmed) return;

            router.delete(
                route("admin.observatory-contacts.destroy", contact.id),
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setSelectedIds((previous) =>
                            previous.filter((id) => id !== contact.id)
                        );
                        toastSuccess("Contact supprimé.");
                    },

                    onError: () =>
                        toastError("La suppression a échoué. Réessayez."),
                }
            );
        });
    };

    /* ---------- Pièces jointes ---------- */

    const addAttachments = (fileList) => {
        const files = Array.from(fileList || []);

        if (files.length === 0) return;

        const tooBig = files.filter((file) => file.size > MAX_FILE_SIZE);
        const accepted = files.filter((file) => file.size <= MAX_FILE_SIZE);

        let overLimit = false;

        setAttachments((previous) => {
            const merged = [...previous];

            accepted.forEach((file) => {
                const exists = merged.some(
                    (item) => item.name === file.name && item.size === file.size
                );

                if (exists) return;

                if (merged.length >= MAX_FILES) {
                    overLimit = true;
                    return;
                }

                merged.push(file);
            });

            return merged;
        });

        if (tooBig.length > 0) {
            AppSwal.fire({
                icon: "warning",
                iconColor: "#BF5429",
                title: "Fichier trop volumineux",
                html: `<p class="mb-2">Taille maximale : 10 Mo par fichier.</p>${tooBig
                    .map(
                        (file) =>
                            `<div class="text-[#B3261E]">${escapeHtml(file.name)} (${formatSize(
                                file.size
                            )})</div>`
                    )
                    .join("")}`,
                confirmButtonText: "Compris",
            });
        } else if (
            overLimit ||
            attachments.length + accepted.length > MAX_FILES
        ) {
            toastWarning(`Maximum ${MAX_FILES} fichiers par email.`);
        }
    };

    const handleAttachmentChange = (event) => {
        addAttachments(event.target.files);
        event.target.value = "";
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        addAttachments(event.dataTransfer.files);
    };

    const removeAttachment = (index) => {
        setAttachments((previous) =>
            previous.filter((item, itemIndex) => itemIndex !== index)
        );
    };

    /* ---------- Email ---------- */

    const openEmailModal = () => {
        if (selectedIds.length === 0) {
            toastWarning("Sélectionnez au moins un contact.");
            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (sendingEmail) return;
        setShowEmailModal(false);
    };

    const handleEmailChange = (event) => {
        const { name, value } = event.target;
        setEmailForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSendEmail = (event) => {
        event.preventDefault();

        if (!emailForm.subject.trim()) {
            toastWarning("Veuillez saisir le sujet de l'email.");
            return;
        }

        if (isEmptyHtml(emailForm.message)) {
            toastWarning("Veuillez saisir le message.");
            return;
        }

        const senderInfo = senders.find((s) => s.key === emailSender);

        AppSwal.fire({
            icon: "question",
            iconColor: "#BF5429",
            title: "Envoyer l'email ?",
            html: `
                <div class="mt-4 space-y-2 rounded-2xl bg-[#F7F8F7] p-4 text-left text-[13.5px]">
                    <div class="flex justify-between gap-4"><span class="text-[#8A9290]">Destinataires</span><strong class="text-[#1f2d2d]">${selectedIds.length} contact(s)</strong></div>
                    <div class="flex justify-between gap-4"><span class="text-[#8A9290]">Expéditeur</span><strong class="truncate text-[#1f2d2d]">${escapeHtml(
                        senderInfo ? senderInfo.address : emailSender
                    )}</strong></div>
                    <div class="flex justify-between gap-4"><span class="text-[#8A9290]">Sujet</span><strong class="truncate text-[#1f2d2d]">${escapeHtml(
                        emailForm.subject.trim()
                    )}</strong></div>
                    <div class="flex justify-between gap-4"><span class="text-[#8A9290]">Pièces jointes</span><strong class="text-[#1f2d2d]">${
                        attachments.length > 0
                            ? `${attachments.length} fichier(s)`
                            : "Aucune"
                    }</strong></div>
                </div>
                <p class="mt-3 text-xs text-[#8A9290]">Chaque contact recevra un email individuel.</p>`,
            showCancelButton: true,
            confirmButtonText: "Envoyer maintenant",
            cancelButtonText: "Revenir",
        }).then((result) => {
            if (!result.isConfirmed) return;

            /*
             * FormData obligatoire dès qu'il y a des fichiers.
             * Les tableaux doivent être envoyés avec la syntaxe "clé[]".
             */
            const formData = new FormData();

            selectedIds.forEach((id) => formData.append("contact_ids[]", id));

            formData.append("subject", emailForm.subject);
            formData.append("message", emailForm.message);
            formData.append("sender", emailSender);

            attachments.forEach((file) =>
                formData.append("attachments[]", file)
            );

            setSendingEmail(true);
            showLoading(
                "Envoi en cours...",
                "Merci de patienter, ne fermez pas cette page."
            );

            router.post(
                route("admin.observatory-contacts.send-email"),
                formData,
                {
                    forceFormData: true,
                    preserveScroll: true,

                    onSuccess: () => {
                        setSelectedIds([]);
                        setSelectAllAcrossPages(false);
                        setEmailForm({ subject: "", message: "" });
                        setAttachments([]);
                        setShowEmailModal(false);

                        // Le message de succès vient du flash serveur ;
                        // s'il est absent, on confirme quand même.
                        if (!flash?.success) {
                            closeIfLoading();
                            AppSwal.fire({
                                icon: "success",
                                iconColor: "#2F6B4F",
                                title: "Email envoyé",
                                text: "Votre email a été envoyé avec succès.",
                                confirmButtonText: "Parfait",
                                timer: 6000,
                                timerProgressBar: true,
                            });
                        }
                    },

                    onError: (errors) => {
                        const messages = Object.values(errors || {})
                            .map(escapeHtml)
                            .join("<br/>");

                        alertError(
                            messages ||
                                "L'email n'a pas pu être envoyé. Réessayez.",
                            "Envoi échoué"
                        );
                    },

                    onFinish: () => {
                        setSendingEmail(false);
                        setTimeout(closeIfLoading, 50);
                    },
                }
            );
        });
    };

    /* ---------- Styles utilitaires ---------- */

    const fieldClass = (name) =>
        `${INPUT_BASE} ${formErrors[name] ? INPUT_INVALID : ""}`;

    const thClass = "px-4 py-4 text-[12px] font-medium text-[#8A9290]";

    const hasSelection = selectedIds.length > 0;

    /* =====================================================
       Render
    ===================================================== */

    return (
        <AdminLayout>
            <Head title="Contacts — Observatory" />

            <style>{`
                .quill-observatory .ql-toolbar.ql-snow { border: 0; border-bottom: 1px solid #E4E7E5; background: #F9FAF8; padding: 10px 12px; }
                .quill-observatory .ql-container.ql-snow { border: 0; font-size: 14px; }
                .quill-observatory .ql-editor { max-height: 320px; color: #1f2d2d; }
                .quill-observatory .ql-editor.ql-blank::before { color: #8A9290; font-style: normal; }
                .quill-observatory .ql-snow .ql-stroke { stroke: #5B6462; }
                .quill-observatory .ql-snow .ql-fill { fill: #5B6462; }
                .quill-observatory .ql-snow.ql-toolbar button:hover .ql-stroke,
                .quill-observatory .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #BF5429; }
                .quill-observatory .ql-snow.ql-toolbar button:hover .ql-fill,
                .quill-observatory .ql-snow.ql-toolbar button.ql-active .ql-fill { fill: #BF5429; }
                @keyframes barIn { from { transform: translate(-50%, 16px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                .selection-bar { animation: barIn .2s ease-out; }
                @media (prefers-reduced-motion: reduce) { .selection-bar { animation: none; } }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 pb-28 md:px-6">
                {/* ---------- En-tête ---------- */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="font-display text-2xl tracking-tight text-[#1f2d2d] md:text-3xl">
                            Maroc Social 2030
                        </h1>

                        <p className="mt-2 text-[13.5px] text-[#5B6462]">
                            Gérer les contacts de l'Observatoire.{" "}
                            <strong className="font-semibold text-[#1f2d2d]">
                                {totalContactsCount}
                            </strong>{" "}
                            contact(s) au total.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#1f2d2d] shadow-sm transition hover:bg-[#F7F8F7]">
                            {importing ? (
                                <Loader2
                                    size={14}
                                    strokeWidth={2}
                                    className="animate-spin"
                                />
                            ) : (
                                <Upload size={14} strokeWidth={2} />
                            )}
                            {importing ? "Importation..." : "Import Excel"}
                            <input
                                ref={importInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleImport}
                                disabled={importing}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleToggleSelectAllContacts}
                            disabled={fetchingAllIds || totalContactsCount === 0}
                            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13.5px] font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                selectAllAcrossPages
                                    ? "border-[#BF5429] bg-[#BF5429]/5 text-[#BF5429] hover:bg-[#BF5429]/10"
                                    : "border-[#D6D9D8] bg-white text-[#1f2d2d] hover:bg-[#F7F8F7]"
                            }`}
                        >
                            {fetchingAllIds ? (
                                <Loader2
                                    size={14}
                                    strokeWidth={2}
                                    className="animate-spin"
                                />
                            ) : selectAllAcrossPages ? (
                                <CheckSquare size={14} strokeWidth={2} />
                            ) : (
                                <Square size={14} strokeWidth={2} />
                            )}
                            {fetchingAllIds
                                ? "Chargement..."
                                : selectAllAcrossPages
                                ? `Tout désélectionner (${totalContactsCount})`
                                : `Tout sélectionner (${totalContactsCount})`}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 rounded-xl bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/20"
                        >
                            <Plus size={14} strokeWidth={2} />
                            Ajouter un contact
                        </button>
                    </div>
                </div>

                {/* ---------- Recherche / filtres ---------- */}
                <div className="rounded-2xl border border-[#D6D9D8] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={15}
                                strokeWidth={2}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Rechercher un nom, email, organisation..."
                                className={`${INPUT_BASE} pl-10 pr-10`}
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9290] transition hover:text-[#1f2d2d]"
                                >
                                    <XCircle size={15} strokeWidth={2} />
                                </button>
                            )}
                        </div>

                        <div
                            role="tablist"
                            aria-label="Filtrer par statut"
                            className="flex gap-1 overflow-x-auto rounded-xl border border-[#D6D9D8] bg-[#F7F8F7] p-1"
                        >
                            {STATUS_TABS.map((tab) => {
                                const selected = statusFilter === tab.value;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF5429]/40 ${
                                            selected
                                                ? "bg-white text-[#BF5429] shadow-sm ring-1 ring-[#BF5429]/30"
                                                : "text-[#5B6462] hover:text-[#1f2d2d]"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] hover:text-[#BF5429]"
                            >
                                <RotateCcw size={14} strokeWidth={2} />
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {hasSelection &&
                        allVisibleSelected &&
                        !selectAllAcrossPages &&
                        totalContactsCount > visibleIds.length && (
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[#BF5429]/20 bg-[#BF5429]/5 px-4 py-3 text-[13px] text-[#1f2d2d]">
                                <span>
                                    Les <strong>{visibleIds.length}</strong>{" "}
                                    contacts de cette page sont sélectionnés.
                                </span>

                                <button
                                    type="button"
                                    onClick={handleSelectAllAcrossPages}
                                    disabled={fetchingAllIds}
                                    className="font-semibold text-[#BF5429] underline underline-offset-2 hover:no-underline"
                                >
                                    {fetchingAllIds
                                        ? "Chargement..."
                                        : `Sélectionner les ${totalContactsCount} contacts correspondants`}
                                </button>
                            </div>
                        )}
                </div>

                {/* ---------- Tableau ---------- */}
                <div className="overflow-hidden rounded-2xl border border-[#D6D9D8] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left">
                            <thead className="border-b border-[#D6D9D8] bg-[#F9FAF8]">
                                <tr>
                                    <th className="w-12 px-4 py-4">
                                        <input
                                            type="checkbox"
                                            aria-label="Sélectionner la page"
                                            checked={allVisibleSelected}
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate =
                                                        someVisibleSelected &&
                                                        !allVisibleSelected;
                                                }
                                            }}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 cursor-pointer rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30"
                                        />
                                    </th>

                                    <th className={thClass}>Contact</th>
                                    <th className={thClass}>Coordonnées</th>
                                    <th className={thClass}>Genre</th>
                                    <th className={thClass}>Statut</th>
                                    <th className={thClass}>Suivi</th>
                                    <th className={`${thClass} text-right`}>
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E4E7E5]">
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map((contact) => {
                                        const checked = selectedIds.includes(
                                            contact.id
                                        );
                                        const status =
                                            STATUS_META[contact.status];

                                        const registered = formatDate(
                                            contact.registered_at
                                        );
                                        const approved = formatDate(
                                            contact.approved_at
                                        );
                                        const rejected = formatDate(
                                            contact.rejected_at
                                        );

                                        return (
                                            <tr
                                                key={contact.id}
                                                className={`transition ${
                                                    checked
                                                        ? "bg-[#BF5429]/[0.04]"
                                                        : "hover:bg-[#F9FAF8]"
                                                }`}
                                            >
                                                <td className="px-4 py-4">
                                                    <RowCheckbox
                                                        label={`Sélectionner ${
                                                            contact.name || "ce contact"
                                                        }`}
                                                        checked={checked}
                                                        onChange={() =>
                                                            toggleContact(
                                                                contact.id
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#BF5429]/10 text-xs font-semibold text-[#BF5429]">
                                                            {initialsOf(
                                                                contact.name
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="truncate text-[13.5px] font-medium text-[#1f2d2d]">
                                                                {contact.name ||
                                                                    "—"}
                                                            </div>

                                                            {(contact.role ||
                                                                contact.organisation) && (
                                                                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#5B6462]">
                                                                    <Building2
                                                                        size={12}
                                                                        className="shrink-0 text-[#8A9290]"
                                                                    />
                                                                    <span className="truncate">
                                                                        {[
                                                                            contact.role,
                                                                            contact.organisation,
                                                                        ]
                                                                            .filter(
                                                                                Boolean
                                                                            )
                                                                            .join(
                                                                                " · "
                                                                            )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {contact.country && (
                                                                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#8A9290]">
                                                                    <Globe
                                                                        size={12}
                                                                        className="shrink-0"
                                                                    />
                                                                    {contact.country}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-[13px]">
                                                    {contact.email ? (
                                                        <a
                                                            href={`mailto:${contact.email}`}
                                                            className="flex items-center gap-1.5 break-all text-[#BF5429] hover:underline"
                                                        >
                                                            <Mail
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                            {contact.email}
                                                        </a>
                                                    ) : (
                                                        <span className="text-[#C3C8C6]">
                                                            —
                                                        </span>
                                                    )}

                                                    {contact.phone && (
                                                        <a
                                                            href={`tel:${contact.phone}`}
                                                            className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[#5B6462] hover:text-[#BF5429]"
                                                        >
                                                            <Phone
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                            {contact.phone}
                                                        </a>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-[13px] text-[#5B6462]">
                                                    {contact.gender === "H"
                                                        ? "Homme"
                                                        : contact.gender === "F"
                                                        ? "Femme"
                                                        : "—"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
                                                            status?.badge ??
                                                            "bg-[#8A9290]/10 text-[#5B6462]"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                status?.dot ??
                                                                "bg-[#8A9290]"
                                                            }`}
                                                        />
                                                        {status?.label ??
                                                            contact.status}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-[12px] leading-relaxed text-[#5B6462]">
                                                    <div>
                                                        Inscrit le{" "}
                                                        {registered ?? "—"}
                                                    </div>

                                                    {approved && (
                                                        <div className="text-[#2F6B4F]">
                                                            Approuvé le{" "}
                                                            {approved}
                                                        </div>
                                                    )}

                                                    {rejected && (
                                                        <div className="text-[#B3261E]">
                                                            Rejeté le {rejected}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(contact)
                                                        }
                                                        aria-label={`Supprimer ${
                                                            contact.name || "ce contact"
                                                        }`}
                                                        title="Supprimer"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#8A9290] transition hover:bg-[#B3261E]/10 hover:text-[#B3261E]"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                            strokeWidth={2}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F8F7] text-[#8A9290]">
                                                    <Users
                                                        size={24}
                                                        strokeWidth={1.6}
                                                    />
                                                </div>

                                                <p className="mt-4 text-[14px] font-medium text-[#1f2d2d]">
                                                    Aucun contact trouvé
                                                </p>

                                                <p className="mt-1 text-[13px] text-[#5B6462]">
                                                    {hasActiveFilters
                                                        ? "Modifiez la recherche ou réinitialisez les filtres."
                                                        : "Ajoutez un contact ou importez un fichier Excel."}
                                                </p>

                                                {hasActiveFilters && (
                                                    <button
                                                        type="button"
                                                        onClick={resetFilters}
                                                        className="mt-4 rounded-xl border border-[#D6D9D8] px-4 py-2.5 text-[13px] font-medium text-[#1f2d2d] transition hover:bg-[#F7F8F7]"
                                                    >
                                                        Réinitialiser les filtres
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {contacts?.links && contacts.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-[#D6D9D8] p-4">
                            {contacts.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(
                                                link.url,
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                }
                                            );
                                        }
                                    }}
                                    className={`min-w-[40px] rounded-lg px-3 py-2 text-center text-[13px] transition ${
                                        link.active
                                            ? "bg-[#BF5429] font-semibold text-white"
                                            : link.url
                                            ? "text-[#5B6462] hover:bg-[#F7F8F7] hover:text-[#BF5429]"
                                            : "cursor-not-allowed text-[#D6D9D8]"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ---------- Barre flottante de sélection ---------- */}
            {hasSelection && !showEmailModal && !showAddModal && (
                <div className="selection-bar fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#1f2d2d] px-4 py-3 text-white shadow-2xl">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-xl bg-white/10 px-2 text-sm font-semibold">
                            {selectedIds.length}
                        </div>
                        <p className="truncate text-[13.5px]">
                            {selectedIds.length > 1
                                ? "contacts sélectionnés"
                                : "contact sélectionné"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={clearSelectAllAcrossPages}
                        aria-label="Annuler la sélection"
                        title="Tout désélectionner"
                        className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={openEmailModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#d4622f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/40"
                    >
                        <Mail size={15} />
                        Envoyer un email
                    </button>
                </div>
            )}

            {/* =================================================
                Modal : Ajouter un contact
            ================================================= */}

            {showAddModal && (
                <Modal
                    icon={UserPlus}
                    title="Ajouter un contact"
                    subtitle="Seul le nom est obligatoire. Le statut est « En attente » par défaut."
                    onClose={closeAddModal}
                    locked={adding}
                    maxWidth="max-w-xl"
                >
                    <form onSubmit={handleAddContact} className={MODAL_FORM}>
                        <div className={MODAL_BODY}>
                            {otherErrors.length > 0 && (
                                <div className="rounded-xl border border-[#B3261E]/30 bg-[#B3261E]/5 px-4 py-3 text-[13px] text-[#B3261E]">
                                    {otherErrors.map(([key, message]) => (
                                        <p key={key}>{message}</p>
                                    ))}
                                </div>
                            )}

                            <FormSection title="Identité">
                                <Field
                                    label="Nom"
                                    required
                                    error={formErrors.name}
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        required
                                        autoFocus
                                        className={fieldClass("name")}
                                        placeholder="Nom complet"
                                    />
                                </Field>

                                <Field label="Genre" error={formErrors.gender}>
                                    <Segmented
                                        label="Genre"
                                        value={form.gender}
                                        options={GENDER_OPTIONS}
                                        onChange={(value) =>
                                            setField(
                                                "gender",
                                                form.gender === value ? "" : value
                                            )
                                        }
                                    />
                                </Field>
                            </FormSection>

                            <FormSection title="Activité">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Organisation"
                                        error={formErrors.organisation}
                                    >
                                        <input
                                            type="text"
                                            name="organisation"
                                            value={form.organisation}
                                            onChange={handleFormChange}
                                            className={fieldClass("organisation")}
                                            placeholder="Nom de l'organisation"
                                        />
                                    </Field>

                                    <Field label="Rôle" error={formErrors.role}>
                                        <input
                                            type="text"
                                            name="role"
                                            value={form.role}
                                            onChange={handleFormChange}
                                            className={fieldClass("role")}
                                            placeholder="Fonction ou rôle"
                                        />
                                    </Field>
                                </div>
                            </FormSection>

                            <FormSection title="Coordonnées">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Email" error={formErrors.email}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            className={fieldClass("email")}
                                            placeholder="email@example.com"
                                        />
                                    </Field>

                                    <Field
                                        label="Téléphone"
                                        error={formErrors.phone}
                                    >
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleFormChange}
                                            className={fieldClass("phone")}
                                            placeholder="+212 6 00 00 00 00"
                                        />
                                    </Field>
                                </div>

                                <Field label="LinkedIn" error={formErrors.linkedin}>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={form.linkedin}
                                        onChange={handleFormChange}
                                        className={fieldClass("linkedin")}
                                        placeholder="https://www.linkedin.com/in/..."
                                    />
                                </Field>
                            </FormSection>

                            <FormSection title="Localisation et suivi">
                                <Field label="Pays" error={formErrors.country}>
                                    <CountrySelect
                                        value={form.country}
                                        onChange={(value) =>
                                            setField("country", value)
                                        }
                                        options={countries}
                                        loading={loadingCountries}
                                        failed={countriesFailed}
                                        onRetry={retryCountries}
                                        invalid={Boolean(formErrors.country)}
                                    />
                                </Field>

                                <Field label="Statut" error={formErrors.status}>
                                    <Segmented
                                        label="Statut"
                                        value={form.status}
                                        options={STATUS_OPTIONS}
                                        onChange={(value) =>
                                            setField("status", value)
                                        }
                                    />
                                </Field>
                            </FormSection>
                        </div>

                        <div className={MODAL_FOOTER}>
                            <button
                                type="button"
                                onClick={closeAddModal}
                                disabled={adding}
                                className="rounded-xl border border-[#D6D9D8] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] disabled:opacity-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={adding}
                                className="flex items-center gap-2 rounded-xl bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {adding ? (
                                    <Loader2
                                        size={15}
                                        strokeWidth={2}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Plus size={15} strokeWidth={2} />
                                )}
                                {adding ? "Ajout..." : "Ajouter le contact"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* =================================================
                Modal : Envoyer un email (Quill + pièces jointes)
            ================================================= */}

            {showEmailModal && (
                <Modal
                    icon={Mail}
                    title="Envoyer un email"
                    subtitle={`À ${selectedIds.length} contact(s) — un email individuel pour chacun`}
                    onClose={closeEmailModal}
                    locked={sendingEmail}
                    maxWidth="max-w-2xl"
                >
                    <form onSubmit={handleSendEmail} className={MODAL_FORM}>
                        <div className={MODAL_BODY}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Expéditeur" required>
                                    <select
                                        value={emailSender}
                                        onChange={(event) =>
                                            setEmailSender(event.target.value)
                                        }
                                        disabled={sendingEmail}
                                        className={INPUT_BASE}
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
                                </Field>

                                <Field label="Sujet" required>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={emailForm.subject}
                                        onChange={handleEmailChange}
                                        disabled={sendingEmail}
                                        className={INPUT_BASE}
                                        placeholder="Sujet de l'email"
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Message"
                                required
                                hint="Mise en forme simple : gras, italique, listes, liens."
                            >
                                <div className="quill-observatory overflow-hidden rounded-xl border border-[#D6D9D8] transition focus-within:border-[#BF5429] focus-within:ring-4 focus-within:ring-[#BF5429]/10">
                                    <Suspense
                                        fallback={
                                            <div className="flex h-40 items-center justify-center text-[#8A9290]">
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                            </div>
                                        }
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={emailForm.message}
                                            onChange={(value) =>
                                                setEmailForm((previous) => ({
                                                    ...previous,
                                                    message: value,
                                                }))
                                            }
                                            readOnly={sendingEmail}
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="Écrivez votre message..."
                                            className="bg-white [&_.ql-container]:min-h-[220px]"
                                        />
                                    </Suspense>
                                </div>
                            </Field>

                            <Field label="Pièces jointes">
                                <label
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
                                        dragging
                                            ? "border-[#BF5429] bg-[#BF5429]/5"
                                            : "border-[#D6D9D8] hover:border-[#BF5429]/60 hover:bg-[#BF5429]/[0.03]"
                                    } ${
                                        attachments.length >= MAX_FILES
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }`}
                                >
                                    <Paperclip
                                        size={18}
                                        strokeWidth={2}
                                        className="text-[#BF5429]"
                                    />
                                    <span className="text-[13px] font-medium text-[#1f2d2d]">
                                        Glissez vos fichiers ici ou cliquez pour
                                        parcourir
                                    </span>
                                    <span className="text-[12px] text-[#8A9290]">
                                        {attachments.length}/{MAX_FILES} fichiers
                                        · 10 Mo maximum chacun
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                                        onChange={handleAttachmentChange}
                                        className="hidden"
                                    />
                                </label>

                                {attachments.length > 0 && (
                                    <ul className="mt-3 space-y-2">
                                        {attachments.map((file, index) => (
                                            <li
                                                key={`${file.name}-${index}`}
                                                className="flex items-center gap-3 rounded-xl bg-[#F7F8F7] px-3 py-2.5"
                                            >
                                                <FileText
                                                    size={15}
                                                    strokeWidth={2}
                                                    className="shrink-0 text-[#BF5429]"
                                                />

                                                <span className="min-w-0 flex-1 truncate text-[13px] text-[#1f2d2d]">
                                                    {file.name}
                                                </span>

                                                <span className="shrink-0 text-[12px] text-[#8A9290]">
                                                    {formatSize(file.size)}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAttachment(index)
                                                    }
                                                    disabled={sendingEmail}
                                                    aria-label={`Retirer ${file.name}`}
                                                    className="shrink-0 rounded-lg p-1.5 text-[#8A9290] transition hover:bg-white hover:text-[#B3261E]"
                                                >
                                                    <Trash2
                                                        size={15}
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Field>
                        </div>

                        <div className={MODAL_FOOTER}>
                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-xl border border-[#D6D9D8] bg-white px-5 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] disabled:opacity-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={sendingEmail}
                                className="flex items-center gap-2 rounded-xl bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sendingEmail ? (
                                    <Loader2
                                        size={15}
                                        strokeWidth={2}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Mail size={15} strokeWidth={2} />
                                )}

                                {sendingEmail ? "Envoi..." : "Envoyer l'email"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}