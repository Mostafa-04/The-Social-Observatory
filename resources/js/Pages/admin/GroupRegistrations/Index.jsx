import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Users,
    ExternalLink,
    Loader2,
    Upload,
    X,
    FileSpreadsheet,
    Mail,
    Paperclip,
} from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * Page admin — liste des inscriptions aux groupes de travail.
 * Attendu depuis le contrôleur (Inertia::render):
 * - registrations: paginator Laravel { data: [...], links: [...], total }
 * - filters: { search, group_type }
 * - groups: { jeunesse: "Groupe de Travail 1 — ...", femmes: "...", ... }
 */

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const GROUP_COLORS = {
    jeunesse: "bg-[#bf5429]/10 text-[#bf5429]",
    femmes: "bg-[#1f2d2d]/10 text-[#1f2d2d]",
    vieillissement: "bg-[#324949]/10 text-[#324949]",
    pacte: "bg-[#78807e]/10 text-[#5f6967]",
};

function GroupBadge({ type, groups }) {
    const colorClass = GROUP_COLORS[type] ?? "bg-[#e4e7e5] text-[#78807e]";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
        >
            <Users className="h-3.5 w-3.5" />
            {groups?.[type] ?? type}
        </span>
    );
}

export default function GroupRegistrationsIndex({
    registrations,
    filters,
    groups,
}) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [groupType, setGroupType] = useState(filters?.group_type ?? "");

    // Import Excel
    const [showImportModal, setShowImportModal] = useState(false);
    const [excelFile, setExcelFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    // Sélection pour l'envoi d'email
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllMatching, setSelectAllMatching] = useState(false);

    // Modal d'envoi d'email
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailAttachments, setEmailAttachments] = useState([]);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const rows = registrations?.data ?? [];
    const links = registrations?.links ?? [];
    const total = registrations?.total ?? rows.length;

    // La sélection est réinitialisée quand les filtres/la page changent,
    // pour éviter de garder des IDs qui ne sont plus visibles.
    useEffect(() => {
        setSelectedIds([]);
        setSelectAllMatching(false);
    }, [rows.map((r) => r.id).join(",")]);

    const allCurrentPageSelected =
        rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

    const recipientsCount = selectAllMatching ? total : selectedIds.length;

    const toggleRow = (id) => {
        setSelectAllMatching(false);
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleCurrentPage = () => {
        setSelectAllMatching(false);

        if (allCurrentPageSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !rows.some((r) => r.id === id))
            );
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...rows
                    .map((r) => r.id)
                    .filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const applyFilters = (e) => {
        e?.preventDefault();

        router.get(
            route("group-registrations.index"),
            {
                search: search || undefined,
                group_type: groupType || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setGroupType("");

        router.get(
            route("group-registrations.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    // --- Import Excel ---------------------------------------------------

    const handleImportExcel = (e) => {
        e.preventDefault();

        if (!excelFile) {
            Swal.fire({
                icon: "warning",
                title: "Fichier manquant",
                text: "Veuillez sélectionner un fichier Excel.",
                confirmButtonColor: "#bf5429",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", excelFile);

        setIsImporting(true);

        router.post(route("group-registrations.import"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setShowImportModal(false);
                setExcelFile(null);

                Swal.fire({
                    icon: "success",
                    title: "Importation réussie",
                    html: `
                        <p>Les inscriptions ont été importées avec succès.</p>
                        ${
                            page.props.flash?.imported_count !== undefined
                                ? `<p style="margin-top:8px;font-weight:600;">
                                    Nombre total enregistré :
                                    ${page.props.flash.imported_count}
                                </p>`
                                : ""
                        }
                    `,
                    confirmButtonColor: "#bf5429",
                });
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors ?? {})
                    .flat()
                    .join("<br>");

                Swal.fire({
                    icon: "error",
                    title: "Erreur d'importation",
                    html:
                        errorMessages ||
                        "Une erreur est survenue lors de l'importation du fichier.",
                    confirmButtonColor: "#bf5429",
                });
            },
            onFinish: () => setIsImporting(false),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setExcelFile(null);
            return;
        }

        const allowedExtensions = ["xlsx", "xls"];
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            alert("Veuillez sélectionner un fichier Excel (.xlsx ou .xls).");
            e.target.value = "";
            setExcelFile(null);
            return;
        }

        setExcelFile(file);
    };

    // --- Envoi d'email groupé -------------------------------------------

    const openEmailModal = () => {
        if (recipientsCount === 0) {
            Swal.fire({
                icon: "warning",
                title: "Aucune sélection",
                text: "Sélectionnez au moins un·e candidat·e avant d'envoyer un e-mail.",
                confirmButtonColor: "#bf5429",
            });
            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (isSendingEmail) return;
        setShowEmailModal(false);
        setEmailSubject("");
        setEmailMessage("");
        setEmailAttachments([]);
    };

    const handleEmailAttachmentsChange = (e) => {
        setEmailAttachments(Array.from(e.target.files ?? []));
    };

    const removeAttachment = (index) => {
        setEmailAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSendEmail = (e) => {
        e.preventDefault();

        if (!emailSubject.trim() || !emailMessage.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Champs manquants",
                text: "Merci de renseigner l'objet et le message.",
                confirmButtonColor: "#bf5429",
            });
            return;
        }

        const formData = new FormData();
        formData.append("subject", emailSubject);
        formData.append("message", emailMessage);
        formData.append("select_all", selectAllMatching ? "1" : "0");

        if (selectAllMatching) {
            if (search) formData.append("search", search);
            if (groupType) formData.append("group_type", groupType);
        } else {
            selectedIds.forEach((id) => formData.append("ids[]", id));
        }

        emailAttachments.forEach((file) =>
            formData.append("attachments[]", file)
        );

        setIsSendingEmail(true);

        router.post(route("group-registrations.send-email"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                closeEmailModal();
                setSelectedIds([]);
                setSelectAllMatching(false);

                Swal.fire({
                    icon: "success",
                    title: "E-mails envoyés",
                    html: `
                        <p>Les e-mails ont été mis en file d'attente avec succès.</p>
                        ${
                            page.props.flash?.sent_count !== undefined
                                ? `<p style="margin-top:8px;font-weight:600;">
                                    Destinataires : ${page.props.flash.sent_count}
                                </p>`
                                : ""
                        }
                    `,
                    confirmButtonColor: "#bf5429",
                });
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors ?? {})
                    .flat()
                    .join("<br>");

                Swal.fire({
                    icon: "error",
                    title: "Erreur d'envoi",
                    html:
                        errorMessages ||
                        "Une erreur est survenue lors de l'envoi des e-mails.",
                    confirmButtonColor: "#bf5429",
                });
            },
            onFinish: () => setIsSendingEmail(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Inscriptions — Groupes de travail" />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                            Inscriptions aux groupes de travail
                        </h1>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Candidatures reçues pour rejoindre l'un des
                            quatre groupes de travail.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openEmailModal}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            <Mail className="h-4 w-4" />
                            Envoyer un email
                            {recipientsCount > 0 && (
                                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                    {recipientsCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f2d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#324949]"
                        >
                            <Upload className="h-4 w-4" />
                            Importer Excel
                        </button>
                    </div>
                </div>

                {/* FILTRES */}
                <form
                    onSubmit={applyFilters}
                    className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#dfe3e0] bg-white p-4 md:flex-row md:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un nom, un e-mail, un domaine d'expertise..."
                            className="w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-10 pr-4 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                        />
                    </div>

                    <select
                        value={groupType}
                        onChange={(e) => setGroupType(e.target.value)}
                        className="rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                    >
                        <option value="">Tous les groupes</option>
                        {Object.entries(groups ?? {}).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
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

                {/* BANDEAU "sélectionner tout" */}
                {allCurrentPageSelected && total > rows.length && (
                    <div className="mb-4 rounded-xl bg-[#bf5429]/10 px-4 py-3 text-sm text-[#7a3c1c]">
                        {selectAllMatching ? (
                            <>
                                Les {total} inscriptions correspondant aux
                                filtres actuels sont sélectionnées.{" "}
                                <button
                                    type="button"
                                    className="font-semibold underline"
                                    onClick={() => setSelectAllMatching(false)}
                                >
                                    Annuler la sélection
                                </button>
                            </>
                        ) : (
                            <>
                                Les {rows.length} inscriptions de cette page
                                sont sélectionnées.{" "}
                                <button
                                    type="button"
                                    className="font-semibold underline"
                                    onClick={() => setSelectAllMatching(true)}
                                >
                                    Sélectionner les {total} inscriptions
                                    correspondant aux filtres
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* TABLEAU */}
                <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f6f7f5] text-xs uppercase tracking-wide text-[#78807e]">
                            <tr>
                                <th className="w-10 px-5 py-3.5">
                                    <input
                                        type="checkbox"
                                        checked={allCurrentPageSelected}
                                        onChange={toggleCurrentPage}
                                        className="h-4 w-4 rounded border-[#d6d9d8] text-[#bf5429] focus:ring-[#bf5429]"
                                    />
                                </th>
                                <th className="px-5 py-3.5 font-medium">
                                    Candidat·e
                                </th>
                                <th className="px-5 py-3.5 font-medium">
                                    Genre
                                </th>
                                <th className="px-5 py-3.5 font-medium">
                                    Groupe
                                </th>
                                <th className="px-5 py-3.5 font-medium">
                                    Domaine d'expertise
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
                                        Aucune inscription ne correspond à
                                        ces critères.
                                    </td>
                                </tr>
                            )}

                            {rows.map((registration) => (
                                <tr
                                    key={registration.id}
                                    className="transition hover:bg-[#f6f7f5]"
                                >
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectAllMatching ||
                                                selectedIds.includes(
                                                    registration.id
                                                )
                                            }
                                            onChange={() =>
                                                toggleRow(registration.id)
                                            }
                                            className="h-4 w-4 rounded border-[#d6d9d8] text-[#bf5429] focus:ring-[#bf5429]"
                                        />
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="font-medium text-[#263333]">
                                            {registration.full_name}
                                        </div>
                                        <div className="text-xs text-[#78807e]">
                                            {registration.email}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        {registration.gender === 'H' ? 'Homme' : registration.gender === 'F' ? 'Femme' : 'Non spécifié'}
                                    </td>

                                    <td className="px-5 py-4">
                                        <GroupBadge
                                            type={registration.group_type}
                                            groups={groups}
                                        />
                                    </td>

                                    <td className="px-5 py-4 text-[#68706e]">
                                        {registration.expertise_domain ||
                                            "—"}
                                    </td>

                                    <td className="px-5 py-4 text-[#68706e]">
                                        {formatDate(registration.created_at)}
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            href={route(
                                                "group-registrations.show",
                                                registration.id
                                            )}
                                            className="text-sm font-semibold text-[#bf5429] hover:text-[#a94320]"
                                        >
                                            Voir le détail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {links.length > 3 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3.5 py-2 text-sm transition ${
                                    link.active
                                        ? "bg-[#bf5429] text-white"
                                        : link.url
                                        ? "bg-white text-[#263333] hover:bg-[#f0f2f0]"
                                        : "cursor-not-allowed bg-white text-[#c3c8c6]"
                                }`}
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL IMPORT EXCEL */}
            {showImportModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => {
                        if (!isImporting) {
                            setShowImportModal(false);
                            setExcelFile(null);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#e5e7e6] px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                    Importer des inscriptions
                                </h2>
                                <p className="mt-1 text-sm text-[#78807e]">
                                    Importez les inscriptions depuis un
                                    fichier Excel.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={isImporting}
                                onClick={() => {
                                    setShowImportModal(false);
                                    setExcelFile(null);
                                }}
                                className="rounded-lg p-2 text-[#78807e] transition hover:bg-[#f3f4f3] hover:text-[#1f2d2d]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImportExcel}>
                            <div className="space-y-5 px-6 py-6">
                                <label
                                    htmlFor="excel-file"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6d9d8] bg-[#fafbfa] px-6 py-10 text-center transition hover:border-[#bf5429] hover:bg-[#bf5429]/5"
                                >
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#bf5429]/10">
                                        <FileSpreadsheet className="h-7 w-7 text-[#bf5429]" />
                                    </div>

                                    {excelFile ? (
                                        <>
                                            <p className="text-sm font-semibold text-[#1f2d2d]">
                                                {excelFile.name}
                                            </p>
                                            <p className="mt-1 text-xs text-[#78807e]">
                                                {(
                                                    excelFile.size / 1024
                                                ).toFixed(1)}{" "}
                                                KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-[#1f2d2d]">
                                                Sélectionner un fichier Excel
                                            </p>
                                            <p className="mt-2 text-xs text-[#78807e]">
                                                Cliquez ici pour choisir
                                                votre fichier
                                            </p>
                                            <p className="mt-2 text-xs text-[#9aa19f]">
                                                Formats acceptés : .xlsx, .xls
                                            </p>
                                        </>
                                    )}

                                    <input
                                        id="excel-file"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>

                                <div className="rounded-xl bg-[#f6f7f5] p-4">
                                    <p className="text-xs font-semibold text-[#1f2d2d]">
                                        Colonnes attendues :
                                    </p>
                                    <p className="mt-2 text-xs leading-6 text-[#68706e]">
                                        Nom, Email, Groupe, LinkedIn,
                                        Présentation, Domaine, Expertise,
                                        Motivation, CV, Statut, Date
                                        d'inscription
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-[#e5e7e6] px-6 py-4">
                                <button
                                    type="button"
                                    disabled={isImporting}
                                    onClick={() => {
                                        setShowImportModal(false);
                                        setExcelFile(null);
                                    }}
                                    className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#263333] transition hover:bg-[#f6f7f5]"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={!excelFile || isImporting}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isImporting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Importation...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Importer
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ENVOI D'EMAIL */}
            {showEmailModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
                    onClick={closeEmailModal}
                >
                    <div
                        className="flex max-h-full w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#e5e7e6] px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                    Envoyer un e-mail
                                </h2>
                                <p className="mt-1 text-sm text-[#78807e]">
                                    {recipientsCount} destinataire
                                    {recipientsCount > 1 ? "s" : ""}{" "}
                                    sélectionné
                                    {recipientsCount > 1 ? "s" : ""}
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={isSendingEmail}
                                onClick={closeEmailModal}
                                className="rounded-lg p-2 text-[#78807e] transition hover:bg-[#f3f4f3] hover:text-[#1f2d2d]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSendEmail}
                            className="flex flex-1 flex-col overflow-hidden"
                        >
                            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#1f2d2d]">
                                        Objet
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) =>
                                            setEmailSubject(e.target.value)
                                        }
                                        placeholder="Objet de l'e-mail"
                                        className="w-full rounded-xl border border-[#d6d9d8] px-4 py-2.5 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#1f2d2d]">
                                        Message
                                    </label>
                                    <ReactQuill
                                        theme="snow"
                                        value={emailMessage}
                                        onChange={setEmailMessage}
                                        className="rounded-xl [&_.ql-container]:rounded-b-xl [&_.ql-toolbar]:rounded-t-xl"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#1f2d2d]">
                                        Pièces jointes (optionnel)
                                    </label>

                                    <label
                                        htmlFor="email-attachments"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d6d9d8] bg-[#fafbfa] px-4 py-4 text-sm text-[#68706e] transition hover:border-[#bf5429] hover:bg-[#bf5429]/5"
                                    >
                                        <Paperclip className="h-4 w-4" />
                                        Ajouter des fichiers
                                        <input
                                            id="email-attachments"
                                            type="file"
                                            multiple
                                            onChange={
                                                handleEmailAttachmentsChange
                                            }
                                            className="hidden"
                                        />
                                    </label>

                                    {emailAttachments.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {emailAttachments.map(
                                                (file, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center justify-between rounded-lg bg-[#f6f7f5] px-3 py-2 text-xs text-[#263333]"
                                                    >
                                                        <span className="truncate">
                                                            {file.name} (
                                                            {(
                                                                file.size / 1024
                                                            ).toFixed(1)}{" "}
                                                            KB)
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeAttachment(
                                                                    index
                                                                )
                                                            }
                                                            className="ml-3 text-[#78807e] hover:text-[#bf5429]"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-[#e5e7e6] px-6 py-4">
                                <button
                                    type="button"
                                    disabled={isSendingEmail}
                                    onClick={closeEmailModal}
                                    className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-2.5 text-sm font-semibold text-[#263333] transition hover:bg-[#f6f7f5]"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSendingEmail}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSendingEmail ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Envoi...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4" />
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