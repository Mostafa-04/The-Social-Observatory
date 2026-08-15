import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    FileText,
    Calendar,
    ToggleRight,
    AlignLeft,
} from "lucide-react";

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Create({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("registration-forms.store", event.id));
    };

    return (
        <AdminLayout>
            <Head title="Créer un formulaire d'inscription" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Formulaires d'inscription
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Nouveau formulaire
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Créer le formulaire d'inscription pour cet événement.
                        </p>
                    </div>

                    <Link
                        href={route("events.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ============ MAIN COLUMN ============ */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm space-y-6">
                                {/* Title */}
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-1.5">
                                            <FileText size={13} strokeWidth={1.8} />
                                            Titre du formulaire
                                             <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className={fieldClass}
                                        placeholder="Ex : Formulaire d'inscription"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-1.5">
                                            <AlignLeft size={13} strokeWidth={1.8} />
                                            Description
                                             <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                        placeholder="Décrivez le formulaire d'inscription..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            {/* Publish box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <ToggleRight size={12} strokeWidth={2} />
                                        Statut
                                    </label>
                                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30"
                                        />
                                        <div>
                                            <p className="text-[13px] font-medium text-[#1f2d2d]">
                                                Activer le formulaire
                                            </p>
                                            <p className="mt-0.5 text-[12px] text-[#5B6462]">
                                                Les participants pourront s'inscrire via ce formulaire.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5 space-y-1.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                                    >
                                        {processing ? "Création..." : "Créer le formulaire"}
                                    </button>
                                    <Link
                                        href={route("events.index")}
                                        className="block w-full rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-center text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>

                            {/* Event info box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">
                                <label className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Calendar size={12} strokeWidth={2} />
                                    Événement
                                </label>
                                <p className="text-[14px] font-medium text-[#1f2d2d]">
                                    {event.title}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}