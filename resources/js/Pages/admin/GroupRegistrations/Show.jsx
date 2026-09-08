import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Users, FileDown } from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";
import {FaLinkedin } from "react-icons/fa";

/**
 * Page admin — détail d'une inscription à un groupe de travail.
 * Attendu depuis le contrôleur (Inertia::render):
 * - registration: GroupRegistration (avec l'accesseur group_label)
 */

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function displayValue(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return value;
}

function InfoRow({ label, value }) {
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-[#68706e]">
                {label}
            </dt>
            <dd className="text-sm leading-6 text-[#263333] sm:col-span-2 whitespace-pre-line">
                {displayValue(value)}
            </dd>
        </div>
    );
}

export default function GroupRegistrationsShow({ registration }) {
    return (
        <AdminLayout>
            <Head
                title={`Inscription — ${registration.full_name}`}
            />

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <Link
                    href={route("group-registrations.index")}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] transition hover:text-[#bf5429]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la liste
                </Link>

                {/* EN-TÊTE */}
                <div className="mb-8 rounded-2xl bg-[#1f2d2d] p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#bf5429]/20 px-3 py-1 text-xs font-medium text-[#d9a07f]">
                                <Users className="h-3.5 w-3.5" />
                                {registration.group_label}
                            </span>

                            <h1 className="text-xl font-semibold text-white md:text-2xl">
                                {registration.full_name}
                            </h1>

                            <p className="mt-2 text-sm text-white/70">
                                {registration.email}
                            </p>
                        </div>

                        <div className="text-right text-sm text-white/60">
                            Reçue le
                            <br />
                            <span className="font-medium text-white">
                                {formatDate(registration.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* CANDIDATURE */}
                    <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                        <div className="mb-4 flex items-center gap-3 border-b border-[#d9ddda] pb-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f2d2d] text-sm font-semibold text-white">
                                1
                            </span>
                            <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                Coordonnées & Candidature
                            </h2>
                        </div>

                        <dl className="divide-y divide-[#eef0ee]">
                            <InfoRow
                                label="Nom & Prénom"
                                value={registration.full_name}
                            />
                            <InfoRow
                                label="E-mail"
                                value={registration.email}
                            />
                            <InfoRow
                                label="Groupe de travail"
                                value={registration.group_label}
                            />
                            <InfoRow
                                label="Domaine d'expertise"
                                value={registration.expertise_domain}
                            />

                            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-[#68706e]">
                                    Profil LinkedIn
                                </dt>
                                <dd className="text-sm leading-6 sm:col-span-2">
                                    {registration.linkedin_url ? (
                                        <a
                                            href={registration.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-medium text-[#bf5429] hover:text-[#a94320]"
                                        >
                                            <FaLinkedin className="h-3.5 w-3.5" />
                                            Voir le profil
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-[#68706e]">
                                    CV
                                </dt>
                                <dd className="text-sm leading-6 sm:col-span-2">
                                    {registration.cv_path ? (
                                        <a
                                            href={`/storage/${registration.cv_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-medium text-[#bf5429] hover:text-[#a94320]"
                                        >
                                            <FileDown className="h-3.5 w-3.5" />
                                            Télécharger le CV
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {/* MOTIVATION & PRÉSENTATION */}
                    <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
                        <div className="mb-4 flex items-center gap-3 border-b border-[#d9ddda] pb-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f2d2d] text-sm font-semibold text-white">
                                2
                            </span>
                            <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                Présentation & Motivation
                            </h2>
                        </div>

                        <dl className="divide-y divide-[#eef0ee]">
                            <InfoRow
                                label="Présentation"
                                value={registration.presentation}
                            />
                            <InfoRow
                                label="Motivation"
                                value={registration.motivation}
                            />
                        </dl>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
