import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    ImagePlus,
    FileUp,
    User,
    FolderOpen,
    Flag,
    Calendar,
    Link2,
    FileText,
    ExternalLink,
} from "lucide-react";

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Edit({ research, authors, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",

        title: research.title || "",
        slug: research.slug || "",
        summary: research.summary || "",
        content: research.content || "",

        featured_image: null,
        pdf: null,

        author_id: research.author_id || "",
        category_id: research.category_id || "",

        status: research.status || "draft",
        published_at: research.published_at
            ? research.published_at.slice(0, 16)
            : "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("researches.update", research.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Modifier la recherche" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Recherches
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier la recherche
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations de la recherche.
                        </p>
                    </div>

                    <Link
                        href={route("researches.index")}
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
                                        placeholder="Titre de la recherche"
                                    />
                                    {errors.title && <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-1.5">
                                            <Link2 size={13} strokeWidth={1.8} />
                                            Slug
                                             <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData("slug", e.target.value)}
                                        className={fieldClass}
                                        placeholder="titre-de-la-recherche"
                                    />
                                    {errors.slug && <p className="mt-1 text-[12px] text-red-500">{errors.slug}</p>}
                                </div>

                                {/* Summary */}
                                <div>
                                    <label className={labelClass}>Résumé  <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={4}
                                        value={data.summary}
                                        onChange={(e) => setData("summary", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                    />
                                    {errors.summary && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.summary}</p>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <label className={labelClass}>Contenu  <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={10}
                                        value={data.content}
                                        onChange={(e) => setData("content", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.content}</p>
                                    )}
                                </div>
                            </div>

                            {/* Files */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm space-y-6">
                                {/* Current image */}
                                <div>
                                    <label className={labelClass}>Image actuelle</label>

                                    {research.featured_image ? (
                                        <img
                                            src={`/storage/${research.featured_image}`}
                                            alt={research.title}
                                            className="mb-3 h-40 w-64 rounded-lg border border-[#D6D9D8] object-cover"
                                        />
                                    ) : (
                                        <div className="mb-3 flex h-40 w-64 items-center justify-center rounded-lg border border-dashed border-[#D6D9D8] text-[12px] text-[#8A9290]">
                                            Aucune image
                                        </div>
                                    )}

                                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                        <ImagePlus size={16} strokeWidth={1.8} />
                                        {data.featured_image ? data.featured_image.name : "Choisir un fichier..."}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData("featured_image", e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="mt-1.5 text-[12px] text-[#8A9290]">
                                        Laisser vide pour conserver l'image actuelle.
                                    </p>
                                    {errors.featured_image && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.featured_image}</p>
                                    )}
                                </div>

                                {/* Current PDF */}
                                <div className="border-t border-[#EAECE9] pt-6">
                                    <label className={labelClass}>Fichier PDF actuel</label>

                                    {research.pdf ? (
                                        <a
                                            href={`/storage/${research.pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-[#324949] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#243636]"
                                        >
                                            <FileText size={14} strokeWidth={1.8} />
                                            Ouvrir le PDF actuel
                                            <ExternalLink size={12} strokeWidth={1.8} />
                                        </a>
                                    ) : (
                                        <p className="mb-3 text-[13px] text-[#8A9290]">Aucun PDF téléversé</p>
                                    )}

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
                                    <p className="mt-1.5 text-[12px] text-[#8A9290]">
                                        Laisser vide pour conserver le PDF actuel.
                                    </p>
                                    {errors.pdf && <p className="mt-1 text-[12px] text-red-500">{errors.pdf}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                {/* Status */}
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <Flag size={12} strokeWidth={2} />
                                        Statut
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="draft">Brouillon</option>
                                        <option value="published">Publié</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.status}</p>
                                    )}
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5">
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <Calendar size={12} strokeWidth={2} />
                                        Date de publication
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData("published_at", e.target.value)}
                                        className={fieldClass}
                                    />
                                    {errors.published_at && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.published_at}</p>
                                    )}
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5 space-y-1.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                                    >
                                        {processing ? "Mise à jour..." : "Mettre à jour"}
                                    </button>
                                    <Link
                                        href={route("researches.index")}
                                        className="block w-full rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-center text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>

                            {/* Associations box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]">
                                        <User size={13} strokeWidth={1.8} />
                                        Auteur
                                         <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.author_id}
                                        onChange={(e) => setData("author_id", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="">Sélectionner un auteur</option>
                                        {authors.map((author) => (
                                            <option key={author.id} value={author.id}>
                                                {author.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.author_id && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.author_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]">
                                        <FolderOpen size={13} strokeWidth={1.8} />
                                        Catégorie
                                         <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData("category_id", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.category_id}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}