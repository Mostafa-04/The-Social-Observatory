import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Globe2 } from "lucide-react";

export default function Index({ partners }) {
    const columns = [
        {
            key: "name",
            label: "Nom",
            render: (partner) => (
                <span className="font-medium text-[#1f2d2d]">{partner.name}</span>
            ),
        },
        {
            key: "website",
            label: "Site web",
            render: (partner) =>
                partner.website ? (
                    <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] text-[#BF5429] hover:underline"
                    >
                        <Globe2 size={13} strokeWidth={1.8} />
                        Visiter
                    </a>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">—</span>
                ),
        },
        {
            key: "type",
            label: "Type",
            render: (partner) => (
                <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                    {partner.type}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Créé le",
            render: (partner) => (
                <span className="text-[13px] text-[#5B6462]">
                    {new Date(partner.created_at).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const handleDelete = (partner) => {
        if (confirm(`Supprimer "${partner.name}" ?`)) {
            router.delete(route("partners.destroy", partner.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Partenaires" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Partenaires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Partenaires
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des partenaires.
                        </p>
                    </div>

                    <Link
                        href={route("partners.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter un partenaire
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={partners}
                        actions={{
                            onView: (partner) =>
                                router.visit(route("partners.show", partner.id)),

                            onEdit: (partner) =>
                                router.visit(route("partners.edit", partner.id)),

                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}