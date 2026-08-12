import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Mail, Phone, Server } from "lucide-react";

export default function Index({ settings }) {
    const columns = [
        {
            key: "email",
            label: "Email",
            render: (setting) => (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#1f2d2d]">
                    <Mail size={13} strokeWidth={1.8} className="text-[#8A9290]" />
                    {setting.email || "—"}
                </span>
            ),
        },

        {
            key: "phone",
            label: "Téléphone",
            render: (setting) => (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#5B6462]">
                    <Phone size={13} strokeWidth={1.8} className="text-[#8A9290]" />
                    {setting.phone || "—"}
                </span>
            ),
        },

        {
            key: "mail_host",
            label: "Hôte mail",
            render: (setting) => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                    <Server size={12} strokeWidth={1.8} />
                    {setting.mail_host || "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (setting) => {
        if (confirm(`Supprimer "${setting.site_name}" ?`)) {
            router.delete(route("settings.destroy", setting.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Paramètres" />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Configuration — Paramètres
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Paramètres
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer les paramètres du site web.
                        </p>
                    </div>

                    <Link
                        href={route("settings.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Ajouter un paramètre
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={settings}
                        actions={{

                            onEdit: (setting) =>
                                router.visit(route("settings.edit", setting.id)),

                            onDelete: handleDelete,
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}