import React from "react";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#BF5429]/10 text-[#BF5429]">
                <Icon size={16} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-[#8A9290]">
                    {label}
                </p>
                <p className="mt-0.5 text-[14px] font-medium text-[#1f2d2d]">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function RegistrationSuccess({ event }) {
    return (
        <>
            <Head title="Inscription confirmée" />

            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F6] px-6 py-12">
                <div className="w-full max-w-xl rounded-2xl border border-[#D6D9D8] bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#BF5429]/10 text-[#BF5429]">
                        <CheckCircle size={32} strokeWidth={1.8} />
                    </div>

                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                        Inscription réussie
                    </p>

                    <h1 className="mt-1.5 font-display text-[26px] text-[#1f2d2d]">
                        C'est confirmé !
                    </h1>

                    <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-[#5B6462]">
                        Votre inscription à{" "}
                        <strong className="font-medium text-[#1f2d2d]">
                            {event.title}
                        </strong>{" "}
                        a bien été enregistrée. Un email de confirmation vous a été envoyé.
                    </p>

                    <div className="mt-8 space-y-4 rounded-xl border border-[#EAECE9] bg-[#F7F8F6]/50 p-5 text-left">
                        <InfoRow icon={Calendar} label="Date" value={event.date} />
                        {(event.start_time || event.end_time) && (
                            <InfoRow
                                icon={Clock}
                                label="Horaire"
                                value={`${event.start_time ?? ""}${
                                    event.start_time && event.end_time ? " - " : ""}
                                }${event.end_time ?? ""}`}
                            />
                        )}
                        <InfoRow
                            icon={MapPin}
                            label="Lieu"
                            value={`${event.location}, ${event.city}`}
                        />
                    </div>

                    <Link
                        href="/"
                        className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#324949] transition hover:text-[#BF5429]"
                    >
                        Retour à l'accueil
                        <ArrowRight size={14} strokeWidth={1.8} />
                    </Link>
                </div>
            </div>
        </>
    );
}