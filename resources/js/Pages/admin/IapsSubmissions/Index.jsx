import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Search, FileText, User, Building2 } from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";

/**
 * Page admin — liste des soumissions IAPS.
 * Attendu depuis le contrôleur (Inertia::render):
 * - submissions: paginator Laravel { data: [...], links: [...], meta/current_page... }
 * - filters: { search, participant_type }
 */

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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
    const [search, setSearch] = useState(filters?.search ?? "");
    const [participantType, setParticipantType] = useState(
        filters?.participant_type ?? ""
    );

    const applyFilters = (e) => {
        e?.preventDefault();

        router.get(
            route("iaps-submissions.index"),
            {
                search: search || undefined,
                participant_type: participantType || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setParticipantType("");

        router.get(
            route("iaps-submissions.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    const rows = submissions?.data ?? [];
    const links = submissions?.links ?? [];

    return (
        <AdminLayout>

            <Head title="Soumissions IAPS" />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                        Soumissions IAPS
                    </h1>

                    <p className="mt-2 text-sm text-[#68706e]">
                        Contributions reçues via le formulaire de
                        co-construction de l'Indice Africain du Progrès
                        Social.
                    </p>
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
                            placeholder="Rechercher un nom, un e-mail, une entité..."
                            className="w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-10 pr-4 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                        />
                    </div>

                    <select
                        value={participantType}
                        onChange={(e) => setParticipantType(e.target.value)}
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

                {/* TABLEAU */}
                <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f6f7f5] text-xs uppercase tracking-wide text-[#78807e]">
                            <tr>
                                <th className="px-5 py-3.5 font-medium">
                                    Contributeur
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
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-sm text-[#78807e]"
                                    >
                                        Aucune soumission ne correspond à
                                        ces critères.
                                    </td>
                                </tr>
                            )}

                            {rows.map((submission) => (
                                <tr
                                    key={submission.id}
                                    className="transition hover:bg-[#f6f7f5]"
                                >
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
