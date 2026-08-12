import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ImageOff } from "lucide-react";

const STATUS_STYLES = {
    published: "bg-[#2F6B4F]/10 text-[#2F6B4F]",
    draft: "bg-[#BF5429]/10 text-[#BF5429]",
};

const STATUS_LABELS = {
    published: "Publié",
    draft: "Brouillon",
};

export default function Index({ insights }) {
    const columns = [
        {
            key: "featured_image",
            label: "Image",
            render: (insight) =>
                insight.featured_image ? (
                    <img
                        src={`/storage/${insight.featured_image}`}
                        alt={insight.title}
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
            render: (insight) => (
                <span className="font-medium text-[#1f2d2d]">{insight.title}</span>
            ),
        },

        {
            key: "slug",
            label: "Slug",
            render: (insight) => (
                <span className="text-[13px] text-[#5B6462]">{insight.slug}</span>
            ),
        },

        {
            key: "category",
            label: "Catégorie",
            render: (insight) => (
                <span className="text-[13px] text-[#5B6462]">{insight.category?.name ?? "—"}</span>
            ),
        },

        {
            key: "author",
            label: "Auteur",
            render: (insight) => (
                <span className="text-[13px] text-[#5B6462]">{insight.author?.name ?? "—"}</span>
            ),
        },

        {
            key: "status",
            label: "Statut",
            render: (insight) => (
                <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[insight.status] ?? "bg-[#8A9290]/10 text-[#5B6462]"
                    }`}
                >
                    {STATUS_LABELS[insight.status] ?? insight.status}
                </span>
            ),
        },

        {
            key: "published_at",
            label: "Publié le",
            render: (insight) => (
                <span className="text-[13px] text-[#5B6462]">
                    {insight.published_at
                        ? new Date(insight.published_at).toLocaleDateString()
                        : "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (insight) => {
        if (confirm(`Supprimer "${insight.title}" ?`)) {
            router.delete(route("insights.destroy", insight.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Insights" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Insights
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Insights
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des insights.
                        </p>
                    </div>

                    <Link
                        href={route("insights.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter un insight
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={insights}
                        actions={{
                            onView: (insight) => router.visit(route("insights.show", insight.id)),

                            onEdit: (insight) => router.visit(route("insights.edit", insight.id)),

                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}