import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ImageOff } from "lucide-react";

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

export default function Index({ events }) {
    const columns = [
        {
            key: "image",
            label: "Image",
            render: (event) =>
                event.image ? (
                    <img
                        src={`/storage/${event.image}`}
                        alt={event.title}
                        className="h-16 w-24 rounded-lg border border-[#D6D9D8] object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] text-[#8A9290]">
                        <ImageOff size={14} strokeWidth={1.8} />
                    </div>
                ),
        },

        {
            key: "title",
            label: "Titre",
            render: (event) => (
                <span className="font-medium text-[#1f2d2d]">{event.title}</span>
            ),
        },

        {
            key: "event_type",
            label: "Type",
            render: (event) => (
                <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                    {TYPE_LABELS[event.event_type] ?? event.event_type}
                </span>
            ),
        },

        {
            key: "country",
            label: "Pays",
            render: (event) => (
                <span className="text-[13px] text-[#5B6462]">{event.country?.name ?? "—"}</span>
            ),
        },

        {
            key: "city",
            label: "Ville",
            render: (event) => (
                <span className="text-[13px] text-[#5B6462]">{event.city || "—"}</span>
            ),
        },

        {
            key: "date",
            label: "Date",
            render: (event) => (
                <span className="text-[13px] text-[#5B6462]">
                    {new Date(event.date).toLocaleDateString()}
                </span>
            ),
        },

        {
            key: "status",
            label: "Statut",
            render: (event) => (
                <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[event.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                    }`}
                >
                    {STATUS_LABELS[event.status] ?? event.status}
                </span>
            ),
        },
    ];

    const handleDelete = (event) => {
        if (confirm(`Supprimer "${event.title}" ?`)) {
            router.delete(route("events.destroy", event.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Événements" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Événements
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Événements
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des événements.
                        </p>
                    </div>

                    <Link
                        href={route("events.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter un événement
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={events}
                        actions={{
                            onView: (event) => router.visit(route("events.show", event.id)),

                            onEdit: (event) => router.visit(route("events.edit", event.id)),

                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}