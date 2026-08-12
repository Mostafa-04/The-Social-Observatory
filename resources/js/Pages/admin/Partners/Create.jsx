import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Building2, Upload, Globe } from "lucide-react";
import { useState } from "react";

const TYPES = [
    { value: "government", label: "Institution gouvernementale" },
    { value: "ngo", label: "ONG" },
    { value: "university", label: "Université" },
    { value: "international_organization", label: "Organisation internationale" },
    { value: "private_company", label: "Entreprise privée" },
    { value: "foundation", label: "Fondation" },
    { value: "research_center", label: "Centre de recherche" },
    { value: "other", label: "Autre" },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        logo: "",
        website: "",
        type: "other",
        description: "",
    });

    const [preview, setPreview] = useState(null);

    const handleLogo = (file) => {
        setData("logo", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("partners.store"));
    };

    return (
        <AdminLayout>
            <Head title="Créer un partenaire" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires — Partenaires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Nouveau partenaire
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Ajouter une organisation partenaire affichée sur le site public.
                        </p>
                    </div>

                    <Link
                        href={route("partners.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-start">
                            {/* Logo */}
                            <div>
                                <label className="mb-2 block text-[12px] font-medium text-[#5B6462]">
                                    Logo
                                </label>
                                <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D6D9D8] bg-[#F7F8F6] transition hover:border-[#BF5429]/50">
                                    {preview ? (
                                        <img src={preview} alt="" className="h-full w-full object-contain p-2" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-[#8A9290]">
                                            <Building2 size={20} strokeWidth={1.5} />
                                            <Upload size={11} strokeWidth={1.8} />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleLogo(e.target.files[0])}
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                </label>
                                {errors.logo && (
                                    <p className="mt-1.5 text-[12px] text-red-500 max-w-24">{errors.logo}</p>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Nom du partenaire
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="Horizon Foundation"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Site web
                                    </label>
                                    <div className="relative">
                                        <Globe size={15} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]" />
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData("website", e.target.value)}
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 pl-10 pr-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="https://exemple.org"
                                        />
                                    </div>
                                    {errors.website && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.website}</p>
                                    )}
                                </div>
                            </div>
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
                                {TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
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
                                placeholder="Description du partenariat..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                            <Link
                                href={route("partners.index")}
                                className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                            >
                                {processing ? "Enregistrement..." : "Créer le partenaire"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}