import { lazy, Suspense, useEffect, useMemo, useRef, useState,useCallback } from "react";
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
} from "lucide-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
 * applique le style au clic puis le retire aussitôt — c'est
 * exactement le bug "les couleurs ne marchent pas" : le bouton
 * existe dans la toolbar mais son format est absent de formats.
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

/* Limites alignées avec la validation Laravel */
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

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

export default function Index({ contacts, flash, filters }) {
    /* =====================================================
       State
    ===================================================== */

    const [selectedIds, setSelectedIds] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const [importing, setImporting] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    
const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);
const [fetchingAllIds, setFetchingAllIds] = useState(false);


const totalContactsCount = contacts?.meta?.total ?? contacts?.total ?? contactData.length;

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
        toast.fire({ icon: "error", title: "Impossible de récupérer tous les contacts" });
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

    setSelectAllAcrossPages(false); // ← زيد هاد السطر
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

    setSelectAllAcrossPages(false); // ← زيد هاد السطر
};

        // Initialisé depuis les query params renvoyés par le serveur
    const [search, setSearch] = useState(filters?.search ?? "");
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? "all");


    /* =====================================================
       Recherche serveur avec debounce (350ms)
    ===================================================== */

    const debounceRef = useRef(null);

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

    const [form, setForm] = useState({
        name: "",
        organisation: "",
        role: "",
        gender: "",
        email: "",
        phone: "",
        status: "pending",
    });

    const [emailForm, setEmailForm] = useState({
        subject: "",
        message: "",
    });

    const [attachments, setAttachments] = useState([]);

    const importInputRef = useRef(null);
    const attachInputRef = useRef(null);

    const contactData = contacts?.data || [];

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
       Search + Filter
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
       Add contact
    ===================================================== */

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleAddContact = (event) => {
        event.preventDefault();

        router.post(route("admin.observatory-contacts.store"), form, {
            preserveScroll: true,

            onSuccess: () => {
                setForm({
                    name: "",
                    organisation: "",
                    role: "",
                    gender:"",
                    email: "",
                    phone: "",
                    status: "pending",
                });

                setShowAddModal(false);

                toast.fire({ icon: "success", title: "Contact ajouté" });
            },

            onError: (errors) => {
                Swal.fire({
                    ...swalTheme,
                    icon: "error",
                    title: "Formulaire invalide",
                    html: Object.values(errors).join("<br/>"),
                    confirmButtonText: "Corriger",
                });
            },
        });
    };

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
                    (item) =>
                        item.name === file.name && item.size === file.size
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

    const inputClass =
        "w-full rounded-lg border border-[#D6D9D8] px-3 py-2.5 text-[13.5px] text-[#1f2d2d] outline-none transition placeholder:text-[#8A9290] focus:border-[#BF5429] focus:ring-1 focus:ring-[#BF5429]/30";

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
            <Loader2 size={12} strokeWidth={2} className="animate-spin" />
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
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-[13.5px] font-medium shadow-sm transition ${
            selectAllAcrossPages
                ? "border-[#BF5429] bg-[#BF5429]/5 text-[#BF5429] hover:bg-[#BF5429]/10"
                : "border-[#D6D9D8] bg-white text-[#1f2d2d] hover:bg-[#F7F8F7]"
        }`}
    >
        {fetchingAllIds ? (
            <Loader2 size={12} strokeWidth={2} className="animate-spin" />
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
        {selectedIds.length > 0 && <span>({selectedIds.length})</span>}
    </button>

    <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
    >
        <Plus size={12} strokeWidth={2} />
        Ajouter  contact
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
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Rechercher un nom, email, organisation..."
                                className={`${inputClass} pl-9 pr-9`}
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
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
                                <strong>{selectedIds.length}</strong> contact(s) sélectionné(s)
                                {allVisibleSelected && !selectAllAcrossPages && totalContactsCount > visibleIds.length && (
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
                                                        toggleContact(
                                                            contact.id
                                                        )
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
                                                {contact.gender=== "H" ? "Homme" : contact.gender=== "F" ? "Femme" : "—"}
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
                                                {formatDate(
                                                    contact.registered_at
                                                )}
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {formatDate(
                                                    contact.approved_at
                                                )}
                                            </td>

                                            <td
                                                className={`${tdClass} whitespace-nowrap`}
                                            >
                                                {formatDate(
                                                    contact.rejected_at
                                                )}
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
                                        <td
                                            colSpan="11"
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2 text-[#8A9290]">
                                                <Users
                                                    size={24}
                                                    strokeWidth={1.6}
                                                />

                                                <p className="text-[13px]">
                                                    Aucun contact ne correspond
                                                    à cette recherche.
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
                Add Contact Modal
            ================================================= */}

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d2d]/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-[#D6D9D8] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#D6D9D8] px-6 py-4">
                            <div>
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                    Nouveau
                                </p>

                                <h2 className="font-display text-lg text-[#1f2d2d]">
                                    Ajouter un contact
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-[#8A9290] transition hover:text-[#1f2d2d]"
                            >
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddContact}
                            className="space-y-4 p-6"
                        >
                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Nom *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    required
                                    className={inputClass}
                                    placeholder="Nom complet"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Organisation
                                </label>

                                <input
                                    type="text"
                                    name="organisation"
                                    value={form.organisation}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="Organisation"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Rôle
                                </label>

                                <input
                                    type="text"
                                    name="role"
                                    value={form.role}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="Rôle"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Genre
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                >
                                    <option value="">Sélectionnez un genre</option>
                                    <option value="H">Homme</option>
                                    <option value="F">Femme</option>
                                </select>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        className={inputClass}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                        Téléphone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        className={inputClass}
                                        placeholder="+212..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Statut
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                >
                                    <option value="pending">En attente</option>
                                    <option value="approved">Approuvé</option>
                                    <option value="rejected">Rejeté</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-[#D6D9D8] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-lg border border-[#D6D9D8] px-4 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7]"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                                >
                                    <Plus size={15} strokeWidth={2} />
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =================================================
                Email Modal (Quill + pièces jointes)
            ================================================= */}

            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1f2d2d]/40 p-4">
                    <div className="my-8 w-full max-w-2xl rounded-2xl border border-[#D6D9D8] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#D6D9D8] px-6 py-4">
                            <div>
                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                    Diffusion
                                </p>

                                <h2 className="font-display text-lg text-[#1f2d2d]">
                                    Envoyer un email
                                </h2>

                                <p className="mt-1 text-[13px] text-[#5B6462]">
                                    {selectedIds.length} contact(s)
                                    sélectionné(s)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                className="text-[#8A9290] transition hover:text-[#1f2d2d]"
                            >
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSendEmail}
                            className="space-y-5 p-6"
                        >
                            {/* Sujet */}
                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Sujet *
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={emailForm.subject}
                                    onChange={handleEmailChange}
                                    required
                                    className={inputClass}
                                    placeholder="Sujet de l'email"
                                />
                            </div>

                            {/* Message — éditeur riche */}
                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Message *
                                </label>

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
                                                                                className="bg-white [&_.ql-container]:min-h-[260px] [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[#D6D9D8]"
                                        />
                                    </Suspense>
                                </div>

                                <p className="mt-1.5 text-[12px] text-[#8A9290]">
                                    Mise en forme simple : gras, italique,
                                    listes, liens.
                                </p>
                            </div>

                            {/* Pièces jointes */}
                            <div>
                                <label className="mb-1.5 block text-[13px] font-medium text-[#1f2d2d]">
                                    Pièces jointes
                                </label>

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
                                                    className="shrink-0 text-[#8A9290] transition hover:text-[#B3261E]"
                                                >
                                                    <X
                                                        size={15}
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="rounded-lg bg-[#BF5429]/5 p-4 text-[13px] text-[#5B6462]">
                                Chaque contact recevra un email individuel —{" "}
                                <strong className="text-[#1f2d2d]">
                                    {selectedIds.length}
                                </strong>{" "}
                                envoi(s) au total.
                            </div>

                            <div className="flex justify-end gap-2 border-t border-[#D6D9D8] pt-4">
                                <button
                                    type="button"
                                    onClick={closeEmailModal}
                                    disabled={sendingEmail}
                                    className="rounded-lg border border-[#D6D9D8] px-4 py-2.5 text-[13.5px] font-medium text-[#5B6462] transition hover:bg-[#F7F8F7] disabled:opacity-50"
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

                                    {sendingEmail ? "Envoi..." : "Envoyer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}