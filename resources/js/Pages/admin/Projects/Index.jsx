import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, MapPin, Handshake, ImageOff } from "lucide-react";

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

export default function Index({ projects }) {
    const columns = [
        {
            key: "featured_image",
            label: "Image",
            render: (project) =>
                project.featured_image ? (
                    <img
                        src={`/storage/${project.featured_image}`}
                        alt={project.title}
                        className="h-14 w-20 rounded-lg border border-[#D6D9D8] object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] text-[#C6CBC8]">
                        <ImageOff size={16} strokeWidth={1.6} />
                    </div>
                ),
        },
        {
            key: "title",
            label: "Titre",
            render: (project) => (
                <span className="font-medium text-[#1f2d2d]">{project.title}</span>
            ),
        },
        {
            key: "country",
            label: "Pays",
            render: (project) => (
                <span className="flex items-center gap-1.5 text-[#5B6462]">
                    {project.country?.name && <MapPin size={12} strokeWidth={1.8} className="text-[#8A9290]" />}
                    {project.country?.name ?? "—"}
                </span>
            ),
        },
        {
            key: "partner",
            label: "Partenaire",
            render: (project) => (
                <span className="flex items-center gap-1.5 text-[#5B6462]">
                    {project.partner?.name && <Handshake size={12} strokeWidth={1.8} className="text-[#8A9290]" />}
                    {project.partner?.name ?? "—"}
                </span>
            ),
        },
        {
            key: "status",
            label: "Statut",
            render: (project) => (
                <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        STATUS_STYLES[project.status] || "bg-[#F7F8F6] text-[#5B6462]"
                    }`}
                >
                    {STATUS_LABELS[project.status] || project.status}
                </span>
            ),
        },
        {
            key: "start_date",
            label: "Début",
            render: (project) => (
                <span className="text-[#5B6462]">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString("fr-FR") : "—"}
                </span>
            ),
        },
        {
            key: "end_date",
            label: "Fin",
            render: (project) => (
                <span className="text-[#5B6462]">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString("fr-FR") : "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (project) => {
        if (confirm(`Supprimer "${project.title}" ?`)) {
            router.delete(route("projects.destroy", project.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Projets" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Projets
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Suivi des projets terrain et partenariats.
                        </p>
                    </div>

                    <Link
                        href={route("projects.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Nouveau projet
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={projects}
                    searchKeys={["title"]}
                    emptyMessage="Aucun projet pour l'instant — créez le premier."
                    actions={{
                        onView: (project) => router.visit(route("projects.show", project.id)),
                        onEdit: (project) => router.visit(route("projects.edit", project.id)),
                        onDelete: handleDelete,
                    }}
                />
            </div>
        </AdminLayout>
    );
}