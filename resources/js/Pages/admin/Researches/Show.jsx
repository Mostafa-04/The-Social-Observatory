import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    Link2,
    User,
    FolderOpen,
    Flag,
    Calendar,
    FileText,
    ExternalLink,
    Clock,
} from "lucide-react";

const STATUS_STYLES = {
    published: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    draft: "bg-[#BF5429]/10 text-[#BF5429]",
};

const STATUS_LABELS = {
    published: "Publié",
    draft: "Brouillon",
};

export default function Show({ research }) {
    return (
        <AdminLayout>
            <Head title={research.title} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Recherches
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {research.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Détails de la recherche.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("researches.edit", research.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>

                        <Link
                            href={route("researches.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {/* Featured Image */}
                    {research.featured_image && (
                        <img
                            src={`/storage/${research.featured_image}`}
                            alt={research.title}
                            className="h-96 w-full object-cover"
                        />
                    )}

                    <div className="space-y-8 p-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Titre
                                </h3>
                                <p className="text-[15px] font-semibold text-[#1f2d2d]">
                                    {research.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Link2 size={12} strokeWidth={2} />
                                    Slug
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{research.slug}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <User size={12} strokeWidth={2} />
                                    Auteur
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{research.author?.name ?? "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <FolderOpen size={12} strokeWidth={2} />
                                    Catégorie
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{research.category?.name ?? "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Flag size={12} strokeWidth={2} />
                                    Statut
                                </h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                                        STATUS_STYLES[research.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                                    }`}
                                >
                                    {STATUS_LABELS[research.status] ?? research.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Calendar size={12} strokeWidth={2} />
                                    Publié le
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">
                                    {research.published_at
                                        ? new Date(research.published_at).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Résumé
                            </h3>
                            <div className="rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-5 text-[14px] leading-7 text-[#324949]">
                                {research.summary || (
                                    <span className="text-[#8A9290]">Aucun résumé</span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Contenu
                            </h3>
                            <div className="whitespace-pre-wrap rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-6 text-[14px] leading-7 text-[#324949]">
                                {research.content || (
                                    <span className="text-[#8A9290]">Aucun contenu</span>
                                )}
                            </div>
                        </div>

                        {/* PDF */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Fichier PDF
                            </h3>

                            {research.pdf ? (
                                <a
                                    href={`/storage/${research.pdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#324949] px-5 py-3 text-[13.5px] font-medium text-white transition hover:bg-[#243636]"
                                >
                                    <FileText size={15} strokeWidth={1.8} />
                                    Ouvrir le PDF
                                    <ExternalLink size={13} strokeWidth={1.8} />
                                </a>
                            ) : (
                                <p className="text-[13.5px] text-[#8A9290]">Aucun PDF téléversé.</p>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 gap-6 border-t border-[#EAECE9] pt-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Créé le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(research.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Mis à jour le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(research.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}