import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

// Les `value` restent identiques (ce sont elles qui sont envoyées au backend) —
// seul le texte affiché est traduit.
const CONTINENTS = [
    { value: "Africa", label: "Afrique" },
    // { value: "Asia", label: "Asie" },
    // { value: "Europe", label: "Europe" },
    // { value: "North America", label: "Amérique du Nord" },
    // { value: "South America", label: "Amérique du Sud" },
    // { value: "Oceania", label: "Océanie" },
];

export default function Edit({ country, countries }) {
    const { data, setData, put, processing, errors } = useForm({
        name: country.name || "",
        iso_code: country.iso_code || "",
        continent: country.continent || "Africa",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("countries.update", country.id));
    };

    return (
        <AdminLayout>
            <Head title="Modifier le pays" />

            <div className="mx-auto max-w-3xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires — Pays
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier {country.name}
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations de ce pays.
                        </p>
                    </div>

                    <Link
                        href={route("countries.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Country Name */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Nom du pays
                                 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.name}
                                onChange={(e) => {
                                    const selected = countries.find(
                                        (c) => c.name === e.target.value
                                    );

                                    setData({
                                        ...data,
                                        name: selected?.name ?? "",
                                        iso_code: selected?.iso_code ?? "",
                                    });
                                }}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                            >
                                <option value="">
                                    Sélectionner un pays
                                </option>

                                {countries.map((c) => (
                                    <option key={c.iso_code} value={c.name}>
                                        {c.name} ({c.iso_code})
                                    </option>
                                ))}
                            </select>
                            {errors.name && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* ISO Code */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Code ISO
                                 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.iso_code}
                                readOnly
                                className="w-40 rounded-lg border border-[#D6D9D8] bg-[#F1F2F0] px-4 py-2.5 font-mono uppercase tracking-wider text-[14px] text-[#1f2d2d] outline-none"
                            />
                            {errors.iso_code && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.iso_code}</p>
                            )}
                        </div>

                        {/* Continent */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Continent
                            </label>
                            <select
                                value={data.continent}
                                onChange={(e) => setData("continent", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                            >
                                {CONTINENTS.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                            {errors.continent && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.continent}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                            <Link
                                href={route("countries.index")}
                                className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Mise à jour..." : "Mettre à jour"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}