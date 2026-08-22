import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Edit3,
    Trash2,
    Globe2,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    Users,
    Building2,
    ExternalLink,
    Eye,
    Database,
    Tag,
} from "lucide-react";
import { FaFacebookF,FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";



const TYPE_LABELS = {
    association: "Association",
    initiative: "Initiative",
    cooperative_sociale: "Coopérative sociale",
    fondation: "Fondation",
    reseau: "Réseau",
    autre: "Autre",
};

const DATA_SOURCE_LABELS = {
    manual: "Saisie manuelle",
    import_data_gov_ma: "Data.gov.ma",
    import_odco: "ODCO",
    autre: "Autre",
};

export default function Show({ association }) {
    const handleDelete = () => {
        if (
            confirm(
                `Supprimer définitivement "${association.name}" ?`
            )
        ) {
            router.delete(
                route(
                    "associations.destroy",
                    association.id
                )
            );
        }
    };

    const logoUrl = association.logo_path
        ? `/storage/${association.logo_path}`
        : null;

    const socialLinks =
        association.social_links || {};

    return (
        <AdminLayout>
            <Head title={association.name} />

            <div className="mx-auto max-w-6xl space-y-6 p-6">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <Link
                            href={route(
                                "associations.index"
                            )}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D6D9D8] bg-white text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <ArrowLeft
                                size={16}
                                strokeWidth={1.8}
                            />
                        </Link>

                        <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                                Répertoires — Associations
                            </p>

                            <h1 className="font-display text-2xl text-[#1f2d2d]">
                                {association.name}
                            </h1>

                            <p className="mt-1 text-[13px] text-[#5B6462]">
                                Détails de l'association
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">

                        <Link
                            href={route(
                                "associations.edit",
                                association.id
                            )}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2.5 text-[13px] font-medium text-[#324949] transition hover:bg-[#F7F8F6]"
                        >
                            <Edit3
                                size={14}
                                strokeWidth={1.8}
                            />

                            Modifier
                        </Link>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                        >
                            <Trash2
                                size={14}
                                strokeWidth={1.8}
                            />

                            Supprimer
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    MAIN PROFILE
                ===================================================== */}

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                    {/* =================================================
                        LEFT CARD
                    ================================================= */}

                    <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                        <div className="flex flex-col items-center text-center">

                            {/* LOGO */}

                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-[#D6D9D8] bg-[#F7F8F6]">

                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={
                                            association.name
                                        }
                                        className="h-full w-full object-contain p-3"
                                    />
                                ) : (
                                    <Building2
                                        size={42}
                                        strokeWidth={1.2}
                                        className="text-[#8A9290]"
                                    />
                                )}
                            </div>

                            {/* NAME */}

                            <h2 className="mt-5 text-[17px] font-semibold text-[#1f2d2d]">
                                {association.name}
                            </h2>

                            {/* TYPE */}

                            <span className="mt-2 rounded-full bg-[#324949]/10 px-3 py-1 text-[11px] font-medium text-[#324949]">
                                {TYPE_LABELS[
                                    association.type
                                ] ||
                                    association.type}
                            </span>

                            {/* STATUS */}

                            <span
                                className={`mt-2 rounded-full px-3 py-1 text-[11px] font-medium ${
                                    association.status ===
                                    "active"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {association.status ===
                                "active"
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        {/* STATS */}

                        <div className="mt-7 border-t border-[#D6D9D8] pt-5">

                            <div className="flex items-center justify-between py-2">

                                <div className="flex items-center gap-2 text-[#5B6462]">
                                    <Eye
                                        size={14}
                                        strokeWidth={1.8}
                                    />

                                    <span className="text-[12px]">
                                        Vues
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#1f2d2d]">
                                    {(
                                        association.views_count ??
                                        0
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2">

                                <div className="flex items-center gap-2 text-[#5B6462]">
                                    <CalendarDays
                                        size={14}
                                        strokeWidth={1.8}
                                    />

                                    <span className="text-[12px]">
                                        Fondation
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#1f2d2d]">
                                    {association.founding_year ||
                                        "—"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2">

                                <div className="flex items-center gap-2 text-[#5B6462]">
                                    <Users
                                        size={14}
                                        strokeWidth={1.8}
                                    />

                                    <span className="text-[12px]">
                                        Bénéficiaires
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#1f2d2d]">
                                    {association
                                        .beneficiaries_count !=
                                    null
                                        ? association.beneficiaries_count.toLocaleString()
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT CONTENT
                    ================================================= */}

                    <div className="space-y-6">

                        {/* DESCRIPTION */}

                        <section className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                            <div className="mb-4 flex items-center gap-2">

                                <Building2
                                    size={17}
                                    strokeWidth={1.8}
                                    className="text-[#BF5429]"
                                />

                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Présentation
                                </h2>
                            </div>

                            {association.description ? (
                                <p className="whitespace-pre-line text-[13px] leading-6 text-[#5B6462]">
                                    {
                                        association.description
                                    }
                                </p>
                            ) : (
                                <p className="text-[13px] italic text-[#8A9290]">
                                    Aucune description
                                    disponible.
                                </p>
                            )}
                        </section>

                        {/* CONTACT */}

                        <section className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Globe2
                                    size={17}
                                    strokeWidth={1.8}
                                    className="text-[#BF5429]"
                                />

                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Coordonnées
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* WEBSITE */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#324949]">
                                        <Globe2
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-[11px] text-[#8A9290]">
                                            Site web
                                        </p>

                                        {association.website ? (
                                            <a
                                                href={
                                                    association.website
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-0.5 flex items-center gap-1 break-all text-[13px] text-[#BF5429] hover:underline"
                                            >
                                                {
                                                    association.website
                                                }

                                                <ExternalLink
                                                    size={11}
                                                    strokeWidth={
                                                        1.8
                                                    }
                                                />
                                            </a>
                                        ) : (
                                            <p className="mt-0.5 text-[13px] text-[#8A9290]">
                                                —
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* EMAIL */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#324949]">
                                        <Mail
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-[11px] text-[#8A9290]">
                                            Email
                                        </p>

                                        {association.email ? (
                                            <a
                                                href={`mailto:${association.email}`}
                                                className="mt-0.5 break-all text-[13px] text-[#324949] hover:underline"
                                            >
                                                {
                                                    association.email
                                                }
                                            </a>
                                        ) : (
                                            <p className="mt-0.5 text-[13px] text-[#8A9290]">
                                                —
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* PHONE */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#324949]">
                                        <Phone
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>

                                        <p className="text-[11px] text-[#8A9290]">
                                            Téléphone
                                        </p>

                                        {association.phone ? (
                                            <a
                                                href={`tel:${association.phone}`}
                                                className="mt-0.5 text-[13px] text-[#324949] hover:underline"
                                            >
                                                {
                                                    association.phone
                                                }
                                            </a>
                                        ) : (
                                            <p className="mt-0.5 text-[13px] text-[#8A9290]">
                                                —
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* LOCATION */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F8F6] text-[#324949]">
                                        <MapPin
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>

                                        <p className="text-[11px] text-[#8A9290]">
                                            Localisation
                                        </p>

                                        <p className="mt-0.5 text-[13px] text-[#324949]">
                                            {[
                                                association.city,
                                                association
                                                    .country
                                                    ?.name,
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    ", "
                                                ) ||
                                                "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ADDRESS */}

                            {association.address && (
                                <div className="mt-5 border-t border-[#D6D9D8] pt-4">

                                    <p className="mb-1 text-[11px] text-[#8A9290]">
                                        Adresse
                                    </p>

                                    <p className="text-[13px] leading-5 text-[#5B6462]">
                                        {
                                            association.address
                                        }
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* CATEGORIES */}

                        <section className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Tag
                                    size={17}
                                    strokeWidth={1.8}
                                    className="text-[#BF5429]"
                                />

                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Catégories
                                </h2>
                            </div>

                            {association.categories?.length >
                            0 ? (
                                <div className="flex flex-wrap gap-2">

                                    {association.categories.map(
                                        (category) => (
                                            <span
                                                key={
                                                    category.id
                                                }
                                                className="rounded-full bg-[#324949]/10 px-3 py-1.5 text-[11px] font-medium text-[#324949]"
                                            >
                                                {
                                                    category.name
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-[13px] italic text-[#8A9290]">
                                    Aucune catégorie
                                    associée.
                                </p>
                            )}
                        </section>

                        {/* SOCIAL LINKS */}

                        {(socialLinks.facebook ||
                            socialLinks.linkedin ||
                            socialLinks.instagram ||
                            socialLinks.x) && (
                            <section className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center gap-2">

                                    <Globe2
                                        size={17}
                                        strokeWidth={1.8}
                                        className="text-[#BF5429]"
                                    />

                                    <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                        Réseaux sociaux
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-3">

                                    {socialLinks.facebook && (
                                        <a
                                            href={
                                                socialLinks.facebook
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-[#D6D9D8] px-4 py-2 text-[12px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                        >
                                            <FaFacebookF
                                                size={14}
                                                strokeWidth={
                                                    1.8
                                                }
                                            />

                                            Facebook

                                            <ExternalLink
                                                size={10}
                                            />
                                        </a>
                                    )}

                                    {socialLinks.linkedin && (
                                        <a
                                            href={
                                                socialLinks.linkedin
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-[#D6D9D8] px-4 py-2 text-[12px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                        >
                                            <FaLinkedin
                                                size={14}
                                                strokeWidth={
                                                    1.8
                                                }
                                            />

                                            LinkedIn

                                            <ExternalLink
                                                size={10}
                                            />
                                        </a>
                                    )}

                                    {socialLinks.instagram && (
                                        <a
                                            href={
                                                socialLinks.instagram
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-[#D6D9D8] px-4 py-2 text-[12px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                        >
                                            <FaInstagram
                                                size={14}
                                                strokeWidth={
                                                    1.8
                                                }
                                            />

                                            Instagram

                                            <ExternalLink
                                                size={10}
                                            />
                                        </a>
                                    )}

                                    {socialLinks.x && (
                                        <a
                                            href={
                                                socialLinks.x
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-[#D6D9D8] px-4 py-2 text-[12px] text-[#324949] transition hover:bg-[#F7F8F6]"
                                        >
                                            <span className="text-[13px] font-semibold">
                                                𝕏
                                            </span>

                                            X / Twitter

                                            <ExternalLink
                                                size={10}
                                            />
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* =================================================
                            SOURCE & METADATA
                        ================================================= */}

                        <section className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Database
                                    size={17}
                                    strokeWidth={1.8}
                                    className="text-[#BF5429]"
                                />

                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Source et informations
                                </h2>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                <InfoItem
                                    label="Source des données"
                                    value={
                                        DATA_SOURCE_LABELS[
                                            association
                                                .data_source
                                        ] ||
                                        association.data_source
                                    }
                                />

                                <InfoItem
                                    label="Référence source"
                                    value={
                                        association.source_reference
                                    }
                                />

                                <InfoItem
                                    label="Pays"
                                    value={
                                        association.country
                                            ?.name
                                    }
                                />

                                <InfoItem
                                    label="Créé le"
                                    value={
                                        association.created_at
                                            ? new Date(
                                                  association.created_at
                                              ).toLocaleDateString(
                                                  "fr-FR"
                                              )
                                            : null
                                    }
                                />

                                <InfoItem
                                    label="Dernière modification"
                                    value={
                                        association.updated_at
                                            ? new Date(
                                                  association.updated_at
                                              ).toLocaleDateString(
                                                  "fr-FR"
                                              )
                                            : null
                                    }
                                />

                                <InfoItem
                                    label="ID"
                                    value={
                                        association.id
                                    }
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Small reusable component
|--------------------------------------------------------------------------
*/

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="mb-1 text-[11px] text-[#8A9290]">
                {label}
            </p>

            <p className="break-words text-[13px] font-medium text-[#324949]">
                {value !== null &&
                value !== undefined &&
                value !== ""
                    ? value
                    : "—"}
            </p>
        </div>
    );
}