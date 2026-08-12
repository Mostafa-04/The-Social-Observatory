import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    Tag,
    Flag,
    Globe2,
    Building2,
    MapPin,
    CalendarDays,
    Clock,
    Link2,
    ExternalLink,
} from "lucide-react";

const TYPE_LABELS = {
    conference: "Conférence",
    workshop: "Atelier",
    seminar: "Séminaire",
    webinar: "Webinaire",
    forum: "Forum",
    roundtable: "Table ronde",
    training: "Formation",
    meeting: "Réunion",
};

const STATUS_STYLES = {
    upcoming: "bg-[#BF5429]/10 text-[#BF5429]",
    ongoing: "bg-[#324949]/10 text-[#324949]",
    completed: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
    upcoming: "À venir",
    ongoing: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
};

export default function Show({ event }) {
    return (
        <AdminLayout>
            <Head title={event.title} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Événements
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {event.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Détails de l'événement.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("events.edit", event.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Modifier
                        </Link>

                        <Link
                            href={route("events.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-sm">
                    {/* Image */}
                    {event.image && (
                        <img
                            src={`/storage/${event.image}`}
                            alt={event.title}
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
                                    {event.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Tag size={12} strokeWidth={2} />
                                    Type d'événement
                                </h3>
                                <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[12px] font-medium text-[#324949]">
                                    {TYPE_LABELS[event.event_type] ?? event.event_type}
                                </span>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Flag size={12} strokeWidth={2} />
                                    Statut
                                </h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                                        STATUS_STYLES[event.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                                    }`}
                                >
                                    {STATUS_LABELS[event.status] ?? event.status}
                                </span>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Globe2 size={12} strokeWidth={2} />
                                    Pays
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{event.country?.name ?? "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Building2 size={12} strokeWidth={2} />
                                    Ville
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{event.city || "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <MapPin size={12} strokeWidth={2} />
                                    Lieu
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">{event.location || "—"}</p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <CalendarDays size={12} strokeWidth={2} />
                                    Date
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Heure
                                </h3>
                                <p className="text-[14px] text-[#1f2d2d]">
                                    {event.start_time
                                        ? new Date(event.start_time).toLocaleTimeString()
                                        : "—"}
                                    {" – "}
                                    {event.end_time
                                        ? new Date(event.end_time).toLocaleTimeString()
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 font-display text-lg text-[#1f2d2d]">
                                Description
                            </h3>
                            <div className="whitespace-pre-wrap rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-5 text-[14px] leading-7 text-[#324949]">
                                {event.description || (
                                    <span className="text-[#8A9290]">Aucune description</span>
                                )}
                            </div>
                        </div>

                        {/* Registration Link */}
                        <div className="border-t border-[#EAECE9] pt-6">
                            <h3 className="mb-3 flex items-center gap-1.5 font-display text-lg text-[#1f2d2d]">
                                <Link2 size={16} strokeWidth={1.8} />
                                Lien d'inscription
                            </h3>

                            {event.registration_link ? (
                                <a
                                    href={event.registration_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[14px] text-[#BF5429] hover:underline"
                                >
                                    {event.registration_link}
                                    <ExternalLink size={13} strokeWidth={1.8} />
                                </a>
                            ) : (
                                <p className="text-[13.5px] text-[#8A9290]">Aucun lien d'inscription.</p>
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
                                    {new Date(event.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Clock size={12} strokeWidth={2} />
                                    Mis à jour le
                                </h3>
                                <p className="text-[14px] text-[#5B6462]">
                                    {new Date(event.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}