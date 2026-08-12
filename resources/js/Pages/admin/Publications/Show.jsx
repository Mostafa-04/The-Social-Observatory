import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    BookOpen,
    Hash,
    Languages,
    Calendar,
    FileText,
    ExternalLink,
    Clock,
} from "lucide-react";

export default function Show({ publication }) {
    return (
        <AdminLayout>
            <Head title={publication.title} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Publications
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {publication.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Détails de la publication.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("publications.edit", publication.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>

                        <Link
                            href={route("publications.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {/* Cover Image */}
                    {publication.cover_image && (
                        <img
                            src={`/storage/${publication.cover_image}`}
                            alt={publication.title}
                            className="h-96 w-full object-cover"
                        />
                    )}

                    <div className="space-y-8 p-8">
                        {/* Information */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    Titre
                                </h3>
                                <p className="text-[15px] font-semibold text-[#1f2d2d]">
                                    {publication.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <BookOpen size={12} strokeWidth={2} />
                                    Type
                                </h3>
                                <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[12px] font-medium text-[#324949]">
                                    {publication.type}
                                </span>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Hash size={12} strokeWidth={2} />
                                    Pages
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{publication.pages || "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Languages size={12} strokeWidth={2} />
                                    Langue
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{publication.language}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Calendar size={12} strokeWidth={2} />
                                    Publié le
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">
                                    {publication.published_at
                                        ? new Date(publication.published_at).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 flex items-center gap-1.5 font-display text-lg text-[#1f2d2d]">
                                Description
                            </h3>
                            <div className="whitespace-pre-wrap rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-5 text-[14px] leading-7 text-[#324949]">
                                {publication.description || (
                                    <span className="text-[#8A9290]">Aucune description</span>
                                )}
                            </div>
                        </div>

                        {/* PDF */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Fichier PDF
                            </h3>

                            {publication.pdf ? (
                                <a
                                    href={`/storage/${publication.pdf}`}
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
                                    {new Date(publication.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Mis à jour le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(publication.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}