import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, User, Building2, FileText } from "lucide-react";
import AdminLayout from "@/Pages/admin/AdminLayout";

/**
 * Page admin — détail d'une soumission IAPS.
 * Attendu depuis le contrôleur (Inertia::render):
 * - submission: IapsSubmission (avec la relation publication chargée)
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

    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "—";
    }

    if (typeof value === "boolean") {
        return value ? "Oui" : "Non";
    }

    return value;
}

function InfoRow({ label, value }) {
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-[#68706e]">
                {label}
            </dt>
            <dd className="text-sm leading-6 text-[#263333] sm:col-span-2">
                {displayValue(value)}
            </dd>
        </div>
    );
}

function SectionCard({ number, title, children }) {
    return (
        <section className="rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm md:p-8">
            <div className="mb-4 flex items-center gap-3 border-b border-[#d9ddda] pb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f2d2d] text-sm font-semibold text-white">
                    {number}
                </span>
                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                    {title}
                </h2>
            </div>

            <dl className="divide-y divide-[#eef0ee]">{children}</dl>
        </section>
    );
}

export default function IapsSubmissionsShow({ submission }) {
    const isIndividual = submission.participant_type === "individual";
    const isOrganization = submission.participant_type === "organization";

    return (
        <AdminLayout>
            <Head title={`Soumission IAPS — ${submission.full_name}`} />

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <Link
                    href={route("iaps-submissions.index")}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] transition hover:text-[#bf5429]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la liste
                </Link>

                {/* EN-TÊTE */}
                <div className="mb-8 rounded-2xl bg-[#1f2d2d] p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <span
                                className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                    isOrganization
                                        ? "bg-white/10 text-white"
                                        : "bg-[#bf5429]/20 text-[#d9a07f]"
                                }`}
                            >
                                {isOrganization ? (
                                    <Building2 className="h-3.5 w-3.5" />
                                ) : (
                                    <User className="h-3.5 w-3.5" />
                                )}
                                {isOrganization
                                    ? "Personne morale"
                                    : "Personne physique"}
                            </span>

                            <h1 className="text-xl font-semibold text-white md:text-2xl">
                                {submission.entity_name ||
                                    submission.full_name}
                            </h1>

                            {submission.publication?.title && (
                                <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                                    <FileText className="h-4 w-4 text-[#bf5429]" />
                                    {submission.publication.title}
                                </p>
                            )}
                        </div>

                        <div className="text-right text-sm text-white/60">
                            Reçue le
                            <br />
                            <span className="font-medium text-white">
                                {formatDate(submission.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* SECTION 1 */}
                    <SectionCard
                        number="1"
                        title="Coordonnées & Aiguillage Initial"
                    >
                        <InfoRow
                            label="Nom & Prénom"
                            value={submission.full_name}
                        />
                        <InfoRow label="E-mail" value={submission.email} />
                        <InfoRow
                            label="Téléphone / WhatsApp"
                            value={submission.phone}
                        />
                        <InfoRow
                            label="Langue(s)"
                            value={submission.languages}
                        />
                    </SectionCard>

                    {/* SECTION 2 — Personne physique */}
                    {isIndividual && (
                        <SectionCard
                            number="2"
                            title="Parcours Contributeur Individuel"
                        >
                            <InfoRow
                                label="Profil principal"
                                value={submission.individual_profile}
                            />
                            <InfoRow
                                label="Organisation de rattachement"
                                value={
                                    submission.organization_affiliation
                                }
                            />
                            <InfoRow
                                label="Disciplines"
                                value={submission.disciplines}
                            />
                            <InfoRow
                                label="Autre discipline"
                                value={submission.other_discipline}
                            />
                            <InfoRow
                                label="Régions d'observation"
                                value={submission.observation_regions}
                            />
                            <InfoRow
                                label="Pays d'observation"
                                value={submission.observation_country}
                            />
                            <InfoRow
                                label="Pays de résidence (diaspora)"
                                value={submission.diaspora_country}
                            />
                            <InfoRow
                                label="Ville / localité d'observation"
                                value={submission.observation_location}
                            />
                            <InfoRow
                                label="Modalités de contribution"
                                value={submission.contribution_methods}
                            />
                            <InfoRow
                                label="Autre modalité"
                                value={
                                    submission.other_contribution_method
                                }
                            />
                        </SectionCard>
                    )}

                    {/* SECTION 3 — Personne morale */}
                    {isOrganization && (
                        <SectionCard
                            number="2"
                            title="Organisation & Institution"
                        >
                            <InfoRow
                                label="Nom officiel de l'entité"
                                value={submission.entity_name}
                            />
                            <InfoRow
                                label="Rôle du représentant"
                                value={submission.representative_role}
                            />
                            <InfoRow
                                label="Typologie de l'entité"
                                value={submission.entity_type}
                            />
                            <InfoRow
                                label="Échelle d'intervention"
                                value={submission.intervention_scale}
                            />
                            <InfoRow
                                label="Pays du siège"
                                value={submission.headquarters_country}
                            />
                            <InfoRow
                                label="Pays (siège international)"
                                value={submission.international_country}
                            />
                            <InfoRow
                                label="Ville du siège"
                                value={submission.headquarters_city}
                            />
                            <InfoRow
                                label="Motivations"
                                value={submission.motivations}
                            />
                            <InfoRow
                                label="Autre motivation"
                                value={submission.other_motivation}
                            />
                            <InfoRow
                                label="Pistes de synergies"
                                value={
                                    submission.partnership_opportunities
                                }
                            />
                            <InfoRow
                                label="Autre partenariat"
                                value={submission.other_partnership}
                            />
                        </SectionCard>
                    )}

                    {/* SECTION 4 */}
                    <SectionCard
                        number="3"
                        title="Cœur Thématique, Souveraineté & Mindset"
                    >
                        <InfoRow
                            label="Angles morts prioritaires"
                            value={submission.blind_spots}
                        />
                        <InfoRow
                            label="Autre angle mort"
                            value={submission.other_blind_spot}
                        />
                        <InfoRow
                            label="Témoignage de terrain"
                            value={submission.field_testimony}
                        />
                    </SectionCard>

                    {/* SECTION 5 */}
                    <SectionCard
                        number="4"
                        title="Engagement Éthique"
                    >
                        <InfoRow
                            label="Consentement éthique"
                            value={submission.ethical_consent}
                        />
                    </SectionCard>
                </div>
            </div>
        </AdminLayout>
    );
}
