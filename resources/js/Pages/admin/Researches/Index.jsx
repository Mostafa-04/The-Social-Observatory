import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, FileText, ImageOff } from "lucide-react";

const STATUS_STYLES = {
    published: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    draft: "bg-[#BF5429]/10 text-[#BF5429]",
};

const STATUS_LABELS = {
    published: "Publié",
    draft: "Brouillon",
};

export default function Index({ researches }) {
    const columns = [
        {
            key: "featured_image",
            label: "Image",
            render: (research) =>
                research.featured_image ? (
                    <img
                        src={`/storage/${research.featured_image}`}
                        alt={research.title}
                        className="h-14 w-14 rounded-lg border border-[#D6D9D8] object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] text-[#8A9290]">
                        <ImageOff size={14} strokeWidth={1.8} />
                    </div>
                ),
        },

        {
            key: "title",
            label: "Titre",
            render: (research) => (
                <span className="font-medium text-[#1f2d2d]">{research.title}</span>
            ),
        },

        {
            key: "author",
            label: "Auteur",
            render: (research) => (
                <span className="text-[13px] text-[#5B6462]">{research.author?.name ?? "—"}</span>
            ),
        },

        {
            key: "category",
            label: "Catégorie",
            render: (research) => (
                <span className="text-[13px] text-[#5B6462]">{research.category?.name ?? "—"}</span>
            ),
        },

        {
            key: "pdf",
            label: "PDF",
            render: (research) =>
                research.pdf ? (
                    <a
                        href={`/storage/${research.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949] transition hover:bg-[#324949]/20"
                    >
                        <FileText size={12} strokeWidth={1.8} />
                        Voir le PDF
                    </a>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">—</span>
                ),
        },

        {
            key: "status",
            label: "Statut",
            render: (research) => (
                <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[research.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                    }`}
                >
                    {STATUS_LABELS[research.status] ?? research.status}
                </span>
            ),
        },

        {
            key: "published_at",
            label: "Publié le",
            render: (research) => (
                <span className="text-[13px] text-[#5B6462]">
                    {research.published_at
                        ? new Date(research.published_at).toLocaleDateString()
                        : "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (research) => {
        if (confirm(`Supprimer "${research.title}" ?`)) {
            router.delete(route("researches.destroy", research.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Recherches" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Recherches
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Recherches
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des recherches.
                        </p>
                    </div>

                    <Link
                        href={route("researches.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter une recherche
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={researches}
                        actions={{
                            onView: (research) =>
                                router.visit(route("researches.show", research.id)),

                            onEdit: (research) =>
                                router.visit(route("researches.edit", research.id)),

                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}