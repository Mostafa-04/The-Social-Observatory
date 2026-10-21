import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    CheckCircle,
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    Sparkles,
    Mail,
} from "lucide-react";


 function formatDate(value, { withTime = false } = {}) {
    if (!value) return "—";

    const date = value instanceof Date ? value : new Date(value);

    // Date invalide
    if (isNaN(date.getTime())) return "—";

    const dateStr = new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);

    if (!withTime) return dateStr;

    const timeStr = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);

    return `${dateStr} à ${timeStr}`;
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="group flex items-start gap-3.5 rounded-lg p-2 transition-colors hover:bg-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#BF5429]/10 text-[#BF5429] transition-transform group-hover:scale-105">
                <Icon size={17} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 pt-0.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8A9290]">
                    {label}
                </p>
                <p className="mt-1 text-[14px] font-medium leading-snug text-[#1f2d2d]">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function RegistrationSuccess({ event }) {
    const fullName = event?.first_name
        ? `${event.first_name} ${event.last_name ?? ""}`.trim()
        : null;

    return (
        <>
            <Head title="Inscription confirmée" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F8F6] px-6 py-12">
                {/* Décorations d'arrière-plan */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#BF5429]/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#1f2d2d]/5 blur-3xl" />

                {/* Card principale */}
                <div className="relative w-full max-w-xl">
                    {/* Bordure dégradée supérieure */}
                    <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[#BF5429]/40 to-transparent" />

                    <div className="overflow-hidden rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_8px_40px_-12px_rgba(31,45,45,0.12)]">
                        {/* Header avec fond subtil */}
                        <div className="relative bg-gradient-to-b from-[#F7F8F6] to-white px-10 pt-10 pb-6 text-center">
                            {/* Badge icône animé */}
                            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                                <div className="absolute inset-0 animate-ping rounded-full bg-[#BF5429]/10" style={{ animationDuration: "2.5s" }} />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#BF5429]/15 to-[#BF5429]/5 ring-1 ring-[#BF5429]/20">
                                    <CheckCircle size={38} strokeWidth={1.6} className="text-[#BF5429]" />
                                </div>
                            </div>

                            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#BF5429]/10 px-3 py-1">
                                <Sparkles size={11} className="text-[#BF5429]" />
                                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                    Inscription réussie
                                </span>
                            </div>

                            <h1 className="mt-3 font-display text-[28px] leading-tight text-[#1f2d2d]">
                                C'est confirmé{fullName ? `, ${fullName.split(" ")[0]}` : ""} !
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#5B6462]">
                                Votre place pour{" "}
                                <strong className="font-semibold text-[#1f2d2d]">
                                    {event.title}
                                </strong>{" "}
                                est bien réservée.
                            </p>
                        </div>

                        {/* Séparateur */}
                        <div className="mx-10 h-px bg-gradient-to-r from-transparent via-[#E4E7E5] to-transparent" />

                        {/* Détails de l'événement */}
                        <div className="px-10 py-7">
                            <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-wider text-[#8A9290]">
                                Détails de l'événement
                            </p>

                            <div className="space-y-1 rounded-xl bg-[#F7F8F6]/60 p-3 ring-1 ring-[#EAECE9]">
                                <InfoRow icon={Calendar} label="Date" value={formatDate(event.date)} />

                                {(event.start_time || event.end_time) && (
                                    <InfoRow
                                        icon={Clock}
                                        label="Horaire"
                                        value={`${event.start_time ?? ""}${
                                            event.start_time && event.end_time ? " – " : ""
                                        }${event.end_time ?? ""}`}
                                    />
                                )}

                                <InfoRow
                                    icon={MapPin}
                                    label="Lieu"
                                    value={`${event.location}, ${event.city}`}
                                />
                            </div>

                            {/* Note email */}
                            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-[#EAECE9] bg-white px-3.5 py-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1f2d2d]/5 text-[#1f2d2d]">
                                    <Mail size={13} strokeWidth={1.8} />
                                </div>
                                <p className="text-[12.5px] leading-relaxed text-[#5B6462]">
                                    Un email de confirmation contenant tous les détails vous a été envoyé.
                                </p>
                            </div>
                        </div>

                        {/* Footer avec CTA */}
                        <div className="flex items-center justify-between border-t border-[#EAECE9] bg-[#F7F8F6]/40 px-10 py-5">
                            <p className="text-[11.5px] text-[#8A9290]">
                                À bientôt !
                            </p>
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-1.5 rounded-lg bg-[#1f2d2d] px-4 py-2 text-[12.5px] font-medium text-white transition hover:bg-[#BF5429]"
                            >
                                Retour à l'accueil
                                <ArrowRight
                                    size={13}
                                    strokeWidth={2}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Mention pied de page */}
                    <p className="mt-6 text-center text-[11px] text-[#A0A8A5]">
                        The Social Observatory · Think. Observe. Anticipate. Act.
                    </p>
                </div>
            </div>
        </>
    );
}