import AdminLayout from "@/Pages/admin/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Building2,
    Upload,
    Globe,
    Mail,
    Phone,
    MapPin,
    Users,
    CalendarDays,
} from "lucide-react";
import { FaFacebookF,FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { useState } from "react";

const TYPES = [
    {
        value: "association",
        label: "Association",
    },
    {
        value: "initiative",
        label: "Initiative",
    },
    {
        value: "cooperative_sociale",
        label: "Coopérative sociale",
    },
    {
        value: "fondation",
        label: "Fondation",
    },
    {
        value: "reseau",
        label: "Réseau",
    },
    {
        value: "autre",
        label: "Autre",
    },
];

const DATA_SOURCES = [
    {
        value: "manual",
        label: "Saisie manuelle",
    },
    {
        value: "import_data_gov_ma",
        label: "Data.gov.ma",
    },
    {
        value: "import_odco",
        label: "ODCO",
    },
    {
        value: "autre",
        label: "Autre",
    },
];

const STATUSES = [
    {
        value: "active",
        label: "Active",
    },
    {
        value: "inactive",
        label: "Inactive",
    },
];

export default function Create({
    countries = [],
    categories = [],
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: "",
        logo: "",
        description: "",

        type: "association",

        website: "",
        email: "",
        phone: "",

        social_links: {
            facebook: "",
            linkedin: "",
            instagram: "",
            x: "",
        },

        country_id: "",
        city: "",
        address: "",

        founding_year: "",
        beneficiaries_count: "",

        data_source: "manual",
        source_reference: "",

        status: "active",

        category_ids: [],
    });

    const [preview, setPreview] = useState(null);

    const handleLogo = (file) => {
        setData("logo", file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSocialLink = (key, value) => {
        setData("social_links", {
            ...data.social_links,
            [key]: value,
        });
    };

    const handleCategoryChange = (categoryId) => {
        const id = Number(categoryId);

        const exists = data.category_ids.includes(id);

        if (exists) {
            setData(
                "category_ids",
                data.category_ids.filter(
                    (category) => category !== id
                )
            );
        } else {
            setData("category_ids", [
                ...data.category_ids,
                id,
            ]);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("associations.store"), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Créer une association" />

            <div className="mx-auto max-w-5xl p-6">

                {/* ---------------------------------------------------------
                    Header
                --------------------------------------------------------- */}

                <div className="mb-8 flex items-center justify-between gap-4">

                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#BF5429]">
                            Répertoires — Associations
                        </p>

                        <h1 className="font-display text-2xl text-[#1f2d2d]">
                            Nouvelle association
                        </h1>

                        <p className="mt-1 text-[13px] text-[#5B6462]">
                            Ajouter une association ou un acteur
                            social au Social Observatory.
                        </p>
                    </div>

                    <Link
                        href={route("associations.index")}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D6D9D8] bg-white px-4 py-2 text-[13px] text-[#324949] transition hover:bg-[#F7F8F6]"
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.8}
                        />

                        Retour
                    </Link>
                </div>

                {/* ---------------------------------------------------------
                    Form
                --------------------------------------------------------- */}

                <div className="rounded-xl border border-[#D6D9D8] bg-white p-6 shadow-sm">

                    <form
                        onSubmit={submit}
                        className="space-y-8"
                    >

                        {/* =================================================
                            GENERAL INFORMATION
                        ================================================= */}

                        <div>
                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Informations générales
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Informations principales de
                                    l'association.
                                </p>
                            </div>

                            <div className="grid items-start gap-6 sm:grid-cols-[auto_1fr]">

                                {/* -------------------------------------------------
                                    Logo
                                ------------------------------------------------- */}

                                <div>
                                    <label className="mb-2 block text-[12px] font-medium text-[#5B6462]">
                                        Logo
                                    </label>

                                    <label className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D6D9D8] bg-[#F7F8F6] transition hover:border-[#BF5429]/50">

                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt=""
                                                className="h-full w-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-[#8A9290]">
                                                <Building2
                                                    size={22}
                                                    strokeWidth={1.5}
                                                />

                                                <Upload
                                                    size={11}
                                                    strokeWidth={1.8}
                                                />

                                                <span className="text-[9px]">
                                                    Ajouter
                                                </span>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) =>
                                                handleLogo(
                                                    e.target.files?.[0] ||
                                                        null
                                                )
                                            }
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                    </label>

                                    {errors.logo && (
                                        <p className="mt-1.5 max-w-28 text-[12px] text-red-500">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                {/* -------------------------------------------------
                                    Name + Description
                                ------------------------------------------------- */}

                                <div className="space-y-5">

                                    {/* Name */}

                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                            Nom de l'association{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="Association Horizon"
                                        />

                                        {errors.name && (
                                            <p className="mt-1 text-[12px] text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Type */}

                                    <div>
                                        <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                            Type{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            value={data.type}
                                            onChange={(e) =>
                                                setData(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        >
                                            {TYPES.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.type && (
                                            <p className="mt-1 text-[12px] text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}

                            <div className="mt-5">
                                <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full resize-none rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                    placeholder="Description de l'association et de ses activités..."
                                />

                                {errors.description && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Coordonnées
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Informations permettant de contacter
                                    l'association.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Website */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Site web
                                    </label>

                                    <div className="relative">
                                        <Globe
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData(
                                                    "website",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="https://exemple.org"
                                        />
                                    </div>

                                    {errors.website && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.website}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="contact@association.org"
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Téléphone
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="+212 5XX XX XX XX"
                                        />
                                    </div>

                                    {errors.phone && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            LOCATION
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Localisation
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Localisation géographique de
                                    l'association.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Country */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Pays{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        value={data.country_id}
                                        onChange={(e) =>
                                            setData(
                                                "country_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                    >
                                        <option value="">
                                            Sélectionner un pays
                                        </option>

                                        {countries.map(
                                            (country) => (
                                                <option
                                                    key={country.id}
                                                    value={country.id}
                                                >
                                                    {country.name}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {errors.country_id && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.country_id}
                                        </p>
                                    )}
                                </div>

                                {/* City */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Ville
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="Casablanca"
                                        />
                                    </div>

                                    {errors.city && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}

                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Adresse
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) =>
                                            setData(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                        className="w-full resize-none rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="Adresse complète..."
                                    />

                                    {errors.address && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            DATA
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Données de l'association
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Informations statistiques et
                                    administratives.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Founding Year */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Année de fondation
                                    </label>

                                    <div className="relative">
                                        <CalendarDays
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="number"
                                            min="1800"
                                            max={new Date().getFullYear()}
                                            value={
                                                data.founding_year
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "founding_year",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="2020"
                                        />
                                    </div>

                                    {errors.founding_year && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {
                                                errors.founding_year
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Beneficiaries */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Nombre de bénéficiaires
                                    </label>

                                    <div className="relative">
                                        <Users
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                data.beneficiaries_count
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "beneficiaries_count",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="1000"
                                        />
                                    </div>

                                    {errors.beneficiaries_count && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {
                                                errors.beneficiaries_count
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Data Source */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Source des données
                                    </label>

                                    <select
                                        value={data.data_source}
                                        onChange={(e) =>
                                            setData(
                                                "data_source",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                    >
                                        {DATA_SOURCES.map(
                                            (source) => (
                                                <option
                                                    key={
                                                        source.value
                                                    }
                                                    value={
                                                        source.value
                                                    }
                                                >
                                                    {
                                                        source.label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {errors.data_source && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {errors.data_source}
                                        </p>
                                    )}
                                </div>

                                {/* Source Reference */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Référence source
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            data.source_reference
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "source_reference",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="REF-2026-001"
                                    />

                                    {errors.source_reference && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {
                                                errors.source_reference
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            CATEGORIES
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Catégories
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Sélectionner les catégories
                                    associées à cette organisation.
                                </p>
                            </div>

                            {categories.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">

                                    {categories.map(
                                        (category) => {
                                            const checked =
                                                data.category_ids.includes(
                                                    Number(
                                                        category.id
                                                    )
                                                );

                                            return (
                                                <label
                                                    key={
                                                        category.id
                                                    }
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                                                        checked
                                                            ? "border-[#BF5429]/40 bg-[#BF5429]/5"
                                                            : "border-[#D6D9D8] bg-[#F7F8F6]/40 hover:bg-white"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checked
                                                        }
                                                        onChange={() =>
                                                            handleCategoryChange(
                                                                category.id
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/20"
                                                    />

                                                    <span className="text-[13px] text-[#324949]">
                                                        {
                                                            category.name
                                                        }
                                                    </span>
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed border-[#D6D9D8] bg-[#F7F8F6] px-4 py-6 text-center">
                                    <p className="text-[12px] text-[#8A9290]">
                                        Aucune catégorie disponible.
                                    </p>
                                </div>
                            )}

                            {errors.category_ids && (
                                <p className="mt-2 text-[12px] text-red-500">
                                    {errors.category_ids}
                                </p>
                            )}
                        </div>

                        {/* =================================================
                            SOCIAL LINKS
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Réseaux sociaux
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Liens vers les réseaux sociaux
                                    officiels.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Facebook */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Facebook
                                    </label>

                                    <div className="relative">
                                        <FaFacebookF
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="url"
                                            value={
                                                data.social_links
                                                    .facebook
                                            }
                                            onChange={(e) =>
                                                handleSocialLink(
                                                    "facebook",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>

                                    {errors[
                                        "social_links.facebook"
                                    ] && (
                                        <p className="mt-1 text-[12px] text-red-500">
                                            {
                                                errors[
                                                    "social_links.facebook"
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* LinkedIn */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        LinkedIn
                                    </label>

                                    <div className="relative">
                                        <FaLinkedin
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="url"
                                            value={
                                                data.social_links
                                                    .linkedin
                                            }
                                            onChange={(e) =>
                                                handleSocialLink(
                                                    "linkedin",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="https://linkedin.com/company/..."
                                        />
                                    </div>
                                </div>

                                {/* Instagram */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        Instagram
                                    </label>

                                    <div className="relative">
                                        <FaInstagram
                                            size={15}
                                            strokeWidth={1.8}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                                        />

                                        <input
                                            type="url"
                                            value={
                                                data.social_links
                                                    .instagram
                                            }
                                            onChange={(e) =>
                                                handleSocialLink(
                                                    "instagram",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-10 pr-4 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                </div>

                                {/* X */}

                                <div>
                                    <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                        X / Twitter
                                    </label>

                                    <input
                                        type="url"
                                        value={
                                            data.social_links.x
                                        }
                                        onChange={(e) =>
                                            handleSocialLink(
                                                "x",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                        placeholder="https://x.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div className="border-t border-[#D6D9D8] pt-7">

                            <div className="mb-5">
                                <h2 className="text-[15px] font-semibold text-[#1f2d2d]">
                                    Publication
                                </h2>

                                <p className="mt-1 text-[12px] text-[#8A9290]">
                                    Contrôler la visibilité de
                                    l'association.
                                </p>
                            </div>

                            <div className="max-w-md">

                                <label className="mb-1.5 block text-[12px] font-medium text-[#5B6462]">
                                    Statut
                                </label>

                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 px-4 py-2.5 text-[14px] text-[#1f2d2d] outline-none transition focus:border-[#324949]/40 focus:bg-white"
                                >
                                    {STATUSES.map(
                                        (status) => (
                                            <option
                                                key={
                                                    status.value
                                                }
                                                value={
                                                    status.value
                                                }
                                            >
                                                {status.label}
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.status && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="flex justify-end gap-3 border-t border-[#D6D9D8] pt-5">

                            <Link
                                href={route(
                                    "associations.index"
                                )}
                                className="rounded-lg border border-[#D6D9D8] px-5 py-2.5 text-[13.5px] text-[#324949] transition hover:bg-[#F7F8F6]"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-[#BF5429] px-6 py-2.5 text-[13.5px] font-medium text-white shadow-sm shadow-[#BF5429]/20 transition hover:bg-[#a8451f] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? "Enregistrement..."
                                    : "Créer l'association"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}