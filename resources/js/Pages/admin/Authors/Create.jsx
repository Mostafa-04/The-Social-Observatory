import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, User, Upload } from "lucide-react";
import { useState } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        position: "",
        bio: "",
        linkedin: "",
        photo: null,
    });

    const [preview, setPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        post(route("authors.store"), {
            forceFormData: true,
        });
    };

    const handlePhoto = (file) => {
        setData("photo", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <AdminLayout>
            <Head title="Créer un auteur" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Répertoires — Auteurs
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Nouvel auteur
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Ajouter un chercheur ou contributeur affiché sur le site public.
                        </p>
                    </div>

                    <Link
                        href={route("authors.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-start">
                            {/* Photo */}
                            <div>
                                <label className="mb-2 block text-[12px] font-medium text-[#5B6462]">
                                    Photo
                                </label>

                                <label className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-[#D6D9D8] bg-[#F7F8F6] transition hover:border-[#BF5429]/50">
                                    {preview ? (
                                        <img src={preview} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-[#8A9290]">
                                            <User size={22} strokeWidth={1.5} />
                                            <Upload size={12} strokeWidth={1.8} />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhoto(e.target.files[0])}
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                </label>

                                {errors.photo && (
                                    <p className="mt-1.5 text-[12px] text-red-500 max-w-28">{errors.photo}</p>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Nom complet
                                         <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="Dr. Yasmine Idrissi"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Poste
                                         <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => setData("position", e.target.value)}
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="Chercheuse, Professeur..."
                                    />
                                    {errors.position && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.position}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={data.linkedin}
                                onChange={(e) => setData("linkedin", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                placeholder="https://linkedin.com/in/..."
                            />
                            {errors.linkedin && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.linkedin}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                Biographie
                            </label>
                            <textarea
                                rows={6}
                                value={data.bio}
                                onChange={(e) => setData("bio", e.target.value)}
                                className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white resize-none"
                                placeholder="Biographie de l'auteur..."
                            />
                            {errors.bio && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.bio}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">
                            <Link
                                href={route("authors.index")}
                                className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                            >
                                {processing ? "Enregistrement..." : "Créer l'auteur"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}