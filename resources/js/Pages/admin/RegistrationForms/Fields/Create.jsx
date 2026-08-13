import AdminLayout from "@/Pages/admin/AdminLayout";
import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Plus,
    Trash2,
    GripVertical,
    Lock,
    Save,
    Type,
    Mail,
    Phone,
    Hash,
    Calendar,
    AlignLeft,
    List,
    CircleDot,
    CheckSquare,
    Globe,
    Upload,
    ArrowLeft,
    X,
    ListChecks,
} from "lucide-react";

const FIELD_TYPES = [
    { value: "text", label: "Texte", icon: Type },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Téléphone", icon: Phone },
    { value: "number", label: "Nombre", icon: Hash },
    { value: "date", label: "Date", icon: Calendar },
    { value: "textarea", label: "Zone de texte", icon: AlignLeft },
    { value: "select", label: "Liste déroulante", icon: List },
    { value: "radio", label: "Choix unique", icon: CircleDot },
    { value: "checkbox", label: "Cases à cocher", icon: CheckSquare },
    { value: "country", label: "Pays", icon: Globe },
    { value: "file", label: "Fichier", icon: Upload },
];

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Create({ registrationForm }) {
    const [fields, setFields] = useState(registrationForm.fields || []);
    const [showAddField, setShowAddField] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        label: "",
        name: "",
        type: "text",
        options: [],
        is_required: false,
    });

    const addField = (e) => {
        e.preventDefault();

        post(
            route("registration-forms.fields.store", registrationForm.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setShowAddField(false);

                    /*
                     * Reload fields from server.
                     */
                    window.location.reload();
                },
            }
        );
    };

    const deleteField = (field) => {
        if (field.is_system) {
            return;
        }

        if (!confirm(`Voulez-vous supprimer le champ "${field.label}" ?`)) {
            return;
        }

        window.axios
            .delete(
                route("registration-forms.fields.destroy", [
                    registrationForm.id,
                    field.id,
                ])
            )
            .then(() => {
                setFields((current) =>
                    current.filter((item) => item.id !== field.id)
                );
            });
    };

    return (
        <AdminLayout>
            <Head title={`Champs — ${registrationForm.title}`} />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Formulaire d'inscription
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            {registrationForm.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            {registrationForm.event?.title}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route("events.index")}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />
                            Retour
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowAddField(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#BF5429] px-4 py-2 text-[13px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f]"
                        >
                            <Plus size={14} strokeWidth={1.8} />
                            Ajouter un champ
                        </button>
                    </div>
                </div>

                {/* Fields */}
                {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D9D8] bg-white py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F8F6] text-[#8A9290]">
                            <ListChecks size={22} strokeWidth={1.6} />
                        </div>
                        <p className="mt-4 text-[14px] font-medium text-[#1f2d2d]">
                            Aucun champ pour l'instant
                        </p>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Ajoutez un champ pour construire le formulaire d'inscription.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fields.map((field) => {
                            const fieldType = FIELD_TYPES.find(
                                (item) => item.value === field.type
                            );
                            const Icon = fieldType?.icon || Type;

                            return (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-4 rounded-xl border border-[#D6D9D8] bg-white p-4 shadow-sm transition hover:border-[#324949]/25"
                                >
                                    <GripVertical
                                        className="shrink-0 text-[#C3C9C7]"
                                        size={18}
                                    />

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#BF5429]/10 text-[#BF5429]">
                                        <Icon size={18} strokeWidth={1.8} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="truncate text-[14px] font-medium text-[#1f2d2d]">
                                                {field.label}
                                            </h3>

                                            {field.is_system && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F8F6] px-2.5 py-0.5 text-[11px] font-medium text-[#5B6462]">
                                                    <Lock size={11} strokeWidth={2} />
                                                    Système
                                                </span>
                                            )}

                                            {field.is_required && (
                                                <span className="text-[13px] text-[#BF5429]">*</span>
                                            )}
                                        </div>

                                        <div className="mt-0.5 flex gap-3 text-[12px] text-[#8A9290]">
                                            <span>{field.name}</span>
                                            <span>·</span>
                                            <span>{fieldType?.label}</span>
                                        </div>
                                    </div>

                                    {!field.is_system && (
                                        <button
                                            type="button"
                                            onClick={() => deleteField(field)}
                                            className="shrink-0 rounded-lg p-2 text-[#BF5429] transition hover:bg-[#BF5429]/10"
                                        >
                                            <Trash2 size={16} strokeWidth={1.8} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add Field modal */}
                {showAddField && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d2d]/40 p-6">
                        <div className="w-full max-w-2xl rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="font-display text-xl text-[#1f2d2d]">
                                        Ajouter un champ
                                    </h2>
                                    <p className="mt-1 text-[13px] text-[#5B6462]">
                                        Ajoutez un nouveau champ au formulaire.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowAddField(false)}
                                    className="rounded-lg p-1.5 text-[#8A9290] transition hover:bg-[#F7F8F6] hover:text-[#324949]"
                                >
                                    <X size={18} strokeWidth={1.8} />
                                </button>
                            </div>

                            <form onSubmit={addField} className="space-y-5">
                                {/* Label */}
                                <div>
                                    <label className={labelClass}>Libellé</label>
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={(e) => setData("label", e.target.value)}
                                        placeholder="Ex : Organisation"
                                        className={fieldClass}
                                    />
                                    {errors.label && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.label}</p>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className={labelClass}>Nom technique</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Ex : organisation"
                                        className={fieldClass}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className={labelClass}>Type de champ</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData("type", e.target.value)}
                                        className={fieldClass}
                                    >
                                        {FIELD_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Required */}
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-4">
                                    <input
                                        type="checkbox"
                                        checked={data.is_required}
                                        onChange={(e) => setData("is_required", e.target.checked)}
                                        className="h-4 w-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30"
                                    />
                                    <span className="text-[13px] font-medium text-[#1f2d2d]">
                                        Champ obligatoire
                                    </span>
                                </label>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 border-t border-[#EAECE9] pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddField(false)}
                                        className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#BF5429] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                                    >
                                        <Save size={16} strokeWidth={1.8} />
                                        {processing ? "Ajout..." : "Ajouter le champ"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}