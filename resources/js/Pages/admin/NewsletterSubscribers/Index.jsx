import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Send, Mail, CheckCircle2, XCircle, Power } from "lucide-react";

export default function Index({ subscribers }) {
    const handleDelete = (subscriber) => {
        if (confirm("Supprimer cet abonné ?")) {
            router.delete(route("newsletter-subscribers.destroy", subscriber.id));
        }
    };

    const toggleStatus = (subscriber) => {
        if (subscriber.is_active) {
            router.patch(route("newsletter-subscribers.deactivate", subscriber.id));
        } else {
            router.patch(route("newsletter-subscribers.activate", subscriber.id));
        }
    };

    const columns = [
        {
            key: "id",
            label: "#",
            sortable: true,
            render: (row) => <span className="text-[#8A9290]">{row.id}</span>,
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
            render: (row) => (
                <span className="flex items-center gap-2 font-medium text-[#1f2d2d]">
                    <Mail size={14} strokeWidth={1.6} className="text-[#8A9290]" />
                    {row.email}
                </span>
            ),
        },
        {
            key: "status",
            label: "Statut",
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        row.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#F7F8F6] text-[#5B6462]"
                    }`}
                >
                    {row.is_active ? (
                        <CheckCircle2 size={12} strokeWidth={2} />
                    ) : (
                        <XCircle size={12} strokeWidth={2} />
                    )}
                    {row.is_active ? "Actif" : "Inactif"}
                </span>
            ),
        },
        {
            key: "subscribed_at",
            label: "Abonné le",
            sortable: true,
            render: (row) => (
                <span className="text-[#5B6462]">
                    {row.subscribed_at
                        ? new Date(row.subscribed_at).toLocaleString("fr-FR")
                        : "—"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Abonnement",
            render: (row) => (
                <button
                    onClick={() => toggleStatus(row)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                        row.is_active
                            ? "border border-red-200 text-red-600 hover:bg-red-50"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                    <Power size={13} strokeWidth={2} />
                    {row.is_active ? "Désactiver" : "Activer"}
                </button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Abonnés Newsletter" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Engagement
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Abonnés Newsletter
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer les abonnés et envoyer des campagnes email.
                        </p>
                    </div>

                    <Link
                        href={route("newsletter-subscribers.newsletter-form")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Send size={15} strokeWidth={1.8} />
                        Envoyer la newsletter
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={subscribers}
                    searchKeys={["email"]}
                    emptyMessage="Aucun abonné pour l'instant."
                    actions={{
                        onView: (subscriber) =>
                            router.visit(route("newsletter-subscribers.show", subscriber.id)),
                        onDelete: handleDelete,
                    }}
                />
            </div>
        </AdminLayout>
    );
}