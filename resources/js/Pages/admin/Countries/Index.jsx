import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Globe2, MapPin } from "lucide-react";

const CONTINENT_LABELS = {
    Africa: "Afrique",
    Asia: "Asie",
    Europe: "Europe",
    "North America": "Amérique du Nord",
    "South America": "Amérique du Sud",
    Oceania: "Océanie",
};

export default function Index({ countries }) {
    const columns = [
        {
            key: "name",
            label: "Pays",
            render: (country) => (
                <span className="flex items-center gap-2 font-medium text-[#1f2d2d]">
                    <Globe2 size={15} strokeWidth={1.6} className="text-[#8A9290]" />
                    {country.name}
                </span>
            ),
        },
        {
            key: "iso_code",
            label: "Code ISO",
            render: (country) => (
                <span className="rounded-md bg-[#324949]/10 px-2 py-1 font-mono text-[11.5px] font-semibold tracking-wider text-[#324949]">
                    {country.iso_code}
                </span>
            ),
        },
        {
            key: "continent",
            label: "Continent",
            render: (country) => (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F8F6] px-3 py-1 text-[11.5px] font-medium text-[#5B6462]">
                    <MapPin size={12} strokeWidth={1.8} className="text-[#BF5429]" />
                    {CONTINENT_LABELS[country.continent] || country.continent}
                </span>
            ),
        },
        {
            key: "created_at",
            label: "Créé le",
            render: (country) => (
                <span className="text-[#5B6462]">
                    {new Date(country.created_at).toLocaleDateString("fr-FR")}
                </span>
            ),
        },
    ];

    const handleDelete = (country) => {
        if (confirm(`Supprimer "${country.name}" ?`)) {
            router.delete(route("countries.destroy", country.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Pays" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Pays
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Référentiel géographique utilisé par les Projets et les Événements.
                        </p>
                    </div>

                    <Link
                        href={route("countries.create")}
                        className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Nouveau pays
                    </Link>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={countries}
                    searchKeys={["name", "iso_code", "continent"]}
                    emptyMessage="Aucun pays pour l'instant — ajoutez le premier."
                    actions={{
                        onEdit: (country) =>
                            router.visit(route("countries.edit", country.id)),
                        onDelete: handleDelete,
                    }}
                />
            </div>
        </AdminLayout>
    );
}