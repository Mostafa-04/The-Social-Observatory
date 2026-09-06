import AdminLayout from "@/Pages/admin/AdminLayout";
import DataTable from "@/Components/DataTable";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Plus,
    Globe2,
    MapPin,
    Users,
    Upload,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";


export default function Index({ associations, countries = [] }) {
    const TYPES = [
        {
            value: "association",
            label: "Association",
        },
        {
            value: "initiative",
            label: "Initiative",
        },
        {
            value: "cooperative_sociale",
            label: "Coopérative sociale",
        },
        {
            value: "fondation",
            label: "Fondation",
        },
        {
            value: "reseau",
            label: "Réseau",
        },
        {
            value: "autre",
            label: "Autre",
        },
    ];

    const [showImportModal, setShowImportModal] = useState(false);
    const [importMessage, setImportMessage] = useState(null);

    const {
        data: importData,
        setData: setImportData,
        post: importPost,
        processing: importProcessing,
        errors: importErrors,
        reset: resetImport,
    } = useForm({
        country_id: "",
        type: "association",
        file: null,
    });

    const handleImport = (e) => {
        e.preventDefault();

        
        if (!importData.country_id) {
            setImportMessage({
                type: "error",
                text: "Un pays doit être sélectionné."
            });
            return;
        }

        if (!importData.type) {
            setImportMessage({
                type: "error",
                text: "Il faut choisir un type"
            });
            return;
        }

        if (!importData.file) {
            setImportMessage({
                type: "error",
                text: "Il faut choisir un fichier Excel"
            });
            return;
        }

        console.log("IMPORT DATA:", importData);

        importPost(route("associations.import"), {
            forceFormData: true,

            onStart: () => {
                console.log("Import démarré");
                setImportMessage({
                    type: "loading",
                    text: "Import en cours..."
                });
            },

onSuccess: (page) => {
    console.log("Import réussi", page);

    const flashSuccess = page.props.flash?.success;
    const flashError = page.props.flash?.error;

    if (flashError) {
        
        setImportMessage({
            type: "error",
            text: flashError,
        });
        return; 
    }

    setImportMessage({
        type: "success",
        text: flashSuccess || "Import des associations réussi",
    });

    setTimeout(() => {
        setShowImportModal(false);
        resetImport();
        setImportMessage(null);
    }, 2000);
},

            onError: (errors) => {
                console.log("ERREURS:", errors);
                
                // Gérer les erreurs de validation
                let errorMessage = "Erreur lors de l'import";
                
                if (errors.file) {
                    errorMessage = errors.file[0] || errorMessage;
                } else if (errors.country_id) {
                    errorMessage = errors.country_id[0] || errorMessage;
                } else if (errors.type) {
                    errorMessage = errors.type[0] || errorMessage;
                }
                
                setImportMessage({
                    type: "error",
                    text: errorMessage
                });
            },

            onFinish: () => {
                console.log("Import terminé");
            },
        });
    };

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

    const associationData =
        associations?.data ?? associations ?? [];

    return (
        <AdminLayout>
            <Head title="Associations" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">

            {/* ---------------------------------------------------------
                Header
            --------------------------------------------------------- */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* Left content */}
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#BF5429]">
                        Contenu — Associations
                    </p>

                    <h1 className="font-display text-2xl font-semibold text-[#1f2d2d]">
                        Associations
                    </h1>

                    <p className="mt-1 max-w-md text-sm text-[#5B6462]">
                        Gérez facilement toutes les associations et les acteurs sociaux.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-sm font-medium text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <Upload size={16} strokeWidth={2} />
                        Importer
                    </button>

                    <Link
                        href={route("associations.create")}
                        className="flex items-center gap-2 rounded-lg bg-[#BF5429] px-4 py-2 text-sm font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                    >
                        <Plus size={16} strokeWidth={2} />
                        Ajouter
                    </Link>

                </div>
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

            {/* Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#D6D9D8] px-6 py-4">

                            <div>
                                <h2 className="text-[16px] font-semibold text-[#1f2d2d]">
                                    Importer des associations
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Importer plusieurs associations depuis un fichier Excel.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowImportModal(false);
                                    setImportMessage(null);
                                }}
                                className="text-xl text-[#8A9290] hover:text-[#1f2d2d]"
                            >
                                ×
                            </button>

                        </div>

                        {/* Messages */}
                        {importMessage && (
                            <div className={`mx-6 mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                                importMessage.type === "error"
                                    ? "bg-red-50 text-red-700"
                                    : importMessage.type === "success"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-blue-50 text-blue-700"
                            }`}>
                                <AlertCircle size={16} />
                                <span>{importMessage.text}</span>
                            </div>
                        )}

                        {/* Body */}
                        <form onSubmit={handleImport} className="space-y-5 p-6">

                            {/* Pays */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                    Pays
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    value={importData.country_id}
                                    onChange={(e) =>
                                        setImportData(
                                            "country_id",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] outline-none"
                                >
                                    <option value="">
                                        Sélectionner un pays
                                    </option>

                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>

                                {importErrors.country_id && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {importErrors.country_id}
                                    </p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                    Type
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    value={importData.type}
                                    onChange={(e) =>
                                        setImportData(
                                            "type",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] outline-none"
                                >
                                    {TYPES.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>

                                {importErrors.type && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {importErrors.type}
                                    </p>
                                )}
                            </div>

                            {/* Excel */}
                            <div>
                                <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                    Fichier Excel
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-6 py-8 transition hover:border-[#BF5429]/50">

                                    <Upload
                                        size={24}
                                        className="mb-2 text-[#8A9290]"
                                    />

                                    <span className="text-[13px] font-medium text-[#324949]">
                                        {importData.file
                                            ? importData.file.name
                                            : "choisir un fichier"}
                                    </span>

                                    <span className="mt-1 text-[11px] text-[#8A9290]">
                                        .xlsx ou .xls
                                    </span>

                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        onChange={(e) => {
                                            setImportData(
                                                "file",
                                                e.target.files?.[0] || null
                                            );
                                        }}
                                    />

                                </label>

                                {importErrors.file && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {importErrors.file}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowImportModal(false);
                                        setImportMessage(null);
                                    }}
                                    className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13px] text-[#324949]"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={importProcessing}
                                    className={`rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] ${importProcessing ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {importProcessing ? "Import en cours..." : "Import"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}