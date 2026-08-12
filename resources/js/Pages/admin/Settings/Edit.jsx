import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Globe2,
    FileText,
    Mail,
    Phone,
    MapPin,
    Server,
    Hash,
    User,
    KeyRound,
    AtSign,
    Tag,
} from "lucide-react";
import { FaFacebook,FaLinkedin,FaTwitter,FaYoutube, } from "react-icons/fa";

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const labelClass = "mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]";

function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
            <p className="mb-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                <Icon size={13} strokeWidth={2} />
                {title}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
        </div>
    );
}

export default function Edit({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",

        site_name: setting.site_name || "",
        site_description: setting.site_description || "",

        logo: null,
        favicon: null,

        email: setting.email || "",
        phone: setting.phone || "",
        address: setting.address || "",

        facebook: setting.facebook || "",
        linkedin: setting.linkedin || "",
        twitter: setting.twitter || "",
        youtube: setting.youtube || "",

        seo_title: setting.seo_title || "",
        seo_description: setting.seo_description || "",
        seo_keywords: setting.seo_keywords || "",

        mail_host: setting.mail_host || "",
        mail_port: setting.mail_port || "",
        mail_username: setting.mail_username || "",
        mail_password: setting.mail_password || "",
        mail_from_address: setting.mail_from_address || "",
        mail_from_name: setting.mail_from_name || "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("settings.update", setting.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Modifier les paramètres" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Configuration — Paramètres
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier les paramètres
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations du site web.
                        </p>
                    </div>

                    <Link
                        href={route("settings.index")}
                        className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Retour
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* ================= GENERAL ================= */}
                    <SectionCard icon={Globe2} title="Informations générales">
                        <div>
                            <label className={labelClass}>
                                <Tag size={13} strokeWidth={1.8} />
                                Nom du site
                            </label>
                            <input
                                type="text"
                                value={data.site_name}
                                onChange={(e) => setData("site_name", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.site_name && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.site_name}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                <FileText size={13} strokeWidth={1.8} />
                                Description du site
                            </label>
                            <textarea
                                rows={4}
                                value={data.site_description}
                                onChange={(e) => setData("site_description", e.target.value)}
                                className={`${fieldClass} resize-none`}
                            />
                            {errors.site_description && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.site_description}</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* ================= CONTACT ================= */}
                    <SectionCard icon={Phone} title="Coordonnées">
                        <div>
                            <label className={labelClass}>
                                <Mail size={13} strokeWidth={1.8} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <Phone size={13} strokeWidth={1.8} />
                                Téléphone
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.phone && <p className="mt-1 text-[12px] text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                <MapPin size={13} strokeWidth={1.8} />
                                Adresse
                            </label>
                            <textarea
                                rows={4}
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                                className={`${fieldClass} resize-none`}
                            />
                            {errors.address && <p className="mt-1 text-[12px] text-red-500">{errors.address}</p>}
                        </div>
                    </SectionCard>

                    {/* ================= SOCIAL MEDIA ================= */}
                    <SectionCard icon={FaFacebook} title="Réseaux sociaux">
                        <div>
                            <label className={labelClass}>
                                <FaFacebook size={13} strokeWidth={1.8} />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={data.facebook}
                                onChange={(e) => setData("facebook", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.facebook && <p className="mt-1 text-[12px] text-red-500">{errors.facebook}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FaLinkedin size={13} strokeWidth={1.8} />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={data.linkedin}
                                onChange={(e) => setData("linkedin", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.linkedin && <p className="mt-1 text-[12px] text-red-500">{errors.linkedin}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FaTwitter size={13} strokeWidth={1.8} />
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                value={data.twitter}
                                onChange={(e) => setData("twitter", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.twitter && <p className="mt-1 text-[12px] text-red-500">{errors.twitter}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FaYoutube size={13} strokeWidth={1.8} />
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={data.youtube}
                                onChange={(e) => setData("youtube", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.youtube && <p className="mt-1 text-[12px] text-red-500">{errors.youtube}</p>}
                        </div>
                    </SectionCard>

                    {/* ================= SMTP ================= */}
                    <SectionCard icon={Server} title="Configuration mail (SMTP)">
                        <div>
                            <label className={labelClass}>
                                <Server size={13} strokeWidth={1.8} />
                                Hôte mail
                            </label>
                            <input
                                type="text"
                                value={data.mail_host}
                                onChange={(e) => setData("mail_host", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.mail_host && <p className="mt-1 text-[12px] text-red-500">{errors.mail_host}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <Hash size={13} strokeWidth={1.8} />
                                Port mail
                            </label>
                            <input
                                type="text"
                                value={data.mail_port}
                                onChange={(e) => setData("mail_port", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.mail_port && <p className="mt-1 text-[12px] text-red-500">{errors.mail_port}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <User size={13} strokeWidth={1.8} />
                                Nom d'utilisateur mail
                            </label>
                            <input
                                type="text"
                                value={data.mail_username}
                                onChange={(e) => setData("mail_username", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.mail_username && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.mail_username}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <KeyRound size={13} strokeWidth={1.8} />
                                Mot de passe mail
                            </label>
                            <input
                                type="password"
                                value={data.mail_password}
                                onChange={(e) => setData("mail_password", e.target.value)}
                                className={fieldClass}
                            />
                            <p className="mt-1.5 text-[12px] text-[#8A9290]">
                                Laisser vide pour conserver le mot de passe actuel.
                            </p>
                            {errors.mail_password && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.mail_password}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <AtSign size={13} strokeWidth={1.8} />
                                Adresse d'expédition
                            </label>
                            <input
                                type="email"
                                value={data.mail_from_address}
                                onChange={(e) => setData("mail_from_address", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.mail_from_address && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.mail_from_address}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <Tag size={13} strokeWidth={1.8} />
                                Nom d'expédition
                            </label>
                            <input
                                type="text"
                                value={data.mail_from_name}
                                onChange={(e) => setData("mail_from_name", e.target.value)}
                                className={fieldClass}
                            />
                            {errors.mail_from_name && (
                                <p className="mt-1 text-[12px] text-red-500">{errors.mail_from_name}</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* ================= ACTIONS ================= */}
                    <div className="flex justify-end gap-3 rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm">
                        <Link
                            href={route("settings.index")}
                            className="rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
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
        </AdminLayout>
    );
}