import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    Search,
    FileText,
    User,
    Building2,
    Mail,
    Paperclip,
    Send,
    Loader2,
    X,
} from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";

/**
 * Page admin — liste des soumissions IAPS.
 * Attendu depuis le contrôleur (Inertia::render):
 * - submissions: paginator Laravel { data: [...], links: [...], total... }
 * - filters: { search, participant_type }
 */

const BRAND_COLOR = "#bf5429";
const MAX_FILES = 10;
const MAX_FILE_MB = 10;

const TYPE_LABELS = {
    individual: "Personne physique",
    organization: "Personne morale",
};

/* ---------- SweetAlert2 ---------- */

const alertSuccess = (text) =>
    Swal.fire({
        icon: "success",
        title: "Envoi lancé",
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

/* ---------- Utilitaires ---------- */

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

// Pas d'alignement : les classes Quill (ql-align-*) ne sont pas rendues dans un email
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

function ParticipantBadge({ type }) {
    if (type === "organization") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2d2d]/10 px-3 py-1 text-xs font-medium text-[#1f2d2d]">
                <Building2 className="h-3.5 w-3.5" />
                Personne morale
            </span>
        );
    }

    if (type === "individual") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#bf5429]/10 px-3 py-1 text-xs font-medium text-[#bf5429]">
                <User className="h-3.5 w-3.5" />
                Personne physique
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-[#e4e7e5] px-3 py-1 text-xs font-medium text-[#78807e]">
            Non renseigné
        </span>
    );
}

export default function IapsSubmissionsIndex({ submissions, filters }) {
    /* Filtres saisis (pas encore appliqués) */
    const [search, setSearch] = useState(filters?.search ?? "");
    const [participantType, setParticipantType] = useState(
        filters?.participant_type ?? ""
    );

    /* Filtres réellement appliqués (ceux de la liste affichée) */
    const appliedSearch = filters?.search ?? "";
    const appliedType = filters?.participant_type ?? "";

    /*
     * Sélection :
     * - selectAll = false -> seuls les ids de selectedIds sont concernés
     * - selectAll = true  -> tous les résultats du filtre, sauf excludedIds
     */
    const [selectedIds, setSelectedIds] = useState([]);
    const [excludedIds, setExcludedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    /* Email */
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailFiles, setEmailFiles] = useState([]);
    const [sendingEmail, setSendingEmail] = useState(false);

    const rows = submissions?.data ?? [];
    const links = submissions?.links ?? [];
    const total = submissions?.total ?? rows.length;

    /* ---------- Valeurs calculées ---------- */

    const isRowChecked = (id) =>
        selectAll ? !excludedIds.includes(id) : selectedIds.includes(id);

    const allPageSelected =
        rows.length > 0 && rows.every((s) => isRowChecked(s.id));

    const somePageSelected = rows.some((s) => isRowChecked(s.id));

    const selectedCount = selectAll
        ? total - excludedIds.length
        : selectedIds.length;

    const hasSelection = selectedCount > 0;

    const typeSuffix = appliedType ? ` (${TYPE_LABELS[appliedType]})` : "";

    /* ---------- Sélection ---------- */

    const clearSelection = () => {
        setSelectAll(false);
        setSelectedIds([]);
        setExcludedIds([]);
    };

    const selectEverything = () => {
        setSelectAll(true);
        setSelectedIds([]);
        setExcludedIds([]);
    };

    // Checkbox du header : agit uniquement sur la page courante
    const togglePage = (checked) => {
        const ids = rows.map((s) => s.id);

        if (selectAll) {
            setExcludedIds((cur) =>
                checked
                    ? cur.filter((id) => !ids.includes(id))
                    : [...new Set([...cur, ...ids])]
            );
            return;
        }

        setSelectedIds((cur) =>
            checked
                ? [...new Set([...cur, ...ids])]
                : cur.filter((id) => !ids.includes(id))
        );
    };

    const toggleRow = (id, checked) => {
        if (selectAll) {
            setExcludedIds((cur) =>
                checked ? cur.filter((x) => x !== id) : [...cur, id]
            );
        } else {
            setSelectedIds((cur) =>
                checked ? [...cur, id] : cur.filter((x) => x !== id)
            );
        }
    };

    /* ---------- Filtres ---------- */

    const applyFilters = (next = {}) => {
        const nextSearch = next.search ?? search;
        const nextType = next.type ?? participantType;

        // Le filtre change l'ensemble des résultats : on repart de zéro
        clearSelection();

        router.get(
            route("iaps-submissions.index"),
            {
                search: nextSearch || undefined,
                participant_type: nextType || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setParticipantType("");
        clearSelection();

        router.get(
            route("iaps-submissions.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    /* ---------- Email ---------- */

    const openEmailModal = () => {
        if (!hasSelection) {
            alertWarning("Veuillez sélectionner au moins une soumission.");
            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (sendingEmail) return;
        setShowEmailModal(false);
    };

    const handleFiles = (e) => {
        const picked = Array.from(e.target.files || []);
        e.target.value = ""; // permet de re-sélectionner le même fichier

        if (emailFiles.length + picked.length > MAX_FILES) {
            alertWarning(`Vous pouvez joindre ${MAX_FILES} fichiers au maximum.`);
            return;
        }

        const tooBig = picked.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);

        if (tooBig) {
            alertWarning(
                `« ${tooBig.name} » dépasse la taille maximale de ${MAX_FILE_MB} Mo.`
            );
            return;
        }

        setEmailFiles((cur) => [...cur, ...picked]);
    };

    const removeFile = (index) => {
        setEmailFiles((cur) => cur.filter((_, i) => i !== index));
    };

    const sendEmail = async () => {
        if (!emailSubject.trim()) {
            alertWarning("Veuillez saisir l'objet du message.");
            return;
        }

        if (!stripHtml(emailMessage)) {
            alertWarning("Veuillez saisir le message.");
            return;
        }

        if (!hasSelection) {
            alertWarning("Veuillez sélectionner au moins une soumission.");
            return;
        }

        const formData = new FormData();

        formData.append("subject", emailSubject);
        formData.append("message", emailMessage);
        formData.append("select_all", selectAll ? "1" : "0");

        if (selectAll) {
            // Filtres APPLIQUÉS (ceux de la liste), pas ceux en cours de saisie
            if (appliedSearch) formData.append("search", appliedSearch);
            if (appliedType) formData.append("participant_type", appliedType);

            excludedIds.forEach((id) =>
                formData.append("excluded_submissions[]", id)
            );
        } else {
            selectedIds.forEach((id) => formData.append("submissions[]", id));
        }

        emailFiles.forEach((file) => formData.append("files[]", file));

        setSendingEmail(true);

        try {
            const { data } = await axios.post(
                route("iaps-submissions.send-email"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setShowEmailModal(false);
            setEmailSubject("");
            setEmailMessage("");
            setEmailFiles([]);
            clearSelection();

            alertSuccess(
                data?.message ||
                    "Les emails sont en cours d'envoi en arrière-plan."
            );
        } catch (error) {
            console.error(error);

            const errors = error?.response?.data?.errors;
            const firstError = errors ? Object.values(errors)[0]?.[0] : null;

            alertError(
                firstError ||
                    (error?.response?.status === 413
                        ? "Les fichiers sont trop volumineux."
                        : error?.response?.data?.message) ||
                    "Une erreur est survenue lors de l'envoi de l'email.",
                "Échec de l'envoi"
            );
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Soumissions IAPS" />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                            Soumissions IAPS
                        </h1>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Contributions reçues via le formulaire de
                            co-construction de l'Indice Africain du Progrès
                            Social.
                        </p>
                    </div>

                    {hasSelection && (
                        <button
                            type="button"
                            onClick={openEmailModal}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            <Mail className="h-4 w-4" />
                            Envoyer un email ({selectedCount})
                        </button>
                    )}
                </div>

                {/* FILTRES */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                    }}
                    className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#dfe3e0] bg-white p-4 md:flex-row md:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un nom, un e-mail, une entité..."
                            className="w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-10 pr-4 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                        />
                    </div>

                    <select
                        value={participantType}
                        onChange={(e) => {
                            setParticipantType(e.target.value);
                            // Application immédiate : permet « tout sélectionner » par type
                            applyFilters({ type: e.target.value });
                        }}
                        className="rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                    >
                        <option value="">Tous les types</option>
                        <option value="individual">Personne physique</option>
                        <option value="organization">Personne morale</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            Filtrer
                        </button>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </form>

                {/* BARRE DE SÉLECTION */}
                <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#dfe3e0] bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {!selectAll && total > 0 && (
                            <button
                                type="button"
                                onClick={selectEverything}
                                className="rounded-xl border border-[#bf5429] bg-white px-4 py-2 text-sm font-semibold text-[#bf5429] transition hover:bg-[#bf5429]/5"
                            >
                                Tout sélectionner : {total} soumission(s)
                                {typeSuffix}
                            </button>
                        )}

                        {hasSelection && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="rounded-xl border border-[#d6d9d8] bg-white px-4 py-2 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                            >
                                Annuler la sélection
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-[#68706e]">
                        {selectAll ? (
                            <span className="font-medium text-[#bf5429]">
                                Toutes les soumissions{typeSuffix} sont
                                sélectionnées
                                {excludedIds.length > 0 &&
                                    ` (sauf ${excludedIds.length})`}
                                .
                            </span>
                        ) : (
                            `${selectedIds.length} sélectionnée(s)`
                        )}
                    </p>
                </div>

                {/* TABLEAU */}
                <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f6f7f5] text-xs uppercase tracking-wide text-[#78807e]">
                                <tr>
                                    <th className="w-12 px-5 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={allPageSelected}
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate =
                                                        somePageSelected &&
                                                        !allPageSelected;
                                                }
                                            }}
                                            onChange={(e) =>
                                                togglePage(e.target.checked)
                                            }
                                            className="h-4 w-4 rounded border-[#d6d9d8] text-[#bf5429] focus:ring-[#bf5429]"
                                        />
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Contributeur
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Genre
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Type
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Publication
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Reçue le
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
                                            Aucune soumission ne correspond à
                                            ces critères.
                                        </td>
                                    </tr>
                                )}

                                {rows.map((submission) => {
                                    const checked = isRowChecked(submission.id);

                                    return (
                                        <tr
                                            key={submission.id}
                                            className={`transition ${
                                                checked
                                                    ? "bg-[#bf5429]/5"
                                                    : "hover:bg-[#f6f7f5]"
                                            }`}
                                        >
                                            <td className="px-5 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        toggleRow(
                                                            submission.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-[#d6d9d8] text-[#bf5429] focus:ring-[#bf5429]"
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="font-medium text-[#263333]">
                                                    {submission.entity_name ||
                                                        submission.full_name}
                                                </div>
                                                <div className="text-xs text-[#78807e]">
                                                    {submission.email}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {submission.gender === "H" ? "Homme" : submission.gender === "F" ? "Femme" : "Non spécifié"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <ParticipantBadge
                                                    type={
                                                        submission.participant_type
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-[#bf5429]" />
                                                    {submission.publication
                                                        ?.title ?? "—"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-[#68706e]">
                                                {formatDate(
                                                    submission.created_at
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "iaps-submissions.show",
                                                        submission.id
                                                    )}
                                                    className="whitespace-nowrap text-sm font-semibold text-[#bf5429] hover:text-[#a94320]"
                                                >
                                                    Voir le détail
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION (preserveState : la sélection est conservée entre les pages) */}
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
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-[#e4e7e5] px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                    Envoyer un email
                                </h2>

                                <p className="mt-1 text-sm text-[#78807e]">
                                    {selectedCount} soumission(s) sélectionnée(s)
                                    {selectAll && typeSuffix}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-lg p-2 text-[#78807e] transition hover:bg-[#f6f7f5] hover:text-[#263333]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="overflow-y-auto px-6 py-5">
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Objet
                                </label>

                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) =>
                                        setEmailSubject(e.target.value)
                                    }
                                    placeholder="Objet de l'email"
                                    className="w-full rounded-xl border border-[#d6d9d8] px-4 py-3 text-sm outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Message
                                </label>

                                <div className="overflow-hidden rounded-xl border border-[#d6d9d8]">
                                    <ReactQuill
                                        theme="snow"
                                        value={emailMessage}
                                        onChange={setEmailMessage}
                                        modules={quillModules}
                                        placeholder="Écrivez votre message..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Fichiers / Images
                                </label>

                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d6d9d8] px-4 py-4 text-sm text-[#68706e] transition hover:border-[#bf5429] hover:bg-[#bf5429]/5">
                                    <Paperclip className="h-5 w-5 text-[#bf5429]" />

                                    <span>
                                        Ajouter des fichiers ou images (max{" "}
                                        {MAX_FILES} fichiers, {MAX_FILE_MB} Mo
                                        chacun)
                                    </span>

                                    <input
                                        type="file"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                                        onChange={handleFiles}
                                        className="hidden"
                                    />
                                </label>

                                {emailFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {emailFiles.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between rounded-lg bg-[#f6f7f5] px-3 py-2 text-sm"
                                            >
                                                <span className="truncate text-[#263333]">
                                                    {file.name}
                                                </span>

                                                <div className="ml-3 flex shrink-0 items-center gap-3">
                                                    <span className="text-xs text-[#78807e]">
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeFile(index)
                                                        }
                                                        disabled={sendingEmail}
                                                        className="rounded p-1 text-[#78807e] transition hover:bg-white hover:text-[#bf5429]"
                                                        aria-label={`Retirer ${file.name}`}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex items-center justify-end gap-3 border-t border-[#e4e7e5] px-6 py-4">
                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] disabled:opacity-60"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={sendEmail}
                                disabled={sendingEmail}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {sendingEmail ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
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