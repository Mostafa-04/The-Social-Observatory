import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import {
    ArrowLeft,
    ImagePlus,
    CalendarDays,
    Clock,
    Globe2,
    MapPin,
    Building2,
    Link2,
    Flag,
    Tag,
} from "lucide-react";

const EVENT_TYPE_OPTIONS = [
    { value: "conference", label: "Conférence" },
    { value: "workshop", label: "Atelier" },
    { value: "seminar", label: "Séminaire" },
    { value: "webinar", label: "Webinaire" },
    { value: "forum", label: "Forum" },
    { value: "roundtable", label: "Table ronde" },
    { value: "training", label: "Formation" },
    { value: "meeting", label: "Réunion" },
];

const STATUS_OPTIONS = [
    { value: "upcoming", label: "À venir" },
    { value: "ongoing", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "cancelled", label: "Annulé" },
];

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#5B6462]";

export default function Edit({ event, countries }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",

        title: event.title || "",
        description: event.description || "",
        slug: event.slug || "",

        event_type: event.event_type || "conference",

        country_id: event.country_id || "",

        city: event.city || "",
        location: event.location || "",

        date: event.date || "",
        start_time: event.start_time || "",
        end_time: event.end_time || "",

        registration_link: event.registration_link || "",

        image: null,

        status: event.status || "upcoming",
    });

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const isFirstRun = useRef(true);

    // Récupère la liste des villes à chaque changement de pays.
    // Au premier rendu (chargement de l'événement existant), on ne
    // réinitialise pas la ville déjà enregistrée.
    useEffect(() => {
        if (!data.country_id) {
            setCities([]);
            isFirstRun.current = false;
            return;
        }

        setLoadingCities(true);

        if (!isFirstRun.current) {
            setData((prev) => ({ ...prev, city: "" }));
        }

        axios
            .get(route("countries.cities", data.country_id))
            .then((res) => {
                setCities(res.data.cities ?? []);
            })
            .catch(() => {
                setCities([]);
            })
            .finally(() => {
                setLoadingCities(false);
                isFirstRun.current = false;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.country_id]);

    const submit = (e) => {
        e.preventDefault();

        post(route("events.update", event.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Modifier l'événement" />

            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                            Contenu — Événements
                        </p>
                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Modifier l'événement
                        </h1>
                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Mettre à jour les informations de l'événement.
                        </p>
                    </div>

                    <Link
                        href={route("events.index")}
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
                                    <label className={labelClass}>
                                        Titre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        className={fieldClass}
                                        placeholder="Titre de l'événement"
                                    />
                                    {errors.title && <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className={labelClass}>
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData("slug", e.target.value)}
                                        className={fieldClass}
                                        placeholder="slug-de-levenement"
                                    />
                                    {errors.slug && <p className="mt-1 text-[12px] text-red-500">{errors.slug}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelClass}>
                                        Description <span className="text-red-500">*</span>
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

                            {/* Image */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">
                                <label className={labelClass}>Image de l'événement</label>

                                {event.image && (
                                    <img
                                        src={`/storage/${event.image}`}
                                        alt={event.title}
                                        className="mb-3 h-48 w-72 rounded-lg border border-[#D6D9D8] object-cover"
                                    />
                                )}

                                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-3 text-[13px] text-[#5B6462] transition hover:border-[#BF5429]/50">
                                    <ImagePlus size={16} strokeWidth={1.8} />
                                    {data.image ? data.image.name : "Choisir un fichier..."}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData("image", e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                <p className="mt-1.5 text-[12px] text-[#8A9290]">
                                    Laisser vide pour conserver l'image actuelle.
                                </p>
                                {errors.image && (
                                    <p className="mt-1 text-[12px] text-red-500">{errors.image}</p>
                                )}
                            </div>
                        </div>

                        {/* ============ SIDEBAR COLUMN ============ */}
                        <div className="space-y-6">
                            {/* Publish box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
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
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="mt-1 text-[12px] text-red-500">{errors.status}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <Tag size={12} strokeWidth={2} />
                                        Type d'événement
                                    </label>
                                    <select
                                        value={data.event_type}
                                        onChange={(e) => setData("event_type", e.target.value)}
                                        className={fieldClass}
                                    >
                                        {EVENT_TYPE_OPTIONS.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.event_type && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.event_type}</p>
                                    )}
                                </div>

                                <div className="border-t border-[#EAECE9] pt-5 space-y-4">
                                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9290]">
                                        <CalendarDays size={12} strokeWidth={2} />
                                        Date et heure
                                    </p>
                                    <div>
                                        <label className={labelClass}>Date  <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData("date", e.target.value)}
                                            className={fieldClass}
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-[12px] text-red-500">{errors.date}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} strokeWidth={1.8} />
                                                    Début
                                                     <span className="text-red-500">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e) => setData("start_time", e.target.value)}
                                                className={fieldClass}
                                            />
                                            {errors.start_time && (
                                                <p className="mt-1 text-[12px] text-red-500">{errors.start_time}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={labelClass}>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} strokeWidth={1.8} />
                                                    Fin <span className="text-red-500">*</span>
                                                </span>
                                            </label>
                                            <input
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) => setData("end_time", e.target.value)}
                                                className={fieldClass}
                                            />
                                            {errors.end_time && (
                                                <p className="mt-1 text-[12px] text-red-500">{errors.end_time}</p>
                                            )}
                                        </div>
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
                                        href={route("events.index")}
                                        className="block w-full rounded-lg border border-[#D6D9D8] px-6 py-2.5 text-center text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>

                            {/* Location box */}
                            <div className="rounded-xl border border-[#D6D9D8] bg-white p-5 shadow-sm space-y-5">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]">
                                        <Globe2 size={13} strokeWidth={1.8} />
                                        Pays
                                        <span className="text-red-500">*</span>
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
                                        <Building2 size={13} strokeWidth={1.8} />
                                        Ville
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.city}
                                        onChange={(e) => setData("city", e.target.value)}
                                        disabled={!data.country_id || loadingCities}
                                        className={fieldClass}
                                    >
                                        <option value="">
                                            {!data.country_id
                                                ? "Sélectionnez d'abord un pays"
                                                : loadingCities
                                                ? "Chargement des villes..."
                                                : cities.length === 0
                                                ? "Aucune ville trouvée"
                                                : "Sélectionner une ville"}
                                        </option>
                                        {/* Si la ville enregistrée n'est pas (encore) dans la liste
                                            chargée, on l'ajoute quand même pour ne pas la perdre. */}
                                        {data.city && !cities.includes(data.city) && (
                                            <option value={data.city}>{data.city}</option>
                                        )}
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city && <p className="mt-1 text-[12px] text-red-500">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#5B6462]">
                                        <MapPin size={13} strokeWidth={1.8} />
                                        Lieu
                                         <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData("location", e.target.value)}
                                        className={fieldClass}
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-[12px] text-red-500">{errors.location}</p>
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