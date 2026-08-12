import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Globe2, Calendar, Building2, FileText, ImageOff } from "lucide-react";

export default function Show({ partner }) {
    return (
        <AdminLayout>
            <Head title={`Partenaire - ${partner.name}`} />

            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Partenaires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Détails du partenaire
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Consulter les informations du partenaire.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("partners.edit", partner.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>

                        <Link
                            href={route("partners.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                    </div>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    <div className="flex items-center gap-4 border-b border-[#EAECE9] px-6 py-5">
                        {partner.logo ? (
                            <img
                                src={`/storage/${partner.logo}`}
                                alt={partner.name}
                                className="h-12 w-12 rounded-lg border border-[#D6D9D8] object-contain"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] text-[#8A9290]">
                                <ImageOff size={16} strokeWidth={1.8} />
                            </div>
                        )}
                        <h2 className="font-display text-xl text-[#1f2d2d]">
                            {partner.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        {/* Name */}
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Nom du partenaire
                            </p>
                            <p className="text-[15px] font-semibold text-[#1f2d2d]">
                                {partner.name}
                            </p>
                        </div>

                        {/* Type */}
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                <Building2 size={12} strokeWidth={2} />
                                Type
                            </p>
                            <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[12px] font-medium text-[#324949]">
                                {partner.type}
                            </span>
                        </div>

                        {/* Website */}
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                <Globe2 size={12} strokeWidth={2} />
                                Site web
                            </p>
                            {partner.website ? (
                                <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[14px] text-[#BF5429] hover:underline"
                                >
                                    {partner.website}
                                </a>
                            ) : (
                                <span className="text-[14px] text-[#8A9290]">
                                    Aucun site web
                                </span>
                            )}
                        </div>

                        {/* Created */}
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                <Calendar size={12} strokeWidth={2} />
                                Créé le
                            </p>
                            <p className="text-[14px] text-[#1f2d2d]">
                                {new Date(partner.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Logo */}
                        <div>
                            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                Logo
                            </p>
                            {partner.logo ? (
                                <img
                                    src={`/storage/${partner.logo}`}
                                    alt={partner.name}
                                    className="h-40 w-40 rounded-xl border border-[#D6D9D8] object-contain"
                                />
                            ) : (
                                <div className="flex h-40 w-40 items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#D6D9D8] text-[13px] text-[#8A9290]">
                                    <ImageOff size={16} strokeWidth={1.8} />
                                    Aucun logo
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                <FileText size={12} strokeWidth={2} />
                                Description
                            </p>
                            <div className="rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-4">
                                {partner.description ? (
                                    <p className="text-[14px] leading-7 text-[#324949]">
                                        {partner.description}
                                    </p>
                                ) : (
                                    <span className="text-[14px] text-[#8A9290]">
                                        Aucune description disponible.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}