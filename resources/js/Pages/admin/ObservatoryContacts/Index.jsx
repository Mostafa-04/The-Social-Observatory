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
    X,
    Users,
    Loader2,
    XCircle,
    SlidersHorizontal,
    Paperclip,
    FileText,
    Trash2,
    CheckSquare,
    Square,
    UserPlus,
    ChevronDown,
    Check,
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
   Design tokens (même palette que la page Insights)
========================================================= */

const STATUS_STYLES = {
    approved: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    pending: "bg-[#BF5429]/10 text-[#BF5429]",
    rejected: "bg-[#B3261E]/10 text-[#B3261E]",
};

const STATUS_LABELS = {
    approved: "Approuvé",
    pending: "En attente",
    rejected: "Rejeté",
};

const STATUS_OPTIONS = [
    { value: "pending", label: "En attente" },
    { value: "approved", label: "Approuvé" },
    { value: "rejected", label: "Rejeté" },
];

const GENDER_OPTIONS = [
    { value: "H", label: "Homme" },
    { value: "F", label: "Femme" },
];

/* Limites alignées avec la validation Laravel */
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
    "w-full rounded-lg border border-[#D6D9D8] bg-white px-3 py-2.5 text-[13.5px] text-[#1f2d2d] outline-none transition placeholder:text-[#8A9290] focus:border-[#BF5429] focus:ring-1 focus:ring-[#BF5429]/30";

const INPUT_INVALID =
    "!border-[#B3261E] focus:!border-[#B3261E] focus:!ring-[#B3261E]/30";

/* =========================================================
   SweetAlert2
========================================================= */

const swalTheme = {
    confirmButtonColor: "#BF5429",
    cancelButtonColor: "#8A9290",
    customClass: {
        popup: "rounded-2xl",
        title: "!text-[#1f2d2d] !text-lg !font-semibold",
        htmlContainer: "!text-[13px] !text-[#5B6462]",
        confirmButton: "!rounded-lg !px-5 !py-2.5 !text-[13.5px] !font-medium",
        cancelButton: "!rounded-lg !px-5 !py-2.5 !text-[13.5px] !font-medium",
    },
};

const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    customClass: {
        popup: "rounded-xl",
        title: "!text-[13.5px] !text-[#1f2d2d]",
    },
});

/* =========================================================
   Helpers
========================================================= */

/* Recherche insensible à la casse ET aux accents */
const normalize = (value) =>
    String(value ?? "")
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

/* Quill renvoie "<p><br></p>" quand l'éditeur est vide */
const isEmptyHtml = (html) =>
    !String(html ?? "")
        .replace(/<(.|\n)*?>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

const formatSize = (bytes) => {
    if (bytes < 1024) {
        return `${bytes} o`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} Ko`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

/* =========================================================
   Hook : chargement des pays via route("api.countries")
   - chargé une seule fois, à la première ouverture du modal
   - accepte ["Maroc", ...] ou [{ name: "Maroc" }, ...]
========================================================= */

function useCountries(enabled) {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!enabled || loadedRef.current) {
            return;
        }

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
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadCountries();

        return () => controller.abort();
    }, [enabled, attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    return { countries, loading, failed, retry };
}

/* =========================================================
   Modal : structure commune (en-tête fixe, corps scrollable,
   pied fixe). C'est ça qui corrige le scroll : le panneau est
   limité à 92% de la hauteur écran et SEUL le corps défile.
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
        // Empêche la page derrière de défiler
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d2d]/50 p-3 backdrop-blur-[2px] sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !locked) {
                    onClose();
                }
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
                className={`modal-panel flex max-h-[92dvh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-[#D6D9D8]`}
            >
                <div className="flex shrink-0 items-start gap-3 border-b border-[#D6D9D8] px-6 py-4">
                    {Icon && (
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#BF5429]/10 text-[#BF5429]">
                            <Icon size={18} strokeWidth={2} />
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
                        className="rounded-lg p-1.5 text-[#8A9290] transition hover:bg-[#F7F8F7] hover:text-[#1f2d2d] disabled:opacity-40"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

/* Classes partagées par les formulaires dans les modals */
const MODAL_FORM = "flex min-h-0 flex-1 flex-col";
const MODAL_BODY = "min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5";
const MODAL_FOOTER =
    "flex shrink-0 items-center justify-end gap-2 border-t border-[#D6D9D8] bg-[#F7F8F7] px-6 py-4";

/* =========================================================
   Petits composants de formulaire
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
            <h3 className="border-b border-[#D6D9D8]/70 pb-2 text-[12.5px] font-semibold text-[#5B6462]">
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
            className="flex gap-1 rounded-lg border border-[#D6D9D8] bg-[#F7F8F7] p-1"
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
                        className={`flex-1 rounded-md px-3 py-2 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF5429]/40 ${
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

/* =========================================================
   Select pays avec recherche
   - recherche insensible aux accents
   - navigation clavier : ↑ ↓ Entrée Échap
   - le panneau se fait scroller dans la vue du modal
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

    /* Fermeture au clic extérieur */
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleMouseDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleMouseDown);

        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, close]);

    /* À l'ouverture : focus recherche + panneau visible dans le modal */
    useEffect(() => {
        if (!open) {
            return;
        }

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

    /* Garde l'élément actif visible dans la liste */
    useEffect(() => {
        if (!open) {
            return;
        }

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

            if (filtered[active]) {
                select(filtered[active].value);
            }
        } else if (event.key === "Escape") {
            // Ferme seulement la liste, pas le modal
            event.stopPropagation();
            close();
            triggerRef.current?.focus();
        }
    };

    if (failed) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#B3261E]/30 bg-[#B3261E]/5 px-3 py-2.5 text-[13px] text-[#B3261E]">
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
                className={`flex w-full items-center gap-2 rounded-lg border bg-white py-2.5 pl-3 text-left text-[13.5px] outline-none transition focus:border-[#BF5429] focus:ring-1 focus:ring-[#BF5429]/30 disabled:cursor-wait disabled:bg-[#F7F8F7] ${
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
                    className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-xl"
                >
                    <div className="relative border-b border-[#D6D9D8] p-2">
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

export default function Index({ contacts, flash, filters }) {
    /* =====================================================
       State
    ===================================================== */

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
    const [fetchingAllIds, setFetchingAllIds] = useState(false);

    // Initialisés depuis les query params renvoyés par le serveur
    const [search, setSearch] = useState(filters?.search ?? "");
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? "all");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const [importing, setImporting] = useState(false);
    const [adding, setAdding] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
    const [attachments, setAttachments] = useState([]);

    const importInputRef = useRef(null);
    const attachInputRef = useRef(null);
    const debounceRef = useRef(null);

    const {
        countries,
        loading: loadingCountries,
        failed: countriesFailed,
        retry: retryCountries,
    } = useCountries(showAddModal);

    /* =====================================================
       Données dérivées
       (contactData AVANT totalContactsCount : l'ancien code
       l'utilisait avant sa déclaration)
    ===================================================== */

    const contactData = contacts?.data || [];

    const totalContactsCount =
        contacts?.meta?.total ?? contacts?.total ?? contactData.length;

    /* =====================================================
       Recherche serveur avec debounce (350ms)
    ===================================================== */

    const runSearch = useCallback((nextSearch, nextStatus) => {
        router.get(
            route("admin.observatory-contacts.index"),
            {
                search: nextSearch || undefined,
                status: nextStatus === "all" ? undefined : nextStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true, // évite d'empiler l'historique à chaque frappe
            }
        );
    }, []);

    useEffect(() => {
        // Ne pas re-déclencher au tout premier rendu si rien n'a changé
        if (
            search === (filters?.search ?? "") &&
            statusFilter === (filters?.status ?? "all")
        ) {
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            runSearch(search, statusFilter);
        }, 350);

        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    /* =====================================================
       Flash messages → SweetAlert2
    ===================================================== */

    useEffect(() => {
        if (flash?.success) {
            toast.fire({ icon: "success", title: flash.success });
        }

        if (flash?.error) {
            Swal.fire({
                ...swalTheme,
                icon: "error",
                title: "Une erreur est survenue",
                text: flash.error,
                confirmButtonText: "Fermer",
            });
        }

        if (flash?.import_errors?.length > 0) {
            const rows = flash.import_errors
                .map(
                    (error) => `
                        <div style="text-align:left;border:1px solid #F0D5CC;background:#FDF6F3;border-radius:10px;padding:10px 12px;margin-bottom:8px;">
                            <div style="font-size:12px;color:#8A9290;">Ligne ${error.row} — ${error.attribute}</div>
                            <div style="font-size:13px;color:#B3261E;margin-top:2px;">
                                ${(error.errors || []).join("<br/>")}
                            </div>
                        </div>`
                )
                .join("");

            Swal.fire({
                ...swalTheme,
                icon: "warning",
                title: "Erreurs dans le fichier Excel",
                html: `<div style="max-height:320px;overflow:auto;">${rows}</div>`,
                width: 620,
                confirmButtonText: "J'ai compris",
            });
        }
    }, [flash]);

    /* =====================================================
       Search + Filter (côté client, sur la page courante)
    ===================================================== */

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

    /* =====================================================
       Sélection (page courante + toutes les pages)
    ===================================================== */

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

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();

            setSelectedIds(data.ids);
            setSelectAllAcrossPages(true);
        } catch (error) {
            toast.fire({
                icon: "error",
                title: "Impossible de récupérer tous les contacts",
            });
        } finally {
            setFetchingAllIds(false);
        }
    };

    const clearSelectAllAcrossPages = () => {
        setSelectedIds([]);
        setSelectAllAcrossPages(false);
    };

    const handleToggleSelectAllContacts = () => {
        if (selectAllAcrossPages) {
            clearSelectAllAcrossPages();
        } else {
            handleSelectAllAcrossPages();
        }
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

    /* =====================================================
       Add contact
    ===================================================== */

    const setField = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));

        // Efface l'erreur du champ dès qu'on le modifie
        setFormErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }

            const next = { ...previous };

            delete next[name];

            return next;
        });
    };

    const handleFormChange = (event) => {
        setField(event.target.name, event.target.value);
    };

    const closeAddModal = () => {
        if (adding) {
            return;
        }

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

                toast.fire({ icon: "success", title: "Contact ajouté" });
            },

            onError: (errors) => {
                setFormErrors(errors);

                toast.fire({
                    icon: "error",
                    title: "Corrigez les champs en erreur",
                });
            },

            onFinish: () => setAdding(false),
        });
    };

    /* Erreurs serveur qui ne correspondent à aucun champ affiché */
    const otherErrors = Object.entries(formErrors).filter(
        ([key]) => !(key in INITIAL_FORM)
    );

    /* =====================================================
       Import Excel
    ===================================================== */

    const handleImport = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        setImporting(true);

        router.post(route("admin.observatory-contacts.import"), formData, {
            forceFormData: true,
            preserveScroll: true,

            onFinish: () => {
                setImporting(false);

                if (importInputRef.current) {
                    importInputRef.current.value = "";
                }
            },
        });
    };

    /* =====================================================
       Delete contact
    ===================================================== */

    const handleDelete = (contact) => {
        Swal.fire({
            ...swalTheme,
            icon: "warning",
            title: "Supprimer ce contact ?",
            text: `${contact.name || "Ce contact"} sera définitivement supprimé.`,
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            router.delete(
                route("admin.observatory-contacts.destroy", contact.id),
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setSelectedIds((previous) =>
                            previous.filter((id) => id !== contact.id)
                        );

                        toast.fire({
                            icon: "success",
                            title: "Contact supprimé",
                        });
                    },
                }
            );
        });
    };

    /* =====================================================
       Attachments
    ===================================================== */

    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const tooBig = files.filter((file) => file.size > MAX_FILE_SIZE);
        const accepted = files.filter((file) => file.size <= MAX_FILE_SIZE);

        setAttachments((previous) => {
            const merged = [...previous];

            accepted.forEach((file) => {
                const exists = merged.some(
                    (item) => item.name === file.name && item.size === file.size
                );

                if (!exists && merged.length < MAX_FILES) {
                    merged.push(file);
                }
            });

            return merged;
        });

        if (tooBig.length > 0) {
            Swal.fire({
                ...swalTheme,
                icon: "warning",
                title: "Fichier trop volumineux",
                html: `Taille maximale : 10 Mo.<br/>${tooBig
                    .map((file) => file.name)
                    .join("<br/>")}`,
                confirmButtonText: "Compris",
            });
        }

        // Permet de re-sélectionner le même fichier
        event.target.value = "";
    };

    const removeAttachment = (index) => {
        setAttachments((previous) =>
            previous.filter((item, itemIndex) => itemIndex !== index)
        );
    };

    /* =====================================================
       Email
    ===================================================== */

    const openEmailModal = () => {
        if (selectedIds.length === 0) {
            Swal.fire({
                ...swalTheme,
                icon: "info",
                title: "Aucun contact sélectionné",
                text: "Sélectionnez au moins un contact avant d'envoyer un email.",
                confirmButtonText: "Compris",
            });

            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (sendingEmail) {
            return;
        }

        setShowEmailModal(false);
    };

    const handleEmailChange = (event) => {
        const { name, value } = event.target;

        setEmailForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSendEmail = (event) => {
        event.preventDefault();

        if (!emailForm.subject.trim() || isEmptyHtml(emailForm.message)) {
            Swal.fire({
                ...swalTheme,
                icon: "info",
                title: "Champs manquants",
                text: "Le sujet et le message sont obligatoires.",
                confirmButtonText: "Compris",
            });

            return;
        }

        Swal.fire({
            ...swalTheme,
            icon: "question",
            title: "Envoyer l'email ?",
            html: `L'email sera envoyé à <strong>${selectedIds.length}</strong> contact(s)${
                attachments.length > 0
                    ? ` avec ${attachments.length} pièce(s) jointe(s)`
                    : ""
            }.`,
            showCancelButton: true,
            confirmButtonText: "Envoyer",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            /*
             * FormData obligatoire dès qu'il y a des fichiers.
             * Les tableaux doivent être envoyés avec la syntaxe "clé[]".
             */
            const formData = new FormData();

            selectedIds.forEach((id) => {
                formData.append("contact_ids[]", id);
            });

            formData.append("subject", emailForm.subject);
            formData.append("message", emailForm.message);

            attachments.forEach((file) => {
                formData.append("attachments[]", file);
            });

            setSendingEmail(true);

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
                    },

                    onError: (errors) => {
                        Swal.fire({
                            ...swalTheme,
                            icon: "error",
                            title: "Envoi échoué",
                            html:
                                Object.values(errors).join("<br/>") ||
                                "L'email n'a pas pu être envoyé. Réessayez.",
                            confirmButtonText: "Fermer",
                        });
                    },

                    onFinish: () => setSendingEmail(false),
                }
            );
        });
    };

    /* =====================================================
       UI helpers
    ===================================================== */

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        return Number.isNaN(parsedDate.getTime())
            ? "—"
            : parsedDate.toLocaleDateString("fr-FR");
    };

    const inputClass = INPUT_BASE;

    // Classe d'un champ du formulaire d'ajout (rouge si erreur serveur)
    const fieldClass = (name) =>
        `${INPUT_BASE} ${formErrors[name] ? INPUT_INVALID : ""}`;

    const thClass =
        "px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#8A9290]";

    const tdClass = "px-4 py-4 text-[13px] text-[#5B6462]";

    /* =====================================================
       Render
    ===================================================== */

    return (
        <AdminLayout>
            <Head title="Contacts — Observatory" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Observatory — Contacts
                        </p>

                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Maroc Social 2030
                        </h1>

                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer les contacts du Maroc Social 2030.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#1f2d2d] shadow-sm transition hover:bg-[#F7F8F7]">
                            {importing ? (
                                <Loader2
                                    size={12}
                                    strokeWidth={2}
                                    className="animate-spin"
                                />
                            ) : (
                                <Upload size={12} strokeWidth={2} />
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
                            className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-[13.5px] font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                selectAllAcrossPages
                                    ? "border-[#BF5429] bg-[#BF5429]/5 text-[#BF5429] hover:bg-[#BF5429]/10"
                                    : "border-[#D6D9D8] bg-white text-[#1f2d2d] hover:bg-[#F7F8F7]"
                            }`}
                        >
                            {fetchingAllIds ? (
                                <Loader2
                                    size={12}
                                    strokeWidth={2}
                                    className="animate-spin"
                                />
                            ) : selectAllAcrossPages ? (
                                <CheckSquare size={12} strokeWidth={2} />
                            ) : (
                                <Square size={12} strokeWidth={2} />
                            )}
                            {fetchingAllIds
                                ? "Chargement..."
                                : selectAllAcrossPages
                                ? `Tout désélectionner (${totalContactsCount})`
                                : `Tout sélectionner (${totalContactsCount})`}
                        </button>

                        <button
                            type="button"
                            onClick={openEmailModal}
                            disabled={selectedIds.length === 0}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition ${
                                selectedIds.length > 0
                                    ? "border border-[#2F6B4F] bg-[#2F6B4F]/5 text-[#2F6B4F] hover:bg-[#2F6B4F]/10"
                                    : "cursor-not-allowed border border-[#D6D9D8] bg-white text-[#8A9290]"
                            }`}
                        >
                            <Mail size={12} strokeWidth={2} />
                            Envoyer un email
                            {selectedIds.length > 0 && (
                                <span>({selectedIds.length})</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Plus size={12} strokeWidth={2} />
                            Ajouter un contact
                        </button>
                    </div>
                </div>

                {/* Search / Filters */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={15}
                                strokeWidth={2}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9290]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Rechercher un nom, email, organisation..."
                                className={`${inputClass} pl-9 pr-9`}
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

                        <div className="relative w-full md:w-56">
                            <SlidersHorizontal
                                size={15}
                                strokeWidth={2}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9290]"
                            />

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className={`${inputClass} pl-9`}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="approved">Approuvé</option>
                                <option value="rejected">Rejeté</option>
                            </select>
                        </div>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#BF5429]/5 px-4 py-3">
                            <p className="text-[13px] text-[#1f2d2d]">
                                <strong>{selectedIds.length}</strong> contact(s)
                                sélectionné(s)
                                {allVisibleSelected &&
                                    !selectAllAcrossPages &&
                                    totalContactsCount > visibleIds.length && (
                                        <button
                                            type="button"
                                            onClick={handleSelectAllAcrossPages}
                                            disabled={fetchingAllIds}
                                            className="ml-2 font-medium text-[#BF5429] underline hover:no-underline"
                                        >
                                            {fetchingAllIds
                                                ? "Chargement..."
                                                : `Sélectionner les ${totalContactsCount} contacts correspondants`}
                                        </button>
                                    )}
                            </p>

                            <button
                                type="button"
                                onClick={clearSelectAllAcrossPages}
                                className="text-[13px] font-medium text-[#5B6462] transition hover:text-[#1f2d2d]"
                            >
                                Tout désélectionner
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] text-left">
                            <thead className="border-b border-[#D6D9D8]">
                                <tr>
                                    <th className="w-12 px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]"
                                        />
                                    </th>

                                    <th className={thClass}>Nom</th>
                                    <th className={thClass}>Organisation</th>
                                    <th className={thClass}>Rôle</th>
                                    <th className={thClass}>Genre</th>
                                    <th className={thClass}>Email</th>
                                    <th className={thClass}>Téléphone</th>
                                    <th className={thClass}>Statut</th>
                                    <th className={thClass}>Inscrit le</th>
                                    <th className={thClass}>Approuvé le</th>
                                    <th className={thClass}>Rejeté le</th>
                                    <th className={`${thClass} text-right`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#D6D9D8]/60">
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className={`transition hover:bg-[#F7F8F7] ${
                                                selectedIds.includes(contact.id)
                                                    ? "bg-[#BF5429]/5"
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        contact.id
                                                    )}
                                                    onChange={() =>
                                                        toggleContact(contact.id)
                                                    }
                                                    className="h-4 w-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]"
                                                />
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                <span className="font-medium text-[#1f2d2d]">
                                                    {contact.name || "—"}
                                                </span>
                                            </td>

                                            <td className={tdClass}>
                                                {contact.organisation || "—"}
                                            </td>

                                            <td className={tdClass}>
                                                {contact.role || "—"}
                                            </td>

                                            <td className={tdClass}>
                                                {contact.gender === "H"
                                                    ? "Homme"
                                                    : contact.gender === "F"
                                                    ? "Femme"
                                                    : "—"}
                                            </td>

                                            <td className={tdClass}>
                                                {contact.email ? (
                                                    <a
                                                        href={`mailto:${contact.email}`}
                                                        className="text-[#BF5429] hover:underline"
                                                    >
                                                        {contact.email}
                                                    </a>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {contact.phone || "—"}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                                        STATUS_STYLES[
                                                            contact.status
                                                        ] ??
                                                        "bg-[#8A9290]/10 text-[#5B6462]"
                                                    }`}
                                                >
                                                    {STATUS_LABELS[
                                                        contact.status
                                                    ] ?? contact.status}
                                                </span>
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {formatDate(contact.registered_at)}
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {formatDate(contact.approved_at)}
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {formatDate(contact.rejected_at)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(contact)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] px-3 py-1.5 text-[12.5px] font-medium text-[#B3261E] transition hover:bg-[#B3261E]/5"
                                                >
                                                    <Trash2
                                                        size={14}
                                                        strokeWidth={2}
                                                    />
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* 12 colonnes (et non 11) */}
                                        <td
                                            colSpan="12"
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2 text-[#8A9290]">
                                                <Users size={24} strokeWidth={1.6} />

                                                <p className="text-[13px]">
                                                    Aucun contact ne correspond à
                                                    cette recherche.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {contacts?.links && contacts.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-1 border-t border-[#D6D9D8] p-4">
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
                                    className={`rounded-lg px-3 py-2 text-[13px] transition ${
                                        link.active
                                            ? "bg-[#BF5429] text-white"
                                            : link.url
                                            ? "text-[#5B6462] hover:bg-[#F7F8F7]"
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
                                <div className="rounded-lg border border-[#B3261E]/30 bg-[#B3261E]/5 px-4 py-3 text-[13px] text-[#B3261E]">
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
                                className="rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] disabled:opacity-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={adding}
                                className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:cursor-not-allowed disabled:opacity-60"
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
                    subtitle={`${selectedIds.length} contact(s) sélectionné(s)`}
                    onClose={closeEmailModal}
                    locked={sendingEmail}
                    maxWidth="max-w-2xl"
                >
                    <form onSubmit={handleSendEmail} className={MODAL_FORM}>
                        <div className={MODAL_BODY}>
                            {/* Sujet */}
                            <Field label="Sujet" required>
                                <input
                                    type="text"
                                    name="subject"
                                    value={emailForm.subject}
                                    onChange={handleEmailChange}
                                    required
                                    className={inputClass}
                                    placeholder="Sujet de l'email"
                                />
                            </Field>

                            {/* Message — éditeur riche */}
                            <Field
                                label="Message"
                                required
                                hint="Mise en forme simple : gras, italique, listes, liens."
                            >
                                <div className="quill-observatory overflow-hidden rounded-lg border border-[#D6D9D8]">
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
                                            modules={QUILL_MODULES}
                                            formats={QUILL_FORMATS}
                                            placeholder="Écrivez votre message..."
                                            className="bg-white [&_.ql-container]:min-h-[220px] [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[#D6D9D8]"
                                        />
                                    </Suspense>
                                </div>
                            </Field>

                            {/* Pièces jointes */}
                            <Field label="Pièces jointes">
                                <label
                                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#D6D9D8] px-4 py-6 text-[13px] text-[#5B6462] transition hover:border-[#BF5429] hover:bg-[#BF5429]/5 ${
                                        attachments.length >= MAX_FILES
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }`}
                                >
                                    <Paperclip size={15} strokeWidth={2} />
                                    Cliquez pour ajouter des fichiers (max{" "}
                                    {MAX_FILES}, 10 Mo chacun)
                                    <input
                                        ref={attachInputRef}
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
                                                className="flex items-center justify-between rounded-lg border border-[#D6D9D8] px-3 py-2"
                                            >
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <FileText
                                                        size={15}
                                                        strokeWidth={2}
                                                        className="shrink-0 text-[#8A9290]"
                                                    />

                                                    <span className="truncate text-[13px] text-[#1f2d2d]">
                                                        {file.name}
                                                    </span>

                                                    <span className="shrink-0 text-[12px] text-[#8A9290]">
                                                        {formatSize(file.size)}
                                                    </span>
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAttachment(index)
                                                    }
                                                    aria-label={`Retirer ${file.name}`}
                                                    className="shrink-0 text-[#8A9290] transition hover:text-[#B3261E]"
                                                >
                                                    <X size={15} strokeWidth={2} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Field>

                            <div className="rounded-lg bg-[#BF5429]/5 p-4 text-[13px] text-[#5B6462]">
                                Chaque contact recevra un email individuel —{" "}
                                <strong className="text-[#1f2d2d]">
                                    {selectedIds.length}
                                </strong>{" "}
                                envoi(s) au total.
                            </div>
                        </div>

                        <div className={MODAL_FOOTER}>
                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] disabled:opacity-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={sendingEmail}
                                className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:cursor-not-allowed disabled:opacity-50"
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