import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search, XCircle } from "lucide-react";

/*
 * Select de pays avec recherche.
 * Emplacement conseillé : resources/js/Components/CountrySelect.jsx
 *
 * Utilisation :
 *   <CountrySelect
 *       value={data.country}
 *       onChange={(value) => setData("country", value)}
 *       error={errors.country}
 *       required
 *   />
 *
 * - charge les pays via route("api.countries") (réponse : { countries: [...] })
 * - accepte ["Maroc", ...] ou [{ name: "Maroc" }, ...]
 * - la liste est mise en cache : plusieurs instances = une seule requête
 */

/* =========================================================
   Chargement + cache (niveau module)
========================================================= */

let countriesCache = null;
let countriesRequest = null;

const normalize = (value) =>
    String(value ?? "")
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const toOption = (country) => {
    const name =
        typeof country === "string"
            ? country
            : country?.name ??
              country?.label ??
              country?.nom ??
              country?.name_fr;

    return name ? { value: name, label: name } : null;
};

function fetchCountries() {
    if (countriesCache) {
        return Promise.resolve(countriesCache);
    }

    if (!countriesRequest) {
        countriesRequest = fetch(route("api.countries"), {
            headers: { Accept: "application/json" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des pays.");
                }

                return response.json();
            })
            .then((result) => {
                countriesCache = (result.countries || [])
                    .map(toOption)
                    .filter(Boolean)
                    .sort((a, b) => a.label.localeCompare(b.label, "fr"));

                return countriesCache;
            })
            .catch((error) => {
                // Permet de réessayer
                countriesRequest = null;
                throw error;
            });
    }

    return countriesRequest;
}

function useCountries() {
    const [countries, setCountries] = useState(countriesCache ?? []);
    const [loading, setLoading] = useState(!countriesCache);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (countriesCache) {
            setCountries(countriesCache);
            setLoading(false);

            return;
        }

        let cancelled = false;

        setLoading(true);
        setFailed(false);

        fetchCountries()
            .then((list) => {
                if (!cancelled) {
                    setCountries(list);
                }
            })
            .catch((error) => {
                console.error(error);

                if (!cancelled) {
                    setFailed(true);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    return { countries, loading, failed, retry };
}

/* =========================================================
   Composant
========================================================= */

export default function CountrySelect({
    value,
    onChange,
    error,
    required = false,
    placeholder = "Sélectionnez votre pays",
}) {
    const { countries, loading, failed, retry } = useCountries();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const searchRef = useRef(null);
    const listRef = useRef(null);

    const filtered = useMemo(() => {
        const q = normalize(query);

        return q
            ? countries.filter((c) => normalize(c.label).includes(q))
            : countries;
    }, [countries, query]);

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
    }, []);

    const select = (countryValue) => {
        onChange(countryValue);
        close();
        triggerRef.current?.focus();
    };

    /* Fermeture au clic extérieur */
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleMouseDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleMouseDown);

        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, close]);

    /* À l'ouverture : focus sur la recherche + liste visible à l'écran */
    useEffect(() => {
        if (!open) {
            return;
        }

        searchRef.current?.focus();

        const selectedIndex = countries.findIndex((c) => c.value === value);

        setActive(selectedIndex >= 0 ? selectedIndex : 0);

        const frame = requestAnimationFrame(() => {
            panelRef.current?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        });

        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* Garde l'élément actif visible dans la liste (clavier) */
    useEffect(() => {
        if (!open) {
            return;
        }

        listRef.current
            ?.querySelector('[data-active="true"]')
            ?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    const handleSearchKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => Math.min(i + 1, filtered.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault();

            if (filtered[active]) {
                select(filtered[active].value);
            }
        } else if (event.key === "Escape") {
            event.stopPropagation();
            close();
            triggerRef.current?.focus();
        }
    };

    if (failed) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                <span>Impossible de charger la liste des pays.</span>

                <button
                    type="button"
                    onClick={retry}
                    className="font-medium underline hover:no-underline"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                disabled={loading}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => (open ? close() : setOpen(true))}
                className={`flex w-full items-center rounded-lg border bg-[#F7F8F6]/50 px-4 py-3 text-left text-[14px] outline-none transition focus:border-[#324949]/40 focus:bg-white disabled:cursor-wait ${
                    value ? "pr-16" : "pr-10"
                } ${
                    error
                        ? "border-red-400"
                        : open
                        ? "border-[#324949]/40 bg-white"
                        : "border-[#D6D9D8]"
                }`}
            >
                <span
                    className={`flex-1 truncate ${
                        value ? "text-[#1f2d2d]" : "text-[#8A9290]"
                    }`}
                >
                    {loading ? "Chargement des pays..." : value || placeholder}
                </span>
            </button>

            {/* Validation native du navigateur quand le champ est obligatoire */}
            {required && (
                <input
                    tabIndex={-1}
                    aria-hidden="true"
                    required
                    value={value || ""}
                    onChange={() => {}}
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                />
            )}

            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9290]">
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <ChevronDown
                        size={16}
                        strokeWidth={1.8}
                        className={`transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                )}
            </span>

            {value && !loading && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Effacer le pays"
                    className="absolute right-10 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#8A9290] transition hover:text-[#1f2d2d]"
                >
                    <XCircle size={16} strokeWidth={1.8} />
                </button>
            )}

            {open && (
                <div
                    ref={panelRef}
                    className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-[#D6D9D8] bg-white shadow-xl"
                >
                    <div className="relative border-b border-[#EAECE9] p-2">
                        <Search
                            size={15}
                            strokeWidth={1.8}
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#8A9290]"
                        />

                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActive(0);
                            }}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Rechercher un pays..."
                            className="w-full rounded-lg border border-[#D6D9D8] bg-[#F7F8F6]/50 py-2.5 pl-9 pr-3 text-[14px] text-[#1f2d2d] outline-none transition placeholder:text-[#8A9290] focus:border-[#324949]/40 focus:bg-white"
                        />
                    </div>

                    <ul
                        ref={listRef}
                        role="listbox"
                        className="max-h-60 overflow-y-auto py-1"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-[13px] text-[#8A9290]">
                                Aucun pays ne correspond à « {query} ».
                            </li>
                        ) : (
                            filtered.map((country, index) => {
                                const selected = country.value === value;
                                const isActive = index === active;

                                return (
                                    <li
                                        key={`${country.value}-${index}`}
                                        role="option"
                                        aria-selected={selected}
                                        data-active={isActive}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => select(country.value)}
                                            onMouseEnter={() => setActive(index)}
                                            className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[14px] transition-colors ${
                                                isActive ? "bg-[#BF5429]/5" : ""
                                            } ${
                                                selected
                                                    ? "font-semibold text-[#BF5429]"
                                                    : "text-[#1f2d2d]"
                                            }`}
                                        >
                                            <span className="truncate">
                                                {country.label}
                                            </span>

                                            {selected && (
                                                <Check
                                                    size={15}
                                                    strokeWidth={2.2}
                                                    className="shrink-0"
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
