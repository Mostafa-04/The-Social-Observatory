import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import {
    Search,
    UserPlus,
    History,
    Mail,
    X,
    Paperclip,
    Globe,
    Building2,
    Users,
    ChevronDown,
    Phone,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "@/Pages/admin/AdminLayout";

const selectClass =
    "rounded-xl border border-[#d6d9d8] bg-white px-4 py-3 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10";

const SOURCE_OPTIONS = [
    { value: "", label: "Toutes les inscriptions" },
    { value: "group", label: "Groupe de travail" },
    { value: "contact", label: "Contact Observatoire" },
    { value: "iaps", label: "Soumission IAPS" },
    { value: "event", label: "Événement" },
];

/**
 * Liste déroulante avec recherche au clavier, pour le filtre Pays
 * (alimentée par /api/countries, comme les autres pages du back-office).
 */
function SearchableSelect({
    placeholder = "Sélectionner...",
    loadingLabel = "Chargement...",
    loading = false,
    options = [],
    value,
    onChange,
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    const selectedLabel =
        options.find((option) => option.value === value)?.label ?? "";

    const filtered = useMemo(() => {
        if (!query) return options;

        const q = query.toLowerCase();

        return options.filter((option) =>
            option.label.toLowerCase().includes(q)
        );
    }, [options, query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
        setQuery("");
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => {
                    if (!loading) setOpen((prev) => !prev);
                }}
                disabled={loading}
                className={`${selectClass} flex w-full items-center justify-between text-left`}
            >
                <span className={selectedLabel ? "text-[#263333]" : "text-[#9aa19f]"}>
                    {loading ? loadingLabel : selectedLabel || placeholder}
                </span>

                <ChevronDown className="h-4 w-4 shrink-0 text-[#9aa19f]" />
            </button>

            {open && !loading && (
                <div className="absolute z-20 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-[#eef0ee] px-3 py-2.5">
                        <Search className="h-4 w-4 text-[#9aa19f]" />

                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un pays..."
                            className="w-full text-sm outline-none placeholder:text-[#9aa19f]"
                        />
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                        {value && (
                            <button
                                type="button"
                                onClick={() => handleSelect({ value: "" })}
                                className="block w-full px-3 py-2.5 text-left text-sm text-[#9aa19f] hover:bg-[#f6f7f5]"
                            >
                                Effacer la sélection
                            </button>
                        )}

                        {filtered.length === 0 && (
                            <p className="px-3 py-2.5 text-sm text-[#9aa19f]">
                                Aucun résultat.
                            </p>
                        )}

                        {filtered.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`block w-full px-3 py-2.5 text-left text-sm hover:bg-[#f6f7f5] ${
                                    option.value === value
                                        ? "bg-[#bf5429]/10 text-[#bf5429]"
                                        : "text-[#263333]"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PeopleIndex({ people, filters, groups = {} }) {
    const [search, setSearch] = useState(filters?.search ?? "");
    const [country, setCountry] = useState(filters?.country ?? "");
    const [gender, setGender] = useState(filters?.gender ?? "");
    const [source, setSource] = useState(filters?.source ?? "");
    const [groupType, setGroupType] = useState(filters?.group_type ?? "");

    // Sélection :
    // - selectAll = false -> seuls les ids de selectedPeople sont concernés
    // - selectAll = true  -> tous les résultats du filtre, sauf excludedPeople
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [excludedPeople, setExcludedPeople] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailFiles, setEmailFiles] = useState([]);
    const [sendingEmail, setSendingEmail] = useState(false);

    const rows = people?.data ?? [];
    const links = people?.links ?? [];
    const total = people?.total ?? rows.length;

    /* ---------- Pays via /api/countries ---------- */

    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true);

            try {
                const response = await fetch(route("api.countries"));

                if (!response.ok) throw new Error("Erreur pays");

                const result = await response.json();

                setCountries(result.countries || []);
            } catch (error) {
                console.error(error);
                setCountries([]);
            } finally {
                setLoadingCountries(false);
            }
        };

        loadCountries();
    }, []);

    const countryOptions = countries.map((c) => ({
        value: c.name,
        label: c.code ? `${c.name} (${c.code})` : c.name,
    }));

    const groupOptions = Object.entries(groups).map(([value, label]) => ({
        value,
        label,
    }));

    /* ---------- Valeurs calculées ---------- */

    const isRowChecked = (id) =>
        selectAll ? !excludedPeople.includes(id) : selectedPeople.includes(id);

    const allPageSelected =
        rows.length > 0 && rows.every((p) => isRowChecked(p.id));

    const somePageSelected = rows.some((p) => isRowChecked(p.id));

    const selectedCount = selectAll
        ? total - excludedPeople.length
        : selectedPeople.length;

    const hasSelection = selectedCount > 0;

    const hasActiveFilters = Boolean(
        search || country || gender || source
    );

    /* ---------- Sélection ---------- */

    const clearSelection = () => {
        setSelectAll(false);
        setSelectedPeople([]);
        setExcludedPeople([]);
    };

    const selectEverything = () => {
        setSelectAll(true);
        setSelectedPeople([]);
        setExcludedPeople([]);
    };

    // Checkbox du header : agit uniquement sur la page courante
    const togglePage = (checked) => {
        const ids = rows.map((p) => p.id);

        if (selectAll) {
            setExcludedPeople((cur) =>
                checked
                    ? cur.filter((id) => !ids.includes(id))
                    : [...new Set([...cur, ...ids])]
            );
            return;
        }

        setSelectedPeople((cur) =>
            checked
                ? [...new Set([...cur, ...ids])]
                : cur.filter((id) => !ids.includes(id))
        );
    };

    const toggleRow = (id, checked) => {
        if (selectAll) {
            setExcludedPeople((cur) =>
                checked ? cur.filter((x) => x !== id) : [...cur, id]
            );
        } else {
            setSelectedPeople((cur) =>
                checked ? [...cur, id] : cur.filter((x) => x !== id)
            );
        }
    };

    /* ---------- Filtres ---------- */

    const applyFilters = (overrides = {}) => {
        // Le filtre change l'ensemble des résultats : on repart de zéro
        clearSelection();

        const nextSource = overrides.source ?? source;

        router.get(
            route("people.index"),
            {
                search: overrides.search ?? search,
                country: overrides.country ?? country,
                gender: overrides.gender ?? gender,
                source: nextSource || undefined,
                // Le sous-groupe n'a de sens que si "Groupe de travail" est choisi
                group_type:
                    nextSource === "group"
                        ? overrides.group_type ?? groupType
                        : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const resetFilters = () => {
        setSearch("");
        setCountry("");
        setGender("");
        setSource("");
        setGroupType("");
        clearSelection();

        router.get(
            route("people.index"),
            {},
            { preserveState: true, replace: true }
        );
    };

    // Changer la source réinitialise le sous-groupe si on quitte "Groupe de travail"
    const handleSourceChange = (value) => {
        setSource(value);

        if (value !== "group") {
            setGroupType("");
        }

        applyFilters({ source: value, group_type: value === "group" ? groupType : "" });
    };

    /* ---------- Email ---------- */

    const openEmailModal = () => {
        if (!hasSelection) {
            alert("Veuillez sélectionner au moins une personne.");
            return;
        }

        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        if (sendingEmail) return;
        setShowEmailModal(false);
    };

    const handleFiles = (e) => {
        setEmailFiles(Array.from(e.target.files || []));
    };

    const sendEmail = async () => {
        if (!emailSubject.trim()) {
            alert("Veuillez saisir l'objet du message.");
            return;
        }

        if (!emailMessage.trim() || emailMessage === "<p><br></p>") {
            alert("Veuillez saisir le message.");
            return;
        }

        if (!hasSelection) {
            alert("Veuillez sélectionner au moins une personne.");
            return;
        }

        const formData = new FormData();

        formData.append("subject", emailSubject);
        formData.append("message", emailMessage);
        formData.append("select_all", selectAll ? "1" : "0");

        if (selectAll) {
            // Filtres ACTUELLEMENT appliqués (ceux de la liste affichée)
            if (search) formData.append("search", search);
            if (country) formData.append("country", country);
            if (gender) formData.append("gender", gender);
            if (source) formData.append("source", source);
            if (source === "group" && groupType) {
                formData.append("group_type", groupType);
            }

            excludedPeople.forEach((id) =>
                formData.append("excluded_people[]", id)
            );
        } else {
            selectedPeople.forEach((id) => formData.append("people[]", id));
        }

        emailFiles.forEach((file) => formData.append("files[]", file));

        setSendingEmail(true);

        try {
            const { data } = await axios.post(
                route("people.send-email"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert(data?.message || "Email envoyé avec succès.");

            setShowEmailModal(false);
            setEmailSubject("");
            setEmailMessage("");
            setEmailFiles([]);
            clearSelection();
        } catch (error) {
            console.error(error);

            const errors = error?.response?.data?.errors;
            const firstError = errors ? Object.values(errors)[0]?.[0] : null;

            alert(
                firstError ||
                    error?.response?.data?.message ||
                    "Une erreur est survenue lors de l'envoi de l'email."
            );
        } finally {
            setSendingEmail(false);
        }
    };

    // Mappage du genre
    const genderLabels = {
        H: "Masculin",
        F: "Féminin",
    };

    const getGenderColor = (gender) => {
        switch (gender) {
            case "M":
                return "bg-blue-50 text-blue-700";
            case "F":
                return "bg-pink-50 text-pink-700";
            case "O":
                return "bg-purple-50 text-purple-700";
            default:
                return "bg-gray-50 text-gray-700";
        }
    };

    return (
        <AdminLayout>
            <Head title="People" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#bf5429]/10 text-[#bf5429]">
                                <Users className="h-5 w-5" />
                            </span>
                            <h1 className="text-2xl font-semibold text-[#1f2d2d] md:text-3xl">
                                Personnes
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-[#68706e]">
                            Liste globale des {total} personne(s) enregistrée(s)
                            dans l'Observatoire.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {hasSelection && (
                            <button
                                type="button"
                                onClick={openEmailModal}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bf5429] bg-white px-5 py-3 text-sm font-semibold text-[#bf5429] transition hover:bg-[#bf5429]/5"
                            >
                                <Mail className="h-4 w-4" />
                                Email ({selectedCount})
                            </button>
                        )}

                        <Link
                            href={route("people.create")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                        >
                            <UserPlus className="h-4 w-4" />
                            Ajouter
                        </Link>
                    </div>
                </div>

                {/* FILTRES */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                    }}
                    className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#dfe3e0] bg-white p-4"
                >
                    {/* Ligne 1 : recherche texte */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa19f]" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nom, email, téléphone, organisation..."
                                className="w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-10 pr-4 text-sm text-[#263333] outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320]"
                            >
                                Rechercher
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2]"
                                >
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Ligne 2 : pays, genre, source d'inscription (+ sous-groupe) */}
                    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <SearchableSelect
                            placeholder="Tous les pays"
                            loadingLabel="Chargement des pays..."
                            loading={loadingCountries}
                            options={countryOptions}
                            value={country}
                            onChange={(value) => {
                                setCountry(value);
                                applyFilters({ country: value });
                            }}
                            className="md:w-56"
                        />

                        <select
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                applyFilters({ gender: e.target.value });
                            }}
                            className={`${selectClass} md:w-44`}
                        >
                            <option value="">Tous les genres</option>
                            <option value="H">Hommes</option>
                            <option value="F">Femmes</option>
                        </select>

                        <select
                            value={source}
                            onChange={(e) => handleSourceChange(e.target.value)}
                            className={`${selectClass} md:w-60`}
                        >
                            {SOURCE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Sous-filtre : quel groupe de travail précisément */}
                        {source === "group" && (
                            <select
                                value={groupType}
                                onChange={(e) => {
                                    setGroupType(e.target.value);
                                    applyFilters({ group_type: e.target.value });
                                }}
                                className={`${selectClass} md:w-72`}
                            >
                                <option value="">Tous les groupes de travail</option>

                                {groupOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </form>

                {/* BANNIÈRE "SÉLECTIONNER TOUT" (style Gmail) */}
                {allPageSelected && total > rows.length && (
                    <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-[#bf5429]/5 px-4 py-3 text-sm text-[#263333]">
                        {selectAll ? (
                            <>
                                <span>
                                    Les <strong>{selectedCount}</strong> personne(s)
                                    sont sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="font-semibold text-[#bf5429] underline hover:no-underline"
                                >
                                    Annuler
                                </button>
                            </>
                        ) : (
                            <>
                                <span>
                                    <strong>{rows.length}</strong> de cette page sont
                                    sélectionnées.
                                </span>
                                <button
                                    type="button"
                                    onClick={selectEverything}
                                    className="font-semibold text-[#bf5429] underline hover:no-underline"
                                >
                                    Sélectionner les {total}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* TABLEAU */}
                <div className="overflow-hidden rounded-2xl border border-[#dfe3e0] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f6f7f5] text-xs uppercase tracking-wide text-[#78807e]">
                                <tr>
                                    <th className="w-12 px-5 py-3.5 font-medium">
                                        <input
                                            type="checkbox"
                                            checked={allPageSelected}
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate =
                                                        somePageSelected &&
                                                        !allPageSelected;
                                                }
                                            }}
                                            onChange={(e) =>
                                                togglePage(e.target.checked)
                                            }
                                        />
                                    </th>

                                    <th className="px-5 py-3.5 font-medium">
                                        Personne
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Fonction
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Organisation
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Pays
                                    </th>
                                    <th className="px-5 py-3.5 font-medium">
                                        Genre
                                    </th>
                                    <th className="px-5 py-3.5 text-right font-medium">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#eef0ee]">
                                {rows.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center text-sm text-[#78807e]"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-8 w-8 opacity-30" />
                                                <span>
                                                    Aucune personne ne correspond
                                                    à ces critères.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {rows.map((person) => (
                                    <tr
                                        key={person.id}
                                        className="transition hover:bg-[#f6f7f5]"
                                    >
                                        <td className="px-5 py-4">
                                            <input
                                                type="checkbox"
                                                checked={isRowChecked(person.id)}
                                                onChange={(e) =>
                                                    toggleRow(
                                                        person.id,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* Personne (Nom, Prénom, Email) */}
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-[#263333]">
                                                {person.first_name}{" "}
                                                {person.last_name}
                                            </div>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#78807e]">
                                                <Mail className="h-3.5 w-3.5" />
                                                <a
                                                    href={`mailto:${person.email}`}
                                                    className="break-all hover:text-[#bf5429]"
                                                >
                                                    {person.email || "—"}
                                                </a>
                                            </div>

                                            {person.phone && (
                                                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#78807e]">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    <a
                                                        href={`tel:${person.phone}`}
                                                        className="break-all hover:text-[#bf5429]"
                                                    >
                                                        {person.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </td>

                                        {/* Fonction */}
                                        <td className="px-5 py-4">
                                            <span className="inline-block rounded-lg bg-[#bf5429]/10 px-2.5 py-1 text-xs font-medium text-[#bf5429]">
                                                {person.role || "—"}
                                            </span>
                                        </td>

                                        {/* Organisation */}
                                        <td className="px-5 py-4">
                                            {person.organisation ? (
                                                <div className="flex items-center gap-1.5 text-sm text-[#68706e]">
                                                    <Building2 className="h-4 w-4 text-[#78807e]" />
                                                    {person.organisation}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-[#c3c8c6]">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        {/* Pays */}
                                        <td className="px-5 py-4">
                                            {person.country ? (
                                                <div className="flex items-center gap-1.5 text-sm text-[#68706e]">
                                                    <Globe className="h-4 w-4 text-[#78807e]" />
                                                    {person.country}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-[#c3c8c6]">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        {/* Genre */}
                                        <td className="px-5 py-4">
                                            {person.gender ? (
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getGenderColor(
                                                        person.gender
                                                    )}`}
                                                >
                                                    {genderLabels[person.gender] ||
                                                        person.gender}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-[#c3c8c6]">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={route("people.history", {
                                                    person: person.id,
                                                })}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#bf5429] transition hover:text-[#a94320]"
                                            >
                                                <History className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Historique
                                                </span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                {links.length > 3 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`rounded-lg px-3.5 py-2 text-sm transition ${
                                    link.active
                                        ? "bg-[#bf5429] text-white"
                                        : link.url
                                        ? "bg-white text-[#263333] hover:bg-[#f0f2f0]"
                                        : "cursor-not-allowed bg-white text-[#c3c8c6]"
                                }`}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* EMAIL MODAL */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-[#e4e7e5] px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1f2d2d]">
                                    Envoyer un email
                                </h2>

                                <p className="mt-1 text-sm text-[#78807e]">
                                    {selectedCount} personne(s) sélectionnée(s)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-lg p-2 text-[#78807e] transition hover:bg-[#f6f7f5] hover:text-[#263333] disabled:cursor-not-allowed"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <div className="overflow-y-auto px-6 py-5">
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Objet <span className="text-[#bf5429]">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) =>
                                        setEmailSubject(e.target.value)
                                    }
                                    placeholder="Objet de l'email"
                                    className="w-full rounded-xl border border-[#d6d9d8] px-4 py-3 text-sm outline-none transition focus:border-[#bf5429] focus:ring-2 focus:ring-[#bf5429]/10"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Message <span className="text-[#bf5429]">*</span>
                                </label>

                                <div className="overflow-hidden rounded-xl border border-[#d6d9d8]">
                                    <ReactQuill
                                        theme="snow"
                                        value={emailMessage}
                                        onChange={setEmailMessage}
                                        placeholder="Écrivez votre message..."
                                        modules={{
                                            toolbar: [
                                                ["bold", "italic", "underline"],
                                                [{ list: "ordered" }, { list: "bullet" }],
                                                ["link"],
                                                ["clean"],
                                            ],
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#263333]">
                                    Fichiers / Images
                                </label>

                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d6d9d8] px-4 py-4 text-sm text-[#68706e] transition hover:border-[#bf5429] hover:bg-[#bf5429]/5">
                                    <Paperclip className="h-5 w-5 text-[#bf5429]" />

                                    <span>Ajouter des fichiers ou images</span>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                                        onChange={handleFiles}
                                        className="hidden"
                                    />
                                </label>

                                {emailFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-[#78807e]">
                                            {emailFiles.length} fichier(s) à envoyer
                                        </p>
                                        {emailFiles.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between rounded-lg bg-[#f6f7f5] px-3 py-2 text-sm"
                                            >
                                                <span className="truncate text-[#263333]">
                                                    {file.name}
                                                </span>

                                                <span className="ml-3 text-xs text-[#78807e]">
                                                    {(
                                                        file.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="flex items-center justify-end gap-3 border-t border-[#e4e7e5] px-6 py-4">
                            <button
                                type="button"
                                onClick={closeEmailModal}
                                disabled={sendingEmail}
                                className="rounded-xl border border-[#d6d9d8] bg-white px-5 py-3 text-sm font-semibold text-[#263333] transition hover:border-[#aeb5b2] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={sendEmail}
                                disabled={sendingEmail}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#bf5429] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a94320] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Mail className="h-4 w-4" />
                                {sendingEmail ? "Envoi en cours..." : "Envoyer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}