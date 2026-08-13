import React from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    MapPin,
    Mail,
    Phone,
    User,
    Send,
    CheckCircle2,
} from "lucide-react";
import DynamicField from "@/Components/DynamicField";

const fieldClass =
    "w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-3 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white";
const fieldWithIconClass = `${fieldClass} pl-10`;
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#1f2d2d]";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#BF5429]/10 text-[#BF5429]">
                <Icon size={16} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-[#8A9290]">
                    {label}
                </p>
                <p className="mt-0.5 truncate text-[14px] font-medium text-[#1f2d2d]">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function PublicRegistration({ event, registrationForm }) {
    const initialFields = {};

    registrationForm.fields.forEach((field) => {
        if (field.type === "checkbox") {
            initialFields[field.id] = [];
        } else {
            initialFields[field.id] = "";
        }
    });

    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
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

    return (
        <>
            <Head title={`Inscription — ${event.title}`} />

            <div className="min-h-screen bg-[#F7F8F6] py-10">
                <div className="mx-auto max-w-3xl px-6">
                    {/* Event header */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-[#D6D9D8] bg-white shadow-sm">
                        {event.image ? (
                            <img
                                src={`/storage/${event.image}`}
                                alt={event.title}
                                className="h-56 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-24 items-center bg-gradient-to-r from-[#324949] to-[#243636] px-8">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                                    Inscription à l'événement
                                </p>
                            </div>
                        )}

                        <div className="p-7">
                            <h1 className="font-display text-[26px] leading-tight text-[#1f2d2d]">
                                {event.title}
                            </h1>

                            {event.description && (
                                <p className="mt-2.5 text-[14px] leading-relaxed text-[#5B6462]">
                                    {event.description}
                                </p>
                            )}

                            <div className="mt-6 grid gap-5 border-t border-[#EAECE9] pt-6 sm:grid-cols-3">
                                <InfoItem
                                    icon={Calendar}
                                    label="Date"
                                    value={event.date}
                                />
                                <InfoItem
                                    icon={Clock}
                                    label="Horaire"
                                    value={`${event.start_time} - ${event.end_time}`}
                                />
                                <InfoItem
                                    icon={MapPin}
                                    label="Lieu"
                                    value={`${event.location}, ${event.city}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Registration form */}
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-[#D6D9D8] bg-white p-7 shadow-sm"
                    >
                        <div className="mb-7">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                Formulaire d'inscription
                            </p>
                            <h2 className="mt-1 font-display text-xl text-[#1f2d2d]">
                                {registrationForm.title}
                            </h2>

                            {registrationForm.description && (
                                <p className="mt-1.5 text-[13px] text-[#5B6462]">
                                    {registrationForm.description}
                                </p>
                            )}
                        </div>

                        {/* System fields */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* First name */}
                            <div>
                                <label className={labelClass}>Prénom *</label>
                                <div className="relative">
                                    <User
                                        size={16}
                                        strokeWidth={1.8}
                                        className="absolute left-3.5 top-3.5 text-[#8A9290]"
                                    />
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData("first_name", e.target.value)
                                        }
                                        className={fieldWithIconClass}
                                    />
                                </div>
                                {errors.first_name && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            {/* Last name */}
                            <div>
                                <label className={labelClass}>Nom *</label>
                                <div className="relative">
                                    <User
                                        size={16}
                                        strokeWidth={1.8}
                                        className="absolute left-3.5 top-3.5 text-[#8A9290]"
                                    />
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        className={fieldWithIconClass}
                                    />
                                </div>
                                {errors.last_name && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={labelClass}>Téléphone *</label>
                                <div className="relative">
                                    <Phone
                                        size={16}
                                        strokeWidth={1.8}
                                        className="absolute left-3.5 top-3.5 text-[#8A9290]"
                                    />
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className={fieldWithIconClass}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className={labelClass}>Email *</label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        strokeWidth={1.8}
                                        className="absolute left-3.5 top-3.5 text-[#8A9290]"
                                    />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={fieldWithIconClass}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Dynamic fields */}
                        {registrationForm.fields.some((f) => !f.is_system) && (
                            <div className="mt-8 space-y-5 border-t border-[#EAECE9] pt-7">
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
                        )}

                        {/* Submit */}
                        <div className="mt-9 border-t border-[#EAECE9] pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#BF5429] px-6 py-3.5 text-[14.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:opacity-50"
                            >
                                {processing ? (
                                    "Inscription..."
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} strokeWidth={1.8} />
                                        Confirmer mon inscription
                                    </>
                                )}
                            </button>

                            <p className="mt-3 text-center text-[12px] text-[#8A9290]">
                                Les champs marqués d'un * sont obligatoires.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}