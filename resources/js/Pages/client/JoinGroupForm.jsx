import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import Nav from "./nav";
import Footer from "./footer";

// ============================================================
// Données des groupes
// ============================================================

const GROUPS = [
    {
        value: "human_capital",
        label: "Human Capital & Work",
        description:
            "Explorer les enjeux liés aux compétences, à l'emploi, à l'entrepreneuriat et aux transformations du monde du travail, en particulier pour les jeunes et les personnes éloignées de l'emploi.",
        objectives: [
            "Youth & Skills",
            "NEETs & Neo-NEETs",
            "Employability",
            "Entrepreneurship",
            "Informal Economy",
        ],
    },

    {
        value: "gender_inclusion",
        label: "Gender, Inclusion & Diverse Abilities",
        description:
            "Promouvoir l'inclusion sociale et économique, l'égalité des chances et la reconnaissance des contributions des femmes, des travailleurs vulnérables et des personnes en situation de handicap.",
        objectives: [
            "Women’s Empowerment",
            "Disability Inclusion",
            "Vulnerable Workers",
            "Invisible Workers",
            "Intergenerational Justice",
        ],
    },

    {
        value: "health_social_protection",
        label: "Health, Social Protection & Demographic Transitions",
        description:
            "Analyser les transformations démographiques, les enjeux de santé, les systèmes de protection sociale et les conditions nécessaires au bien-être des populations.",
        objectives: [
            "Public Health",
            "Social Protection Systems",
            "Population Dynamics",
            "Aging & Fertility",
            "Well-being",
        ],
    },

    {
        value: "mobility_migration",
        label: "Mobility, Migration & Diaspora",
        description:
            "Étudier les dynamiques de mobilité, de migration et d'urbanisation, ainsi que le rôle des diasporas et les effets des changements climatiques sur les déplacements des populations.",
        objectives: [
            "Intra-African Migration",
            "Diaspora & Talent",
            "Urbanization",
            "Climate-Driven Mobility",
        ],
    },

    {
        value: "governance_democracy",
        label: "Governance, Democracy & the Social Contract",
        description:
            "Analyser la confiance institutionnelle, la participation citoyenne, la responsabilité publique et les nouvelles formes de dialogue entre l'État et les citoyens.",
        objectives: [
            "Institutional Trust & Quality",
            "Democratic Participation & Accountability",
            "State–Citizen Social Dialogue",
            "Civic Engagement & Youth Volunteering",
        ],
    },
];
const PRESENTATION_MAX = 250;

// ============================================================
// Composant : liste déroulante des groupes
// ============================================================
function GroupSelect({ value, onChange, options, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selected = options.find((g) => g.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 ${
                    error
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-[#d6d9d8] hover:border-[#bf5429]/50 focus:border-[#bf5429]"
                }`}
            >
                <span className={`flex-grow ${selected ? "text-[#1f2d2d] font-medium" : "text-[#5f6967]/60"}`}>
                    {selected ? selected.label : "Sélectionnez un groupe"}
                </span>
                <svg
                    className={`h-4 w-4 flex-shrink-0 text-[#5f6967] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-2xl">
                    <ul className="max-h-80 overflow-y-auto py-1">
                        {options.map((g) => (
                            <li key={g.value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(g.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 hover:bg-[#bf5429]/5 ${
                                        g.value === value ? "bg-[#bf5429]/10" : ""
                                    }`}
                                >
                                    <span
                                        className={`text-sm ${
                                            g.value === value ? "font-semibold text-[#bf5429]" : "text-[#1f2d2d]"
                                        }`}
                                    >
                                        {g.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ============================================================
// Composant : carte du groupe sélectionné
// ============================================================
function SelectedGroupCard({ group }) {
    if (!group) return null;

    return (
        <div
            key={group.value}
            className="rounded-2xl border border-[#bf5429]/20 bg-gradient-to-br from-[#bf5429]/[0.04] to-transparent p-6 animate-[fadeIn_0.4s_ease-out]"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 rounded-full bg-[#bf5429]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#bf5429]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Groupe sélectionné
                </span>
            </div>

            <h4 className="font-display text-lg font-semibold text-[#1f2d2d] leading-snug">{group.label}</h4>

            <p className="mt-3 text-sm text-[#5f6967] leading-relaxed">{group.description}</p>

            {group.objectives?.length > 0 && (
                <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#324949] mb-3">
                        Objectifs du groupe
                    </p>
                    <ul className="space-y-2.5">
                        {group.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#bf5429] text-white text-xs font-bold mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-[#1f2d2d] leading-relaxed">{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// ============================================================
// Composant principal : formulaire
// ============================================================
export default function JoinGroupForm() {
    const [cvFileName, setCvFileName] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        group_type: "",
        full_name: "",
        email: "",
        linkedin_url: "",
        cv: null,
        presentation: "",
        expertise_domain: "",
        motivation: "",
        gender: "", // Ajout du champ "gender"
    });

    const selectedGroup = GROUPS.find((g) => g.value === data.group_type);

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cv", file);
            setCvFileName(file.name);
        }
    };

    const removeCv = () => {
        setData("cv", null);
        setCvFileName("");
    };

    const submit = (e) => {
        e.preventDefault();
        setSuccessMessage(null);

        post(route("groups.join"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage("Votre inscription a été envoyée avec succès.");
                setCvFileName("");
                reset();
            },
        });
    };

    const inputClasses =
        "w-full p-4 rounded-lg border border-[#d6d9d8] bg-white text-[#1f2d2d] placeholder:text-[#5f6967]/50 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 transition-all duration-300";

    return (
        <>
        <Nav />
        <div className="mt-16 rounded-2xl bg-white border border-[#d6d9d8]/30 p-8 lg:p-10 shadow-lg">
            <h3 className="font-display text-2xl font-semibold text-[#bf5429] mb-6">Rejoindre un Groupe</h3>

            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                {/* Choix du groupe */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
                        Choix du groupe <span className="text-[#bf5429]">*</span>
                    </label>
                    <GroupSelect
                        value={data.group_type}
                        onChange={(val) => setData("group_type", val)}
                        options={GROUPS}
                        error={errors.group_type}
                    />
                    {errors.group_type && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.group_type}
                        </p>
                    )}
                </div>

                {/* Carte du groupe sélectionné */}
                <SelectedGroupCard group={selectedGroup} />

{/* Nom complet + Email */}
<div className="grid gap-6 md:grid-cols-2">
    <div>
        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
            Nom complet <span className="text-[#bf5429]">*</span>
        </label>
        <input
            type="text"
            required
            value={data.full_name}
            onChange={(e) => setData("full_name", e.target.value)}
            className={inputClasses}
            placeholder="Votre nom complet"
        />
        {errors.full_name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.full_name}
            </p>
        )}
    </div>

    <div>
        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
            E-mail <span className="text-[#bf5429]">*</span>
        </label>
        <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className={inputClasses}
            placeholder="exemple@email.com"
        />
        {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
            </p>
        )}
    </div>
</div>

{/* LinkedIn + Domaine d'expertise */}
<div className="grid gap-6 md:grid-cols-2">
    <div>
        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
            Lien LinkedIn (optionnel)
        </label>
        <input
            type="url"
            value={data.linkedin_url}
            onChange={(e) => setData("linkedin_url", e.target.value)}
            className={inputClasses}
            placeholder="https://linkedin.com/in/..."
        />
        {errors.linkedin_url && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.linkedin_url}
            </p>
        )}
    </div>

    <div>
        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
            Domaine d'expertise
        </label>
        <input
            type="text"
            value={data.expertise_domain}
            onChange={(e) => setData("expertise_domain", e.target.value)}
            className={inputClasses}
            placeholder="Ex : Éducation, Santé, Droit..."
        />
    </div>
</div>

{/* CV — pleine largeur (upload) */}
<div>
    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">CV (optionnel)</label>
    <label
        htmlFor="cv-upload"
        className="flex items-center gap-3 w-full p-4 rounded-lg border border-dashed border-[#d6d9d8] bg-white text-[#5f6967] cursor-pointer hover:border-[#bf5429] transition-all duration-300"
    >
        <Upload className="w-5 h-5 text-[#bf5429] flex-shrink-0" />
        <span className="flex-grow truncate">
            {cvFileName || "Cliquez pour téléverser votre CV"}
        </span>
        {cvFileName && (
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    removeCv();
                }}
                className="flex-shrink-0 hover:bg-[#f8f9f8] rounded p-1"
            >
                <X className="w-4 h-4" />
            </button>
        )}
    </label>
    <input
        id="cv-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleCvChange}
        className="hidden"
    />
    <p className="mt-1 text-xs text-[#5f6967]">
        Formats acceptés : PDF, DOC, DOCX (max 10 Mo)
    </p>
    {errors.cv && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.cv}
        </p>
    )}
    <div className="mt-4">
       <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">Genre</label>
         <select
            value={data.gender}
            onChange={(e) => setData("gender", e.target.value)}
            className={`${inputClasses} mt-1`}>
            <option value="">Sélectionnez votre genre</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
        </select>
    </div>
</div>

                {/* Présentation */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">
                        Présentez-vous <span className="text-[#bf5429]">*</span>
                    </label>
                    <textarea
                        required
                        rows={4}
                        maxLength={PRESENTATION_MAX}
                        value={data.presentation}
                        onChange={(e) => setData("presentation", e.target.value)}
                        className={`${inputClasses} resize-none`}
                        placeholder="Quelques mots sur vous..."
                    />
                    <div className="mt-1 flex justify-end">
                        <span className="text-xs text-[#5f6967]">
                            {data.presentation.length}/{PRESENTATION_MAX} caractères
                        </span>
                    </div>
                    {errors.presentation && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.presentation}
                        </p>
                    )}
                </div>

                {/* Motivation */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d]">Motivation</label>
                    <textarea
                        rows={4}
                        value={data.motivation}
                        onChange={(e) => setData("motivation", e.target.value)}
                        className={`${inputClasses} resize-none`}
                        placeholder="Pourquoi souhaitez-vous rejoindre ce groupe ?"
                    />
                </div>

                <div className="flex justify-end items-center gap-4">
                    {/* Annuler */}
                    <Link
                        href={route("client.home")}
                        className="rounded-lg border border-[#d6d9d8] bg-white px-6 py-4 font-semibold text-[#5f6967] transition-all duration-300 hover:border-[#bf5429] hover:text-[#bf5429] hover:shadow-md"
                    >
                        Annuler
                    </Link>

                    {/* S'inscrire */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-gradient-to-r from-[#1f2d2d] to-[#2a3a3a] px-6 py-4 font-semibold text-white transition-all duration-300 hover:from-[#bf5429] hover:to-[#a83f1f] hover:shadow-lg hover:shadow-[#bf5429]/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? "Envoi en cours..." : "S'inscrire au groupe"}
                    </button>
                </div>

                {successMessage && (
                    <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                )}
            </form>
        </div>
        <Footer />
        </>
    );
}