import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import { ArrowLeft } from "lucide-react";

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        type: category.type || "research",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("categories.update", category.id));
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-3xl p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires — Catégories
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier {category.name}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations de cette catégorie.
                        </p>
                    </div>

                    <Link
                        href={route("categories.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm"
                >
                    {/* Name */}
                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                            Nom
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                        />
                        {errors.name && (
                            <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] font-mono text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                        />
                        <p className="mt-1 text-[11px] text-[#8A9290]">
                            Modifier le slug change l'URL publique de cette catégorie.
                        </p>
                        {errors.slug && (
                            <p className="mt-1 text-[12px] text-red-500">{errors.slug}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                            Type
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                        >
                            <option value="research">Recherche</option>
                            <option value="publication">Publication</option>
                            <option value="insight">Insight</option>
                        </select>
                        {errors.type && (
                            <p className="mt-1 text-[12px] text-red-500">{errors.type}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                            Description
                        </label>
                        <textarea
                            rows={5}
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white resize-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                        <Link
                            href={route("categories.index")}
                            className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            Annuler
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                        >
                            {processing ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}