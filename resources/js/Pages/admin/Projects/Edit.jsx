import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ImagePlus, Globe2, Handshake, Calendar, Flag } from "lucide-react";

const STATUS_OPTIONS = [
    { value: "planned", label: "Planifié" },
    { value: "ongoing", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
];

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Edit({ project, countries, partners }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        title: project.title || "",
        description: project.description || "",
        objective: project.objective || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status: project.status || "planned",
        featured_image: null,
        country_id: project.country_id || "",
        partner_id: project.partner_id || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("projects.update", project.id), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Modifier le projet" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Projets
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier {project.title}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations de ce projet.
                        </p>
                    </div>

                    <Link
                        href={route("projects.index")}
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
                                    <label className={labelClass}>Titre</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className={fieldClass}
                                    />
                                    {errors.title && <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelClass}>Description</label>
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

                                {/* Objective */}
                                <div>
                                    <label className={labelClass}>Objectif</label>
                                    <textarea
                                        rows={4}
                                        value={data.objective}
                                        onChange={(e) => setData("objective", e.target.value)}
                                        className={`${fieldClass} resize-none`}
                                    />
                                    {errors.objective && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.objective}</p>
                                    )}
                                </div>
                            </div>

                            {/* Featured image */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                                <label className={labelClass}>Image mise en avant</label>

                                {project.featured_image && (
                                    <img
                                        src={`/storage/${project.featured_image}`}
                                        alt={project.title}
                                        className="mb-4 h-44 w-full max-w-md rounded-lg border border-[#D6D9D8] object-cover"
                                    />
                                )}

                                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                    <ImagePlus size={16} strokeWidth={1.8} />
                                    {data.featured_image ? data.featured_image.name : "Choisir un nouveau fichier..."}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData("featured_image", e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-2 text-[11.5px] text-[#8A9290]">
                                    Laisser vide pour garder l'image actuelle.
                                </p>
                                {errors.featured_image && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.featured_image}</p>
                                )}
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            {/* Publish box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                    <Flag size={12} strokeWidth={2} />
                                    Statut
                                </p>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className={fieldClass}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-[12px] text-red-500">{errors.status}</p>}

                                <div className="border-t border-[#EAECE9] pt-5 space-y-4">
                                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <Calendar size={12} strokeWidth={2} />
                                        Calendrier
                                    </p>
                                    <div>
                                        <label className={labelClass}>Date de début</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData("start_date", e.target.value)}
                                            className={fieldClass}
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-[12px] text-red-500">{errors.start_date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Date de fin</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData("end_date", e.target.value)}
                                            className={fieldClass}
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-[12px] text-red-500">{errors.end_date}</p>
                                        )}
                                    </div>
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
                                        href={route("projects.index")}
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
                                        <Globe2 size={13} strokeWidth={1.8} />
                                        Pays
                                    </label>
                                    <select
                                        value={data.country_id}
                                        onChange={(e) => setData("country_id", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="">Sélectionner un pays</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country_id && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.country_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]">
                                        <Handshake size={13} strokeWidth={1.8} />
                                        Partenaire
                                    </label>
                                    <select
                                        value={data.partner_id || ""}
                                        onChange={(e) => setData("partner_id", e.target.value)}
                                        className={fieldClass}
                                    >
                                        <option value="">Aucun partenaire</option>
                                        {partners.map((partner) => (
                                            <option key={partner.id} value={partner.id}>
                                                {partner.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.partner_id && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.partner_id}</p>
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