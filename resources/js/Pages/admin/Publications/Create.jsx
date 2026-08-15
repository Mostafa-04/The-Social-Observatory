import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ImagePlus, FileUp, BookOpen, Languages, Hash, Calendar } from "lucide-react";

const TYPE_OPTIONS = [
    { value: "book", label: "Livre" },
    { value: "report", label: "Rapport" },
    { value: "policy_brief", label: "Note de politique" },
    { value: "white_paper", label: "Livre blanc" },
    { value: "study", label: "Étude" },
];

const LANGUAGE_OPTIONS = [
    { value: "FR", label: "Français" },
    { value: "EN", label: "Anglais" },
    { value: "AR", label: "Arabe" },
];

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        type: "book",
        description: "",
        cover_image: null,
        pdf: null,
        pages: "",
        language: "FR",
        published_at: new Date().toISOString().slice(0, 10),
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("publications.store"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Créer une publication" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Publications
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Nouvelle publication
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Ajouter une nouvelle publication.
                        </p>
                    </div>

                    <Link
                        href={route("publications.index")}
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
                                    <label className={labelClass}>Titre  <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className={fieldClass}
                                        placeholder="Titre de la publication"
                                    />
                                    {errors.title && <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Files */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm space-y-5">
                                {/* Cover image */}
                                <div>
                                    <label className={labelClass}>Image de couverture</label>
                                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                        <ImagePlus size={16} strokeWidth={1.8} />
                                        {data.cover_image ? data.cover_image.name : "Choisir un fichier..."}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData("cover_image", e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {errors.cover_image && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.cover_image}</p>
                                    )}
                                </div>

                                {/* PDF */}
                                <div>
                                    <label className={labelClass}>Fichier PDF</label>
                                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                        <FileUp size={16} strokeWidth={1.8} />
                                        {data.pdf ? data.pdf.name : "Choisir un fichier..."}
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setData("pdf", e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {errors.pdf && <p className="mt-1 text-[12px] text-red-500">{errors.pdf}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            {/* Publish box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <BookOpen size={12} strokeWidth={2} />
                                        Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData("type", e.target.value)}
                                        className={fieldClass}
                                    >
                                        {TYPE_OPTIONS.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="mt-1 text-[12px] text-red-500">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <Languages size={12} strokeWidth={2} />
                                        Langue
                                    </label>
                                    <select
                                        value={data.language}
                                        onChange={(e) => setData("language", e.target.value)}
                                        className={fieldClass}
                                    >
                                        {LANGUAGE_OPTIONS.map((l) => (
                                            <option key={l.value} value={l.value}>
                                                {l.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.language && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.language}</p>
                                    )}
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5 space-y-4">
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                            <Hash size={12} strokeWidth={2} />
                                            Pages
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.pages}
                                            onChange={(e) => setData("pages", e.target.value)}
                                            className={fieldClass}
                                        />
                                        {errors.pages && (
                                            <p className="mt-1 text-[12px] text-red-500">{errors.pages}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                            <Calendar size={12} strokeWidth={2} />
                                            Date de publication
                                        </label>
                                        <input
                                            type="date"
                                            value={data.published_at}
                                            onChange={(e) => setData("published_at", e.target.value)}
                                            className={fieldClass}
                                        />
                                        {errors.published_at && (
                                            <p className="mt-1 text-[12px] text-red-500">{errors.published_at}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5 space-y-1.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                                    >
                                        {processing ? "Création..." : "Créer la publication"}
                                    </button>
                                    <Link
                                        href={route("publications.index")}
                                        className="block w-full rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-center text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}