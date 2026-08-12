import { useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const slugify = (str) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        type: "research",
    });

    const [slugTouched, setSlugTouched] = useState(false);

    const handleName = (value) => {
        setData((prev) => ({
            ...prev,
            name: value,
            slug: slugTouched ? prev.slug : slugify(value),
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("categories.store"));
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
                            Nouvelle catégorie
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Utilisée pour classer les Recherches, Publications et Insights.
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
                            onChange={(e) => handleName(e.target.value)}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                            placeholder="Human Capital & Work"
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
                            onChange={(e) => {
                                setSlugTouched(true);
                                setData("slug", e.target.value);
                            }}
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] font-mono text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                            placeholder="human-capital-work"
                        />
                        <p className="mt-1 text-[11px] text-[#8A9290]">
                            Généré automatiquement à partir du nom — modifiable si besoin.
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
                            placeholder="Courte description du pilier thématique..."
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
                            disabled={processing}
                            className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                        >
                            {processing ? "Enregistrement..." : "Créer la catégorie"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}