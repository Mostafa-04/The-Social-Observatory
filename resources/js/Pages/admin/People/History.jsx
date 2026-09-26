import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Globe,
    Mail,
    Phone,
    Users,
    User,
} from "lucide-react";
import {
  FaLinkedin,
} from 'react-icons/fa';
import AdminLayout from "@/Pages/admin/AdminLayout";

export default function PeopleHistory({ person, history, groups }) {
    const iaps = history?.iaps ?? [];
    const contacts = history?.contacts ?? [];
    const groupsData = history?.groups ?? [];
    const events = history?.events ?? [];

    const total =
        iaps.length +
        contacts.length +
        groupsData.length +
        events.length;

    // Mappage du genre
    const genderLabels = {
        M: "Masculin",
        F: "Féminin",
        O: "Autre",
    };

    // Fonction pour obtenir le nom complet du groupe
    const getGroupName = (groupType) => {
        return groups?.[groupType] || groupType || "—";
    };

    return (
        <AdminLayout>
            <Head
                title={`Historique - ${person.first_name} ${person.last_name}`}
            />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route("people.index")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#68706e] transition hover:text-[#bf5429]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux personnes
                    </Link>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                                {person.first_name} {person.last_name}
                            </h1>

                            <p className="mt-2 text-sm text-[#68706e]">
                                Historique de cette personne dans
                                l'Observatoire.
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#f6f7f5] px-4 py-3 text-sm text-[#68706e]">
                            <span className="font-semibold text-[#1f2d2d]">
                                {total}
                            </span>{" "}
                            activité{total > 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                {/* Person information */}
                <div className="mb-8 rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bf5429]/10 text-[#bf5429]">
                            <User className="h-4 w-4" />
                        </span>
                        <h2 className="text-lg font-semibold text-[#1f2d2d]">
                            Informations personnelles
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Prénom */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Prénom
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#263333]">
                                {person.first_name || "—"}
                            </p>
                        </div>

                        {/* Nom */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Nom
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#263333]">
                                {person.last_name || "—"}
                            </p>
                        </div>

                        {/* Genre */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Genre
                            </p>
                            <p className="mt-1 text-sm text-[#263333]">
                                {person.gender
                                    ? genderLabels[person.gender] ||
                                      person.gender
                                    : "—"}
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                E-mail
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-[#263333]">
                                <Mail className="h-4 w-4 shrink-0 text-[#78807e]" />
                                <a
                                    href={`mailto:${person.email}`}
                                    className="break-all hover:text-[#bf5429]"
                                >
                                    {person.email || "—"}
                                </a>
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                GSM
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-[#263333]">
                                <Phone className="h-4 w-4 shrink-0 text-[#78807e]" />
                                <a
                                    href={`tel:${person.phone}`}
                                    className="break-all hover:text-[#bf5429]"
                                >
                                    {person.phone || "—"}
                                </a>
                            </div>
                        </div>

                        {/* Pays */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Pays
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-[#263333]">
                                <Globe className="h-4 w-4 shrink-0 text-[#78807e]" />
                                {person.country || "—"}
                            </div>
                        </div>
                    </div>

                    {/* Ligne de séparation */}
                    <div className="my-6 border-t border-[#eef0ee]"></div>

                    {/* Organisation et fonction */}
                    <div className="mb-6 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bf5429]/10 text-[#bf5429]">
                            <Building2 className="h-4 w-4" />
                        </span>
                        <h2 className="text-lg font-semibold text-[#1f2d2d]">
                            Organisation et fonction
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Organisation */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Organisation
                            </p>
                            <p className="mt-1 text-sm text-[#263333]">
                                {person.organisation || "—"}
                            </p>
                        </div>

                        {/* Fonction */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Fonction
                            </p>
                            <p className="mt-1 text-sm text-[#263333]">
                                {person.role || "—"}
                            </p>
                        </div>

                        {/* LinkedIn */}
                        <div className="md:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                Profil LinkedIn
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <FaLinkedin className="h-4 w-4 shrink-0 text-[#78807e]" />
                                {person.linkedin ? (
                                    <a
                                        href={person.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-[#bf5429] hover:underline"
                                    >
                                        {person.linkedin}
                                    </a>
                                ) : (
                                    <span className="text-[#263333]">—</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* IAPS */}
                <HistorySection
                    title="Contributions IAPS"
                    icon={Users}
                    count={iaps.length}
                >
                    {iaps.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            {iaps.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#eef0ee] bg-[#f6f7f5] p-4"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Info
                                            label="E-mail"
                                            value={item.email}
                                        />

                                        <Info
                                            label="Téléphone"
                                            value={item.phone}
                                        />

                                        <Info
                                            label="Organisation"
                                            value={
                                                item.organization_affiliation
                                            }
                                        />

                                        <Info
                                            label="Type de participant"
                                            value={item.participant_type}
                                        />

                                        <Info
                                            label="Pays d'observation"
                                            value={item.observation_country}
                                        />

                                        <Info
                                            label="Profil"
                                            value={item.individual_profile}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </HistorySection>

                {/* Groups */}
                <HistorySection
                    title="Groupes de travail"
                    icon={Users}
                    count={groupsData.length}
                >
                    {groupsData.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            {groupsData.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#eef0ee] bg-[#f6f7f5] p-4"
                                >
                                    {/* Nom du groupe avec badge */}
                                    <div className="mb-4">
                                        <div className="flex items-start gap-2">
                                            <span className="mt-1 inline-block rounded-lg bg-[#bf5429] px-3 py-1 text-xs font-semibold text-white">
                                                {item.group_type.charAt(0).toUpperCase() +
                                                    item.group_type.slice(1)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-[#263333]">
                                            {getGroupName(item.group_type)}
                                        </p>
                                    </div>

                                    {/* Détails du groupe */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Info
                                            label="E-mail"
                                            value={item.email}
                                        />

                                        <Info
                                            label="Domaine d'expertise"
                                            value={item.expertise_domain}
                                        />

                                        <Info
                                            label="LinkedIn"
                                            value={item.linkedin_url}
                                        />

                                        <Info
                                            label="Présentation"
                                            value={item.presentation}
                                        />

                                        {item.motivation && (
                                            <div className="md:col-span-2">
                                                <Info
                                                    label="Motivation"
                                                    value={item.motivation}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </HistorySection>

                {/* Contacts */}
                <HistorySection
                    title="Contacts de l'Observatoire"
                    icon={Users}
                    count={contacts.length}
                >
                    {contacts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            {contacts.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#eef0ee] bg-[#f6f7f5] p-4"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Info
                                            label="Nom"
                                            value={item.name}
                                        />

                                        <Info
                                            label="E-mail"
                                            value={item.email}
                                        />

                                        <Info
                                            label="Téléphone"
                                            value={item.phone}
                                        />

                                        <Info
                                            label="Organisation"
                                            value={item.organisation}
                                        />

                                        <Info
                                            label="Fonction"
                                            value={item.role}
                                        />

                                        <Info
                                            label="Statut"
                                            value={item.status}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </HistorySection>

                {/* Events */}
                <HistorySection
                    title="Inscriptions aux événements"
                    icon={Users}
                    count={events.length}
                >
                    {events.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            {events.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#eef0ee] bg-[#f6f7f5] p-4"
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Info
                                            label="Prénom"
                                            value={item.first_name}
                                        />

                                        <Info
                                            label="Nom"
                                            value={item.last_name}
                                        />

                                        <Info
                                            label="Téléphone"
                                            value={item.phone}
                                        />

                                        <Info
                                            label="Statut"
                                            value={item.status}
                                        />

                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                                                Inscription
                                            </p>

                                            <p className="mt-1 text-sm text-[#263333]">
                                                {formatDate(
                                                    item.registered_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </HistorySection>
            </div>
        </AdminLayout>
    );
}


/*
|--------------------------------------------------------------------------
| Components
|--------------------------------------------------------------------------
*/

function HistorySection({ title, icon: Icon, count, children }) {
    return (
        <section className="mb-6 rounded-2xl border border-[#dfe3e0] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bf5429]/10 text-[#bf5429]">
                        <Icon className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg font-semibold text-[#1f2d2d]">
                        {title}
                    </h2>
                </div>

                <span className="rounded-full bg-[#f6f7f5] px-3 py-1 text-xs font-semibold text-[#68706e]">
                    {count}
                </span>
            </div>

            {children}
        </section>
    );
}


function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-[#78807e]">
                {label}
            </p>

            <p className="mt-1 break-words text-sm text-[#263333]">
                {value || "—"}
            </p>
        </div>
    );
}


function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-[#dfe3e0] px-5 py-8 text-center text-sm text-[#78807e]">
            Aucune donnée trouvée dans cette source.
        </div>
    );
}


function formatDate(date) {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}