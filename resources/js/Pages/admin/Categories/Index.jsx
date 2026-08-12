import { Link, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import AdminLayout from "@/Pages/admin/AdminLayout";
import { Plus } from "lucide-react";

// Une teinte distincte par type — dérivées de la palette de marque,
// pas des couleurs Tailwind par défaut (bleu générique).
const TYPE_STYLES = {
    research: "bg-[#324949]/10 text-[#324949]",
    publication: "bg-[#BF5429]/10 text-[#BF5429]",
    insight: "bg-[#5B6462]/10 text-[#5B6462]",
};
const TYPE_LABELS = {
    research: "Recherche",
    publication: "Publication",
    insight: "Insight",
};

export default function Index({ categories }) {
    const columns = [
        {
            key: "name",
            label: "Nom",
            render: (row) => (
                <span className="font-medium text-[#1f2d2d]">{row.name}</span>
            ),
        },
        {
            key: "slug",
            label: "Slug",
            render: (row) => (
                <span className="rounded-md bg-[#F7F8F6] px-2 py-1 font-mono text-[11.5px] text-[#5B6462]">
                    {row.slug}
                </span>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (row) => (
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        TYPE_STYLES[row.type] || "bg-[#F7F8F6] text-[#5B6462]"
                    }`}
                >
                    {TYPE_LABELS[row.type] || row.type}
                </span>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (row) => (
                <span className="block max-w-xs truncate text-[#5B6462]">
                    {row.description || "—"}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Catégories
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Taxonomie utilisée par les Recherches, Publications et Insights.
                        </p>
                    </div>

                    <Link
                        href={route("categories.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Nouvelle catégorie
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={categories}
                    searchKeys={["name", "slug", "type"]}
                    emptyMessage="Aucune catégorie pour l'instant — créez la première."
                    actions={{
                        onEdit: (row) =>
                            router.visit(route("categories.edit", row.id)),
                        onDelete: (row) => {
                            if (confirm(`Supprimer la catégorie "${row.name}" ?`)) {
                                router.delete(route("categories.destroy", row.id));
                            }
                        },
                    }}
                />
            </div>
        </AdminLayout>
    );
}