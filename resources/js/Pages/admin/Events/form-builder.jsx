import React, { useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    Plus,
    Trash2,
    Pencil,
    GripVertical,
    ChevronUp,
    ChevronDown,
    X,
    Save,
    Check,
    Lock,
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
    AlertCircle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Field Types
|--------------------------------------------------------------------------
*/

const FIELD_TYPES = [
    {
        value: "text",
        label: "Texte",
        icon: Type,
    },
    {
        value: "email",
        label: "Email",
        icon: Mail,
    },
    {
        value: "phone",
        label: "Téléphone",
        icon: Phone,
    },
    {
        value: "number",
        label: "Nombre",
        icon: Hash,
    },
    {
        value: "date",
        label: "Date",
        icon: Calendar,
    },
    {
        value: "textarea",
        label: "Texte long",
        icon: AlignLeft,
    },
    {
        value: "select",
        label: "Liste déroulante",
        icon: List,
    },
    {
        value: "radio",
        label: "Choix unique",
        icon: CircleDot,
    },
    {
        value: "checkbox",
        label: "Case à cocher",
        icon: CheckSquare,
    },
    {
        value: "country",
        label: "Pays",
        icon: Globe,
    },
    {
        value: "file",
        label: "Fichier",
        icon: Upload,
    },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getFieldType = (type) => {
    return FIELD_TYPES.find((item) => item.value === type);
};

const generateFieldName = (label) => {
    return label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

export default function FormBuilder({ event, form }) {
    const { flash, errors } = usePage().props;

    const [showCreateModal, setShowCreateModal] = useState(!form);
    const [showFieldModal, setShowFieldModal] = useState(false);
    const [editingField, setEditingField] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Form information
    |--------------------------------------------------------------------------
    */

    const formData = useForm({
        title: form?.title ?? "",
        description: form?.description ?? "",
        is_active: form?.is_active ?? true,
    });

    /*
    |--------------------------------------------------------------------------
    | Field form
    |--------------------------------------------------------------------------
    */

    const fieldForm = useForm({
        label: "",
        name: "",
        type: "text",
        options: [],
        is_required: false,
    });

    /*
    |--------------------------------------------------------------------------
    | Sorted fields
    |--------------------------------------------------------------------------
    */

    const fields = useMemo(() => {
        if (!form?.fields) {
            return [];
        }

        return [...form.fields].sort(
            (a, b) => a.sort_order - b.sort_order
        );
    }, [form?.fields]);

    /*
    |--------------------------------------------------------------------------
    | Create / Update Form
    |--------------------------------------------------------------------------
    */

    const submitForm = (e) => {
        e.preventDefault();

        if (!form) {
            formData.post(`/admin/events/${event.id}/form`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                },
            });

            return;
        }

        formData.put(`/admin/events/${event.id}/form`, {
            preserveScroll: true,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Open Create Field Modal
    |--------------------------------------------------------------------------
    */

    const openCreateField = () => {
        fieldForm.reset();
        fieldForm.setData({
            label: "",
            name: "",
            type: "text",
            options: [],
            is_required: false,
        });

        setEditingField(null);
        setShowFieldModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Open Edit Field Modal
    |--------------------------------------------------------------------------
    */

    const openEditField = (field) => {
        fieldForm.setData({
            label: field.label ?? "",
            name: field.name ?? "",
            type: field.type ?? "text",
            options: field.options ?? [],
            is_required: Boolean(field.is_required),
        });

        setEditingField(field);
        setShowFieldModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Field Modal
    |--------------------------------------------------------------------------
    */

    const closeFieldModal = () => {
        setShowFieldModal(false);
        setEditingField(null);
        fieldForm.reset();
        fieldForm.clearErrors();
    };

    /*
    |--------------------------------------------------------------------------
    | Submit Field
    |--------------------------------------------------------------------------
    */

    const submitField = (e) => {
        e.preventDefault();

        if (editingField) {
            fieldForm.put(
                `/admin/events/${event.id}/form/fields/${editingField.id}`,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        closeFieldModal();
                    },
                }
            );

            return;
        }

        fieldForm.post(
            `/admin/events/${event.id}/form/fields`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeFieldModal();
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Field
    |--------------------------------------------------------------------------
    */

    const deleteField = (field) => {
        if (field.is_system) {
            return;
        }

        const confirmed = window.confirm(
            `Voulez-vous vraiment supprimer le champ "${field.label}" ?`
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/events/${event.id}/form/fields/${field.id}`,
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Move Field
    |--------------------------------------------------------------------------
    */

    const moveField = (index, direction) => {
        const newIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            newIndex < 0 ||
            newIndex >= fields.length
        ) {
            return;
        }

        const reordered = [...fields];

        const current = reordered[index];

        reordered[index] = reordered[newIndex];
        reordered[newIndex] = current;

        saveOrder(reordered);
    };

    /*
    |--------------------------------------------------------------------------
    | Save Order
    |--------------------------------------------------------------------------
    */

    const saveOrder = (orderedFields) => {
        router.put(
            `/admin/events/${event.id}/form/fields/reorder`,
            {
                fields: orderedFields.map(
                    (field) => field.id
                ),
            },
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Add Option
    |--------------------------------------------------------------------------
    */

    const addOption = () => {
        fieldForm.setData(
            "options",
            [
                ...(fieldForm.data.options || []),
                "",
            ]
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Update Option
    |--------------------------------------------------------------------------
    */

    const updateOption = (index, value) => {
        const options = [
            ...(fieldForm.data.options || []),
        ];

        options[index] = value;

        fieldForm.setData("options", options);
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Option
    |--------------------------------------------------------------------------
    */

    const removeOption = (index) => {
        const options = [
            ...(fieldForm.data.options || []),
        ];

        options.splice(index, 1);

        fieldForm.setData("options", options);
    };

    /*
    |--------------------------------------------------------------------------
    | Auto generate field name
    |--------------------------------------------------------------------------
    */

    const handleLabelChange = (value) => {
        fieldForm.setData({
            ...fieldForm.data,
            label: value,
            name: editingField
                ? fieldForm.data.name
                : generateFieldName(value),
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head
                title={`Formulaire - ${event.title}`}
            />

            <div className="min-h-screen bg-slate-50">
                {/* ======================================================
                    HEADER
                ====================================================== */}

                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                                    <span>
                                        Événements
                                    </span>

                                    <span>
                                        /
                                    </span>

                                    <span>
                                        {event.title}
                                    </span>

                                    <span>
                                        /
                                    </span>

                                    <span className="font-medium text-slate-700">
                                        Formulaire
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Formulaire d'inscription
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Créez et personnalisez le formulaire
                                    d'inscription pour cet événement.
                                </p>
                            </div>

                            {form && (
                                <button
                                    type="button"
                                    onClick={submitForm}
                                    disabled={formData.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />

                                    {formData.processing
                                        ? "Enregistrement..."
                                        : "Enregistrer"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ======================================================
                    FLASH
                ====================================================== */}

                {flash?.success && (
                    <div className="mx-auto max-w-7xl px-6 pt-6">
                        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            <Check className="h-5 w-5" />

                            <span>
                                {flash.success}
                            </span>
                        </div>
                    </div>
                )}

                {flash?.info && (
                    <div className="mx-auto max-w-7xl px-6 pt-6">
                        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                            <AlertCircle className="h-5 w-5" />

                            <span>
                                {flash.info}
                            </span>
                        </div>
                    </div>
                )}

                {/* ======================================================
                    CONTENT
                ====================================================== */}

                <main className="mx-auto max-w-7xl px-6 py-8">

                    {!form ? (
                        /* ==================================================
                           CREATE FORM
                        ================================================== */

                        <div className="mx-auto max-w-2xl">

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Créer le formulaire
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Commencez par créer le formulaire
                                        d'inscription de cet événement.
                                    </p>
                                </div>

                                <form
                                    onSubmit={submitForm}
                                    className="space-y-5"
                                >

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Titre du formulaire
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.data.title}
                                            onChange={(e) =>
                                                formData.setData(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex: Inscription à l'événement"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                        />

                                        {formData.errors.title && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formData.errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <textarea
                                            rows={5}
                                            value={formData.data.description}
                                            onChange={(e) =>
                                                formData.setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Description du formulaire..."
                                            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                        />

                                        {formData.errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {formData.errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formData.processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        <Plus className="h-5 w-5" />

                                        {formData.processing
                                            ? "Création..."
                                            : "Créer le formulaire"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                            {/* ==================================================
                               LEFT - FORM SETTINGS
                            ================================================== */}

                            <div className="lg:col-span-1">

                                <div className="sticky top-6 space-y-6">

                                    {/* Event Card */}

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                        <div className="mb-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Événement
                                            </p>

                                            <h2 className="mt-1 text-lg font-bold text-slate-900">
                                                {event.title}
                                            </h2>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600">

                                            <div className="flex justify-between gap-4">
                                                <span>
                                                    Date
                                                </span>

                                                <span className="font-medium text-slate-900">
                                                    {event.date}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span>
                                                    Ville
                                                </span>

                                                <span className="font-medium text-slate-900">
                                                    {event.city}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span>
                                                    Lieu
                                                </span>

                                                <span className="text-right font-medium text-slate-900">
                                                    {event.location}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Form Settings */}

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                        <h2 className="mb-5 text-base font-bold text-slate-900">
                                            Paramètres du formulaire
                                        </h2>

                                        <form
                                            onSubmit={submitForm}
                                            className="space-y-5"
                                        >

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Titre
                                                </label>

                                                <input
                                                    type="text"
                                                    value={formData.data.title}
                                                    onChange={(e) =>
                                                        formData.setData(
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                    Description
                                                </label>

                                                <textarea
                                                    rows={4}
                                                    value={formData.data.description}
                                                    onChange={(e) =>
                                                        formData.setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                                />
                                            </div>

                                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-3">

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        Formulaire actif
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Autoriser les inscriptions
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={formData.data.is_active}
                                                    onChange={(e) =>
                                                        formData.setData(
                                                            "is_active",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-5 w-5 rounded border-slate-300"
                                                />

                                            </label>

                                            <button
                                                type="submit"
                                                disabled={formData.processing}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                <Save className="h-4 w-4" />

                                                Enregistrer
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                               RIGHT - FIELDS
                            ================================================== */}

                            <div className="lg:col-span-2">

                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    {/* Header */}

                                    <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                Champs du formulaire
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {fields.length} champ
                                                {fields.length > 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={openCreateField}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            <Plus className="h-4 w-4" />

                                            Ajouter un champ
                                        </button>

                                    </div>

                                    {/* Fields */}

                                    <div className="divide-y divide-slate-100">

                                        {fields.length === 0 ? (

                                            <div className="p-12 text-center">

                                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                                    <Type className="h-6 w-6 text-slate-400" />
                                                </div>

                                                <h3 className="font-semibold text-slate-900">
                                                    Aucun champ
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Ajoutez votre premier champ.
                                                </p>

                                            </div>

                                        ) : (

                                            fields.map((field, index) => {

                                                const fieldType =
                                                    getFieldType(field.type);

                                                const Icon =
                                                    fieldType?.icon || Type;

                                                return (
                                                    <div
                                                        key={field.id}
                                                        className="group flex items-center gap-4 p-5 transition hover:bg-slate-50"
                                                    >

                                                        {/* Drag */}

                                                        <div className="hidden cursor-grab text-slate-300 sm:block">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>

                                                        {/* Icon */}

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                                            <Icon className="h-5 w-5 text-slate-600" />
                                                        </div>

                                                        {/* Info */}

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex flex-wrap items-center gap-2">

                                                                <h3 className="font-semibold text-slate-900">
                                                                    {field.label}
                                                                </h3>

                                                                {field.is_required && (
                                                                    <span className="text-red-500">
                                                                        *
                                                                    </span>
                                                                )}

                                                                {field.is_system && (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                                                                        <Lock className="h-3 w-3" />

                                                                        Système
                                                                    </span>
                                                                )}

                                                            </div>

                                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                                                                <span>
                                                                    {fieldType?.label ||
                                                                        field.type}
                                                                </span>

                                                                <span>
                                                                    •
                                                                </span>

                                                                <code className="rounded bg-slate-100 px-1.5 py-0.5">
                                                                    {field.name}
                                                                </code>

                                                            </div>

                                                            {(field.type === "select" ||
                                                                field.type === "radio") &&
                                                                field.options?.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                                        {field.options.map(
                                                                            (option, optionIndex) => (
                                                                                <span
                                                                                    key={optionIndex}
                                                                                    className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                                                                                >
                                                                                    {option}
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}

                                                        </div>

                                                        {/* Actions */}

                                                        <div className="flex shrink-0 items-center gap-1">

                                                            {/* Up */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    moveField(
                                                                        index,
                                                                        "up"
                                                                    )
                                                                }
                                                                disabled={
                                                                    index === 0
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                                                                title="Monter"
                                                            >
                                                                <ChevronUp className="h-4 w-4" />
                                                            </button>

                                                            {/* Down */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    moveField(
                                                                        index,
                                                                        "down"
                                                                    )
                                                                }
                                                                disabled={
                                                                    index ===
                                                                    fields.length - 1
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                                                                title="Descendre"
                                                            >
                                                                <ChevronDown className="h-4 w-4" />
                                                            </button>

                                                            {/* Edit */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditField(
                                                                        field
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                                title="Modifier"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>

                                                            {/* Delete */}

                                                            {!field.is_system && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteField(
                                                                            field
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}

                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ==========================================================
                FIELD MODAL
            ========================================================== */}

            {showFieldModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

                    <div
                        className="absolute inset-0"
                        onClick={closeFieldModal}
                    />

                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingField
                                        ? "Modifier le champ"
                                        : "Ajouter un champ"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Configurez les informations du champ.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeFieldModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* Modal Body */}

                        <form
                            onSubmit={submitField}
                            className="space-y-6 p-6"
                        >

                            {/* Label */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Label
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={fieldForm.data.label}
                                    onChange={(e) =>
                                        handleLabelChange(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex: Fonction"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                />

                                {fieldForm.errors.label && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fieldForm.errors.label}
                                    </p>
                                )}
                            </div>

                            {/* Name */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nom technique
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={fieldForm.data.name}
                                    onChange={(e) =>
                                        fieldForm.setData(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex: fonction"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                />

                                <p className="mt-1 text-xs text-slate-500">
                                    Utilisez uniquement des lettres,
                                    chiffres et underscore.
                                </p>

                                {fieldForm.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fieldForm.errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Type */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Type de champ
                                </label>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                                    {FIELD_TYPES.map((item) => {

                                        const Icon = item.icon;

                                        const selected =
                                            fieldForm.data.type ===
                                            item.value;

                                        return (
                                            <button
                                                type="button"
                                                key={item.value}
                                                onClick={() =>
                                                    fieldForm.setData(
                                                        "type",
                                                        item.value
                                                    )
                                                }
                                                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${
                                                    selected
                                                        ? "border-slate-900 bg-slate-900 text-white"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />

                                                <span>
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}

                                </div>

                                {fieldForm.errors.type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {fieldForm.errors.type}
                                    </p>
                                )}
                            </div>

                            {/* Options */}

                            {(fieldForm.data.type === "select" ||
                                fieldForm.data.type === "radio") && (

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <div className="mb-4 flex items-center justify-between">

                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Options
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Ajoutez les choix disponibles.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addOption}
                                            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                        >
                                            <Plus className="h-3.5 w-3.5" />

                                            Ajouter
                                        </button>

                                    </div>

                                    <div className="space-y-2">

                                        {(fieldForm.data.options || []).map(
                                            (option, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) =>
                                                            updateOption(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={`Option ${index + 1}`}
                                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeOption(
                                                                index
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )
                                        )}

                                    </div>

                                    {fieldForm.errors.options && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {fieldForm.errors.options}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Required */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">

                                <input
                                    type="checkbox"
                                    checked={
                                        fieldForm.data.is_required
                                    }
                                    onChange={(e) =>
                                        fieldForm.setData(
                                            "is_required",
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 rounded border-slate-300"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Champ obligatoire
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Le participant devra remplir ce champ.
                                    </p>
                                </div>

                            </label>

                            {/* Actions */}

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeFieldModal}
                                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={fieldForm.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <Check className="h-4 w-4" />

                                    {fieldForm.processing
                                        ? "Enregistrement..."
                                        : editingField
                                            ? "Enregistrer"
                                            : "Ajouter"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}