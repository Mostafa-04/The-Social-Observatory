import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, FileText, ImageOff, Users } from "lucide-react";

export default function Index({ publications }) {
    const columns = [
        {
            key: "cover_image",
            label: "Couverture",
            render: (publication) =>
                publication.cover_image ? (
                    <img
                        src={`/storage/${publication.cover_image}`}
                        alt={publication.title}
                        className="h-16 w-12 rounded-lg border border-[#D6D9D8] object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-12 items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] text-[#8A9290]">
                        <ImageOff size={14} strokeWidth={1.8} />
                    </div>
                ),
        },

        {
            key: "title",
            label: "Titre",
            render: (publication) => (
                <span className="font-medium text-[#1f2d2d]">{publication.title}</span>
            ),
        },

        {
            key: "type",
            label: "Type",
            render: (publication) => (
                <span className="rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                    {publication.type}
                </span>
            ),
        },

        {
            key: "pages",
            label: "Pages",
            render: (publication) => (
                <span className="text-[13px] text-[#5B6462]">{publication.pages ?? "—"}</span>
            ),
        },

        {
            key: "language",
            label: "Langue",
            render: (publication) => (
                <span className="text-[13px] text-[#5B6462]">{publication.language}</span>
            ),
        },

        {
            key: "pdf",
            label: "PDF",
            render: (publication) =>
                publication.pdf ? (
                    <a
                        href={`/storage/${publication.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#BF5429]/10 px-3 py-1 text-[11px] font-medium text-[#BF5429] transition hover:bg-[#BF5429]/20"
                    >
                        <FileText size={12} strokeWidth={1.8} />
                        Voir le PDF
                    </a>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">—</span>
                ),
        },

        
        {
            key: "downloads",
            label: "Inscriptions",
            render: (publication) => (
                <Link
                    href={route("publications.downloads", publication.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949] transition hover:bg-[#324949]/20"
                >
                    <Users size={12} strokeWidth={1.8} />
                    {publication.downloads_count ?? 0}
                </Link>
            ),
        },

        {
            key: "published_at",
            label: "Publié le",
            render: (publication) => (
                <span className="text-[13px] text-[#5B6462]">
                    {publication.published_at
                        ? new Date(publication.published_at).toLocaleDateString()
                        : "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (publication) => {
        if (confirm(`Supprimer "${publication.title}" ?`)) {
            router.delete(route("publications.destroy", publication.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Publications" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Publications
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Publications
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des publications.
                        </p>
                    </div>

                    <Link
                        href={route("publications.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter une publication
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={publications}
                        actions={{
                            onView: (publication) =>
                                router.visit(route("publications.show", publication.id)),
                            onEdit: (publication) =>
                                router.visit(route("publications.edit", publication.id)),
                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}