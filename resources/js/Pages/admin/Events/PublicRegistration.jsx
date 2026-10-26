import React from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Calendar,
    CalendarRange,
    Clock,
    MapPin,
    Mail,
    Phone,
    User,
    Users,
    Building2,
    Briefcase,
    ShieldCheck,
    CheckCircle2,
    Loader2,
    ChevronDown,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import DynamicField from "@/Components/DynamicField";
import CountrySelect from "@/Components/CountrySelect";

/* ---------- Styles partagés ---------- */
const fieldClass =
    "w-full rounded-xl border border-[#D6D9D8] bg-[#F7F8F6]/60 px-4 py-3 text-[14px] text-[#1f2d2d] placeholder:text-[#8A9290]/70 outline-none transition focus:border-[#BF5429]/50 focus:bg-white focus:ring-4 focus:ring-[#BF5429]/10";
const fieldWithIconClass = `${fieldClass} pl-11`;
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#1f2d2d]";

/* ---------- Helpers ---------- */
const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "";

const formatTime = (value) => (value ? String(value).slice(0, 5) : "");

/* ---------- Petits composants ---------- */

// Info de l'événement affichée sur l'image (style verre dépoli)
function HeroInfo({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#BF5429] text-white shadow-lg shadow-[#BF5429]/30">
                <Icon size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-white/60">{label}</p>
                <p className="truncate text-[13.5px] font-medium text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}

// Titre de section du formulaire
function SectionTitle({ icon: Icon, title, subtitle }) {
    return (
        <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#324949] text-white">
                <Icon size={18} strokeWidth={1.8} />
            </div>
            <div>
                <h3 className="font-display text-[17px] leading-tight text-[#1f2d2d]">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[12.5px] text-[#8A9290]">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

// Champ avec label + icône + erreur
function Field({ label, required, icon: Icon, error, children }) {
    return (
        <div>
            <label className={labelClass}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9290]"
                    />
                )}
                {children}
            </div>
            {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
        </div>
    );
}

/* ---------- Page ---------- */
export default function PublicRegistration({ event, registrationForm }) {
    const initialFields = {};

    registrationForm.fields.forEach((field) => {
        initialFields[field.id] = field.type === "checkbox" ? [] : "";
    });

    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        gender: "",
        organisation: "",
        role: "",
        linkedin: "",
        country: "",
        fields: initialFields,
    });

    const updateField = (fieldId, value) => {
        setData("fields", {
            ...data.fields,
            [fieldId]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("events.register.store", event.slug), {
            forceFormData: true,
        });
    };

    const imageSrc = event.image ? `/storage/${event.image}` : null;
    const absoluteImage = event.image
        ? `https://the-social-observatory.com/storage/${event.image}`
        : null;

    const dateLabel = event.date_fin
        ? `${formatDate(event.date)} → ${formatDate(event.date_fin)}`
        : formatDate(event.date);

    const hasTime = event.start_time || event.end_time;
    const timeLabel = `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;
    const placeLabel = [event.location, event.city].filter(Boolean).join(", ");

    const hasDynamicFields = registrationForm.fields.some((f) => !f.is_system);

    return (
        <>
            <Head title={`Register — ${event.title}`}>
                <meta
                    name="description"
                    content={
                        event.description?.slice(0, 160) ??
                        `Register for ${event.title} at The Social Observatory.`
                    }
                />
                <link
                    rel="canonical"
                    href={`https://the-social-observatory.com/events/${event.slug}/register`}
                />

                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Register — ${event.title}`} />
                <meta
                    property="og:description"
                    content={event.description?.slice(0, 160) ?? ""}
                />
                {absoluteImage && (
                    <meta property="og:image" content={absoluteImage} />
                )}
                <meta
                    property="og:url"
                    content={`https://the-social-observatory.com/events/${event.slug}/register`}
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Register — ${event.title}`} />
                <meta
                    name="twitter:description"
                    content={event.description?.slice(0, 160) ?? ""}
                />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        name: event.title,
                        description: event.description,
                        startDate: `${event.date}T${event.start_time}`,
                        endDate: `${event.date_fin ?? event.date}T${event.end_time}`,
                        eventAttendanceMode:
                            "https://schema.org/OfflineEventAttendanceMode",
                        eventStatus: "https://schema.org/EventScheduled",
                        location: {
                            "@type": "Place",
                            name: event.location,
                            address: {
                                "@type": "PostalAddress",
                                streetAddress: event.location,
                                addressLocality: event.city,
                            },
                        },
                        image: absoluteImage ?? undefined,
                        organizer: {
                            "@type": "Organization",
                            name: "The Social Observatory",
                            url: "https://the-social-observatory.com",
                        },
                    })}
                </script>
            </Head>

            <div className="min-h-screen bg-[#F7F8F6]">
                {/* ================= HERO (pleine largeur / pleine hauteur) ================= */}
                <section className="relative overflow-hidden rounded-b-[2rem] bg-[#243636] shadow-[0_30px_70px_-20px_rgba(31,45,45,0.55)] sm:rounded-b-[3rem]">
                        {/* Image (ou fond vert si pas d'image) */}
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={event.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#324949] to-[#1b2b2b]">
                                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#BF5429]/20 blur-3xl" />
                            </div>
                        )}

                        {/* Dégradé vert : uniquement depuis le bas */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#1b2b2b] via-[#243636]/90 to-transparent" />

                        {/* Bouton : descendre vers le formulaire */}
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("register-form")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            aria-label="Aller au formulaire d'inscription"
                            className="absolute bottom-6 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 motion-safe:animate-bounce"
                        >
                            <ChevronDown size={20} />
                        </button>

                        {/* Contenu */}
                        <div
                            className={`relative mx-auto flex w-full max-w-5xl flex-col justify-end px-6 pb-24 pt-24 sm:px-9 ${
                                imageSrc ? "min-h-[100svh]" : "min-h-[70svh]"
                            }`}
                        >
                            {event.event_type && (
                                <span className="absolute left-6 top-8 inline-flex items-center rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[12px] font-medium capitalize text-white backdrop-blur-md sm:left-9">
                                    {event.event_type}
                                </span>
                            )}

                            <h1 className="font-display text-[28px] font-medium leading-tight text-white sm:text-[44px] lg:text-5xl">
                                {event.title}
                            </h1>

                            {event.description && (
                                <p className="mt-3 line-clamp-3 max-w-2xl text-[14px] leading-relaxed text-white/75">
                                    {event.description}
                                </p>
                            )}

                            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <HeroInfo
                                    icon={event.date_fin ? CalendarRange : Calendar}
                                    label={event.date_fin ? "Dates" : "Date"}
                                    value={dateLabel}
                                />
                                {hasTime && (
                                    <HeroInfo
                                        icon={Clock}
                                        label="Horaire"
                                        value={timeLabel}
                                    />
                                )}
                                {placeLabel && (
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <HeroInfo
                                            icon={MapPin}
                                            label="Lieu"
                                            value={placeLabel}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                </section>

                {/* ================= FORMULAIRE ================= */}
                <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
                    <form
                        id="register-form"
                        onSubmit={submit}
                        className="rounded-3xl border border-[#D6D9D8] bg-white p-6 shadow-[0_10px_40px_-15px_rgba(31,45,45,0.15)] sm:p-9"
                    >
                        <div className="mb-8 border-b border-[#EAECE9] pb-6">
                            <h2 className="font-display text-2xl text-[#1f2d2d]">
                                {registrationForm.title || "Inscription à l'événement"}
                            </h2>
                            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#5B6462]">
                                {registrationForm.description ||
                                    "Remplissez le formulaire ci-dessous pour confirmer votre place."}
                            </p>
                        </div>

                        {/* ---- Informations personnelles ---- */}
                        <SectionTitle
                            icon={User}
                            title="Informations personnelles"
                            subtitle="Pour vous identifier et vous contacter"
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Prénom"
                                required
                                icon={User}
                                error={errors.first_name}
                            >
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    className={fieldWithIconClass}
                                    placeholder="Votre prénom"
                                />
                            </Field>

                            <Field
                                label="Nom"
                                required
                                icon={User}
                                error={errors.last_name}
                            >
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    className={fieldWithIconClass}
                                    placeholder="Votre nom"
                                />
                            </Field>

                            <Field
                                label="Email"
                                required
                                icon={Mail}
                                error={errors.email}
                            >
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className={fieldWithIconClass}
                                    placeholder="nom@exemple.com"
                                />
                            </Field>

                            <Field
                                label="Téléphone"
                                required
                                icon={Phone}
                                error={errors.phone}
                            >
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    className={fieldWithIconClass}
                                    placeholder="+212 6 00 00 00 00"
                                />
                            </Field>

                            <Field
                                label="Genre"
                                required
                                icon={Users}
                                error={errors.gender}
                            >
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData("gender", e.target.value)}
                                    className={fieldWithIconClass}
                                >
                                    <option value="">Sélectionnez votre genre</option>
                                    <option value="H">Homme</option>
                                    <option value="F">Femme</option>
                                </select>
                            </Field>

                            <div>
                                <label className={labelClass}>
                                    Pays <span className="text-red-500">*</span>
                                </label>
                                <CountrySelect
                                    value={data.country}
                                    onChange={(value) => setData("country", value)}
                                    error={errors.country}
                                    required
                                />
                                {errors.country && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ---- Informations professionnelles ---- */}
                        <div className="mt-10 border-t border-[#EAECE9] pt-8">
                            <SectionTitle
                                icon={Briefcase}
                                title="Informations professionnelles"
                                subtitle="Votre organisation et votre rôle"
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field
                                    label="Organisation"
                                    required
                                    icon={Building2}
                                    error={errors.organisation}
                                >
                                    <input
                                        type="text"
                                        value={data.organisation}
                                        onChange={(e) =>
                                            setData("organisation", e.target.value)
                                        }
                                        className={fieldWithIconClass}
                                        placeholder="Nom de votre organisation"
                                    />
                                </Field>

                                <Field
                                    label="Rôle"
                                    required
                                    icon={Briefcase}
                                    error={errors.role}
                                >
                                    <input
                                        type="text"
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                        className={fieldWithIconClass}
                                        placeholder="Votre fonction"
                                    />
                                </Field>

                                <div className="md:col-span-2">
                                    <Field
                                        label="LinkedIn"
                                        icon={FaLinkedin}
                                        error={errors.linkedin}
                                    >
                                        <input
                                            type="text"
                                            value={data.linkedin}
                                            onChange={(e) =>
                                                setData("linkedin", e.target.value)
                                            }
                                            className={fieldWithIconClass}
                                            placeholder="https://linkedin.com/in/votre-profil"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* ---- Champs dynamiques ---- */}
                        {hasDynamicFields && (
                            <div className="mt-10 border-t border-[#EAECE9] pt-8">
                                <SectionTitle
                                    icon={CheckCircle2}
                                    title="Informations complémentaires"
                                    subtitle="Demandées par les organisateurs"
                                />
                                <div className="space-y-5">
                                    {registrationForm.fields
                                        .filter((field) => !field.is_system)
                                        .map((field) => (
                                            <DynamicField
                                                key={field.id}
                                                field={field}
                                                value={data.fields[field.id]}
                                                error={errors[`fields.${field.id}`]}
                                                onChange={updateField}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* ---- Submit ---- */}
                        <div className="mt-10 border-t border-[#EAECE9] pt-7">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#BF5429] px-6 py-4 text-[15px] font-medium text-white shadow-lg shadow-[#BF5429]/25 transition hover:bg-[#a8451f] hover:shadow-xl hover:shadow-[#BF5429]/30 focus:outline-none focus:ring-4 focus:ring-[#BF5429]/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Inscription en cours...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} strokeWidth={1.8} />
                                        Confirmer mon inscription
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-[12px] text-[#8A9290] sm:flex-row">
                                <span>
                                    Les champs marqués d'un{" "}
                                    <span className="text-red-500">*</span> sont
                                    obligatoires.
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck size={14} strokeWidth={1.8} />
                                    Vos données restent confidentielles
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}