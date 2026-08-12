import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ExternalLink } from "lucide-react";

export default function Index({ authors }) {
    const columns = [
        {
            key: "photo",
            label: "Photo",
            render: (author) =>
                author.photo ? (
                    <img
                        src={`/storage/${author.photo}`}
                        alt={author.name}
                        className="h-11 w-11 rounded-full border border-[#D6D9D8] object-cover"
                    />
                ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F8F6] border border-[#D6D9D8] text-[10px] text-[#8A9290]">
                        N/A
                    </div>
                ),
        },
        {
            key: "name",
            label: "Nom",
            render: (author) => (
                <span className="font-medium text-[#1f2d2d]">{author.name}</span>
            ),
        },
        {
            key: "position",
            label: "Poste",
            render: (author) => (
                <span className="text-[#5B6462]">{author.position || "—"}</span>
            ),
        },
        {
            key: "linkedin",
            label: "LinkedIn",
            render: (author) =>
                author.linkedin ? (
                    <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#BF5429] hover:underline"
                    >
                        Voir le profil
                        <ExternalLink size={12} strokeWidth={1.8} />
                    </a>
                ) : (
                    <span className="text-[#8A9290]">—</span>
                ),
        },
        {
            key: "created_at",
            label: "Créé le",
            render: (author) => (
                <span className="text-[#5B6462]">
                    {new Date(author.created_at).toLocaleDateString("fr-FR")}
                </span>
            ),
        },
    ];

    const handleDelete = (author) => {
        if (confirm(`Supprimer "${author.name}" ?`)) {
            router.delete(route("authors.destroy", author.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Auteurs" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Auteurs
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer les profils de chercheurs et contributeurs.
                        </p>
                    </div>

                    <Link
                        href={route("authors.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Nouvel auteur
                    </Link>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={authors}
                    searchKeys={["name", "position"]}
                    emptyMessage="Aucun auteur pour l'instant — ajoutez le premier."
                    actions={{
                        onView: (author) =>
                            router.visit(route("authors.show", author.id)),

                        onEdit: (author) =>
                            router.visit(route("authors.edit", author.id)),

                        onDelete: handleDelete,
                    }}
                />
            </div>
        </AdminLayout>
    );
}