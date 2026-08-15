import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ImagePlus, Building2, Globe2, FileText } from "lucide-react";

const TYPE_OPTIONS = [
    { value: "government", label: "Gouvernement" },
    { value: "ngo", label: "ONG" },
    { value: "university", label: "Université" },
    { value: "international_organization", label: "Organisation internationale" },
    { value: "private_company", label: "Entreprise privée" },
    { value: "foundation", label: "Fondation" },
    { value: "research_center", label: "Centre de recherche" },
    { value: "other", label: "Autre" },
];

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Edit({ partner }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        name: partner.name || "",
        logo: null,
        website: partner.website || "",
        type: partner.type || "other",
        description: partner.description || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("partners.update", partner.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Modifier le partenaire" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Partenaires
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier le partenaire
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations du partenaire.
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

                <form onSubmit={submit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ============ MAIN COLUMN ============ */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm space-y-6">
                                {/* Name */}
                                <div>
                                    <label className={labelClass}>Nom du partenaire  <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className={fieldClass}
                                        placeholder="Nom du partenaire"
                                    />
                                    {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-1.5">
                                            <Globe2 size={13} strokeWidth={1.8} />
                                            Site web
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData("website", e.target.value)}
                                        className={fieldClass}
                                        placeholder="https://..."
                                    />
                                    {errors.website && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.website}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-1.5">
                                            <FileText size={13} strokeWidth={1.8} />
                                            Description
                                        </span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Logo */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                                <label className={labelClass}>Logo</label>

                                {partner.logo && (
                                    <img
                                        src={`/storage/${partner.logo}`}
                                        alt={partner.name}
                                        className="mb-3 h-28 w-28 rounded-lg border border-[#D6D9D8] object-contain"
                                    />
                                )}

                                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                    <ImagePlus size={16} strokeWidth={1.8} />
                                    {data.logo ? data.logo.name : "Choisir un fichier..."}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData("logo", e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                {errors.logo && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.logo}</p>
                                )}
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            {/* Type box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Building2 size={12} strokeWidth={2} />
                                    Type de partenaire
                                </p>
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
                                {errors.type && <p className="text-[12px] text-red-500">{errors.type}</p>}

                                <div className="border-t border-[#EAECE9] pt-5 space-y-1.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                                    >
                                        {processing ? "Mise à jour..." : "Mettre à jour"}
                                    </button>
                                    <Link
                                        href={route("partners.index")}
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