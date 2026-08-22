import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Globe2,
    MapPin,
    Users,
} from "lucide-react";

export default function Index({ associations }) {
    const columns = [
        {
            key: "name",
            label: "Association",
            render: (association) => (
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#324949]/10">
                        {association.logo_path ? (
                            <img
                                src={`/storage/${association.logo_path}`}
                                alt={association.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-[#324949]">
                                {association.name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                        <p className="truncate font-medium text-[#1f2d2d]">
                            {association.name}
                        </p>

                        {association.city && (
                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8A9290]">
                                <MapPin size={11} strokeWidth={1.8} />
                                <span>{association.city}</span>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },

        {
            key: "type",
            label: "Type",
            render: (association) => {
                const typeLabels = {
                    association: "Association",
                    initiative: "Initiative",
                    cooperative_sociale: "Coopérative sociale",
                    fondation: "Fondation",
                    reseau: "Réseau",
                    autre: "Autre",
                };

                return (
                    <span className="inline-flex rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                        {typeLabels[association.type] || association.type}
                    </span>
                );
            },
        },

        {
            key: "country",
            label: "Pays",
            render: (association) =>
                association.country ? (
                    <span className="text-[13px] text-[#5B6462]">
                        {association.country.name}
                    </span>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">
                        —
                    </span>
                ),
        },

        {
            key: "beneficiaries_count",
            label: "Bénéficiaires",
            render: (association) =>
                association.beneficiaries_count !== null &&
                association.beneficiaries_count !== undefined ? (
                    <div className="inline-flex items-center gap-1.5 text-[13px] text-[#5B6462]">
                        <Users size={13} strokeWidth={1.8} />

                        {Number(
                            association.beneficiaries_count
                        ).toLocaleString("fr-FR")}
                    </div>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">
                        —
                    </span>
                ),
        },

        {
            key: "status",
            label: "Statut",
            render: (association) =>
                association.status === "active" ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                        Inactive
                    </span>
                ),
        },

        {
            key: "website",
            label: "Site web",
            render: (association) =>
                association.website ? (
                    <a
                        href={association.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[13px] text-[#BF5429] hover:underline"
                    >
                        <Globe2
                            size={13}
                            strokeWidth={1.8}
                        />

                        Visiter
                    </a>
                ) : (
                    <span className="text-[13px] text-[#8A9290]">
                        —
                    </span>
                ),
        },

        {
            key: "created_at",
            label: "Créé le",
            render: (association) => (
                <span className="text-[13px] text-[#5B6462]">
                    {association.created_at
                        ? new Date(
                              association.created_at
                          ).toLocaleDateString("fr-FR")
                        : "—"}
                </span>
            ),
        },
    ];

    const handleDelete = (association) => {
        if (
            confirm(
                `Supprimer "${association.name}" ?`
            )
        ) {
            router.delete(
                route(
                    "associations.destroy",
                    association.id
                )
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Laravel pagination
    |--------------------------------------------------------------------------
    |
    | Controller:
    |
    | $associations = Association::paginate(15);
    |
    | لذلك البيانات الحقيقية موجودة داخل:
    |
    | associations.data
    |
    */

    const associationData =
        associations?.data ?? associations ?? [];

    return (
        <AdminLayout>
            <Head title="Associations" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">

                {/* ---------------------------------------------------------
                    Header
                --------------------------------------------------------- */}

                <div className="mb-2 flex items-center justify-between gap-4">

                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Contenu — Associations
                        </p>

                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Associations
                        </h1>

                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Gérer l'ensemble des associations
                            et acteurs sociaux.
                        </p>
                    </div>

                    <Link
                        href={route(
                            "associations.create"
                        )}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus
                            size={15}
                            strokeWidth={2}
                        />

                        Ajouter une association
                    </Link>
                </div>

                {/* ---------------------------------------------------------
                    Table
                --------------------------------------------------------- */}

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-2 shadow-sm">

                    <DataTable
                        columns={columns}
                        data={associationData}
                        actions={{
                            onView: (association) =>
                                router.visit(
                                    route(
                                        "associations.show",
                                        association.id
                                    )
                                ),

                            onEdit: (association) =>
                                router.visit(
                                    route(
                                        "associations.edit",
                                        association.id
                                    )
                                ),

                            onDelete:
                                handleDelete,
                        }}
                    />

                </div>

            </div>
        </AdminLayout>
    );
}