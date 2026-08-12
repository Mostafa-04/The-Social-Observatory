import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, MapPin, Handshake, Calendar, ImageOff } from "lucide-react";

const STATUS_STYLES = {
    planned: "bg-[#F7F8F6] text-[#5B6462]",
    ongoing: "bg-[#BF5429]/10 text-[#BF5429]",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-600",
};
const STATUS_LABELS = {
    planned: "Planifié",
    ongoing: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
};

function InfoBlock({ label, children, icon: Icon }) {
    return (
        <div>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                {Icon && <Icon size={12} strokeWidth={1.8} />}
                {label}
            </h3>
            <div className="text-[14px] text-[#1f2d2d]">{children}</div>
        </div>
    );
}

export default function Show({ project }) {
    return (
        <AdminLayout>
            <Head title={project.title} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Projets
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {project.title}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("projects.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                        <Link
                            href={route("projects.edit", project.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {/* Featured Image */}
                    {project.featured_image ? (
                        <img
                            src={`/storage/${project.featured_image}`}
                            alt={project.title}
                            className="h-80 w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-40 w-full items-center justify-center bg-[#F7F8F6] text-[#C6CBC8]">
                            <ImageOff size={28} strokeWidth={1.4} />
                        </div>
                    )}

                    <div className="space-y-8 p-8">
                        {/* Information */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <InfoBlock label="Statut">
                                <span className={`inline-block rounded-full px-3 py-1 text-[12.5px] font-medium ${STATUS_STYLES[project.status] || "bg-[#F7F8F6] text-[#5B6462]"}`}>
                                    {STATUS_LABELS[project.status] || project.status}
                                </span>
                            </InfoBlock>

                            <InfoBlock label="Pays" icon={MapPin}>
                                {project.country?.name ?? "—"}
                            </InfoBlock>

                            <InfoBlock label="Partenaire" icon={Handshake}>
                                {project.partner?.name ?? "—"}
                            </InfoBlock>

                            <InfoBlock label="Date de début" icon={Calendar}>
                                {project.start_date
                                    ? new Date(project.start_date).toLocaleDateString("fr-FR")
                                    : "—"}
                            </InfoBlock>

                            <InfoBlock label="Date de fin" icon={Calendar}>
                                {project.end_date
                                    ? new Date(project.end_date).toLocaleDateString("fr-FR")
                                    : "—"}
                            </InfoBlock>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="mb-3 font-display text-[17px] text-[#1f2d2d]">Description</h3>
                            <div className="rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] p-5 text-[14px] leading-relaxed text-[#324949] whitespace-pre-wrap">
                                {project.description}
                            </div>
                        </div>

                        {/* Objective */}
                        <div>
                            <h3 className="mb-3 font-display text-[17px] text-[#1f2d2d]">Objectif</h3>
                            <div className="rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] p-5 text-[14px] leading-relaxed text-[#324949] whitespace-pre-wrap">
                                {project.objective || "Aucun objectif renseigné."}
                            </div>
                        </div>

                        {/* Meta dates */}
                        <div className="grid grid-cols-1 gap-6 border-t border-[#EAECE9] pt-6 md:grid-cols-2">
                            <InfoBlock label="Créé le">
                                {new Date(project.created_at).toLocaleString("fr-FR")}
                            </InfoBlock>
                            <InfoBlock label="Mis à jour le">
                                {new Date(project.updated_at).toLocaleString("fr-FR")}
                            </InfoBlock>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}