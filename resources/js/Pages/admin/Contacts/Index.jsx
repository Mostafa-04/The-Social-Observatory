import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, router } from "@inertiajs/react";

export default function Index({ contacts }) {
    const handleDelete = (contact) => {
        if (confirm("Supprimer ce message ?")) {
            router.delete(route("contacts.destroy", contact.id));
        }
    };

    const columns = [
        {
            key: "name",
            label: "Nom",
            sortable: true,
            render: (row) => (
                <span className={row.is_read ? "text-[#5B6462]" : "font-semibold text-[#1f2d2d]"}>
                    {!row.is_read && (
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#BF5429] align-middle" />
                    )}
                    {row.name}
                </span>
            ),
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
            render: (row) => <span className="text-[#5B6462]">{row.email}</span>,
        },
        {
            key: "subject",
            label: "Sujet",
            render: (row) => (
                <span className="block max-w-[220px] truncate text-[#1f2d2d]">
                    {row.subject || "—"}
                </span>
            ),
        },
        {
            key: "organization",
            label: "Organisation",
            render: (row) => (
                <span className="text-[#5B6462]">{row.organization || "—"}</span>
            ),
        },
        {
            key: "status",
            label: "Statut",
            render: (row) => (
                <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        row.is_read
                            ? "bg-[#F7F8F6] text-[#5B6462]"
                            : "bg-[#BF5429]/10 text-[#BF5429]"
                    }`}
                >
                    {row.is_read ? "Lu" : "Non lu"}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Reçu le",
            sortable: true,
            render: (row) => (
                <span className="text-[#5B6462]">
                    {new Date(row.created_at).toLocaleDateString("fr-FR")}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Messages" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Messages de contact
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Messages reçus via le formulaire de contact du site public.
                        </p>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={contacts}
                    searchKeys={["name", "email", "subject", "organization"]}
                    emptyMessage="Aucun message reçu pour l'instant."
                    actions={{
                        onView: (contact) =>
                            router.visit(route("contacts.show", contact.id)),
                        onDelete: handleDelete,
                    }}
                />
            </div>
        </AdminLayout>
    );
}