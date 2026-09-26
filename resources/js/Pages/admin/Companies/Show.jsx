import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Globe,
    Check,
    MapPin,
    User,
    Briefcase,
    FileText,
} from "lucide-react";
import {
  FaLinkedin,
} from 'react-icons/fa';
import AdminLayout from "@/Pages/admin/AdminLayout";

/* ---------- Composants réutilisables ---------- */

function Section({ icon: Icon, title, children, className = "" }) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm ${className}`}
        >
            <div className="flex items-center gap-2.5 border-b border-[#e4e7e5] bg-[#f6f7f5] px-6 py-4">
                <Icon className="h-[18px] w-[18px] text-[#bf5429]" />

                <h2 className="text-sm font-semibold text-[#1f2d2d]">
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
}

function Field({ label, icon: Icon, children, className = "" }) {
    return (
        <div className={className}>
            <div className="flex items-center gap-1.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-[#9aa19f]" />}

                <p className="text-xs font-medium uppercase tracking-wide text-[#78807e]">
                    {label}
                </p>
            </div>

            <div className="mt-1.5 text-sm font-medium text-[#263333]">
                {children || "—"}
            </div>
        </div>
    );
}

const GENDER_LABELS = {
    homme: "Homme",
    femme: "Femme",
};

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("fr-FR") : null;

export default function Show({ company }) {
    const websiteUrl = company.website
        ? company.website.startsWith("http")
            ? company.website
            : `https://${company.website}`
        : null;

    const linkedinUrl = company.linkedin
        ? company.linkedin.startsWith("http")
            ? company.linkedin
            : `https://${company.linkedin}`
        : null;

    const contactFullName = [
        company.contact_first_name,
        company.contact_last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <AdminLayout>
            <Head title={`Entreprise - ${company.name}`} />

            <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                            {company.name}
                        </h1>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Informations de l'organisation
                        </p>
                    </div>

                    <Link
                        href={route("admin.companies.index")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour à la liste
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Informations générales */}
                    <Section icon={Building2} title="Informations générales">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                            <Field label="ID">{company.id}</Field>

                            <Field label="Nom de l'organisation">
                                {company.name}
                            </Field>

                            <Field label="Secteur d'activité" icon={Briefcase}>
                                {company.sector}
                            </Field>
                        </div>
                    </Section>

                    {/* Adresse */}
                    <Section icon={MapPin} title="Adresse">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                            <Field
                                label="Adresse postale"
                                className="md:col-span-2"
                            >
                                {company.address}
                            </Field>

                            <Field label="Ville">{company.city}</Field>

                            <Field label="Pays">{company.country}</Field>
                        </div>
                    </Section>

                    {/* Liens */}
                    <Section icon={Globe} title="Liens">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <Field label="Site web" icon={Globe}>
                                {websiteUrl && (
                                    <a
                                        href={websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-[#bf5429] hover:text-[#a94320] hover:underline"
                                    >
                                        {company.website}
                                    </a>
                                )}
                            </Field>

                            <Field label="LinkedIn" icon={FaLinkedin}>
                                {linkedinUrl && (
                                    <a
                                        href={linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-[#bf5429] hover:text-[#a94320] hover:underline"
                                    >
                                        {company.linkedin}
                                    </a>
                                )}
                            </Field>
                        </div>
                    </Section>

                    {/* Personne de contact */}
                    <Section icon={User} title="Personne de contact">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
                            <Field label="Genre">
                                {GENDER_LABELS[company.contact_gender] ||
                                    company.contact_gender}
                            </Field>

                            <Field label="Nom complet">
                                {contactFullName}
                            </Field>

                            <Field label="Fonction">
                                {company.contact_position}
                            </Field>

                            <Field label="Email" icon={Mail}>
                                {company.contact_email}
                            </Field>

                            <Field label="GSM" icon={Phone}>
                                {company.contact_phone}
                            </Field>
                        </div>
                    </Section>

                    {/* Informations système */}
                    <Section icon={FileText} title="Informations système">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <Field label="Date de création">
                                {formatDate(company.created_at)}
                            </Field>

                            <Field label="Dernière modification">
                                {formatDate(company.updated_at)}
                            </Field>
                        </div>
                    </Section>
                </div>
            </div>
        </AdminLayout>
    );
}