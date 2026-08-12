import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    Link2,
    FolderOpen,
    User,
    Flag,
    Calendar,
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

export default function Show({ insight }) {
    return (
        <AdminLayout>
            <Head title={insight.title} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Insights
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {insight.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Détails de l'insight.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("insights.edit", insight.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>

                        <Link
                            href={route("insights.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {/* Featured Image */}
                    {insight.featured_image && (
                        <img
                            src={`/storage/${insight.featured_image}`}
                            alt={insight.title}
                            className="h-96 w-full object-cover"
                        />
                    )}

                    <div className="space-y-8 p-8">
                        {/* Informations */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Titre
                                </h3>
                                <p className="text-[15px] font-semibold text-[#1f2d2d]">
                                    {insight.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Link2 size={12} strokeWidth={2} />
                                    Slug
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{insight.slug}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <FolderOpen size={12} strokeWidth={2} />
                                    Catégorie
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{insight.category?.name ?? "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <User size={12} strokeWidth={2} />
                                    Auteur
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{insight.author?.name ?? "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Flag size={12} strokeWidth={2} />
                                    Statut
                                </h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                                        STATUS_STYLES[insight.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                                    }`}
                                >
                                    {STATUS_LABELS[insight.status] ?? insight.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Calendar size={12} strokeWidth={2} />
                                    Publié le
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">
                                    {insight.published_at
                                        ? new Date(insight.published_at).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Extrait
                            </h3>
                            <div className="whitespace-pre-wrap rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-5 text-[14px] leading-7 text-[#324949]">
                                {insight.excerpt || (
                                    <span className="text-[#8A9290]">Aucun extrait</span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Contenu
                            </h3>
                            <div className="whitespace-pre-wrap rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-5 text-[14px] leading-7 text-[#324949]">
                                {insight.content || (
                                    <span className="text-[#8A9290]">Aucun contenu</span>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 gap-6 border-t border-[#EAECE9] pt-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Créé le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(insight.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Mis à jour le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(insight.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}