import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    User,
    Mail,
    Phone,
    Building2,
    MessageSquare,
    Send,
    MapPin,
    ArrowUpRight,
    CheckCircle,
    AlertCircle,
    X,
} from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";


function CountrySelect({ value, onChange, options }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const selected = options.find((c) => c.code === value) || options[0];

    const normalize = (str) =>
        str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const filtered = search.trim()
        ? options.filter((c) => {
              const q = normalize(search.trim());
              return (
                  normalize(c.name).includes(q) ||
                  c.dial.replace("+", "").startsWith(search.replace("+", "").trim())
              );
          })
        : options;

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setHighlightedIndex(0);
            const t = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => setHighlightedIndex(0), [search]);

    useEffect(() => {
        if (isOpen && listRef.current) {
            const item = listRef.current.children[highlightedIndex];
            if (item) item.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const picked = filtered[highlightedIndex];
            if (picked) {
                onChange(picked.code);
                setIsOpen(false);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className="flex h-full min-w-[92px] items-center gap-1.5 rounded-xl border border-[#d6d9d8] bg-white pl-3 pr-2 text-sm text-[#1f2d2d] transition-all duration-300 hover:border-[#bf5429]/50 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20"
            >
                <span className="text-lg leading-none">{selected.flag}</span>
                <span className="font-medium">{selected.dial}</span>
                <svg
                    className={`ml-auto h-3.5 w-3.5 text-[#5f6967] transition-transform duration-200 ${
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
                <div className="absolute z-20 mt-2 w-72 overflow-hidden rounded-xl border border-[#d6d9d8] bg-white shadow-2xl">
                    <div className="border-b border-[#d6d9d8] p-2">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-2.5 h-4 w-4 text-[#5f6967]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.35 4.35a7.5 7.5 0 0012.3 12.3z"
                                />
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Pays ou indicatif..."
                                className="w-full rounded-lg border border-[#d6d9d8] bg-[#f8f9f8] py-2 pl-9 pr-3 text-sm text-[#1f2d2d] placeholder:text-[#5f6967]/60 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20"
                            />
                        </div>
                    </div>

                    <ul ref={listRef} className="max-h-64 overflow-y-auto py-1">
                        {filtered.length === 0 && (
                            <li className="px-4 py-3 text-center text-sm text-[#5f6967]">Aucun résultat</li>
                        )}
                        {filtered.map((c, index) => (
                            <li key={c.code}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(c.code);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                                        index === highlightedIndex ? "bg-[#bf5429]/10" : ""
                                    } ${c.code === value ? "font-semibold text-[#bf5429]" : "text-[#1f2d2d]"}`}
                                >
                                    <span className="text-lg leading-none">{c.flag}</span>
                                    <span className="flex-grow truncate">{c.name}</span>
                                    <span className="text-xs text-[#5f6967]">{c.dial}</span>
                                    {c.code === value && (
                                        <svg
                                            className="h-4 w-4 flex-shrink-0 text-[#bf5429]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const SOCIAL_NETWORKS = [
    { key: "facebook", icon: FaInstagram, label: "Instagram" },
    { key: "linkedin", icon: FaLinkedin, label: "LinkedIn" },
    { key: "twitter", icon: FaTwitter, label: "Twitter" },
    { key: "youtube", icon: FaYoutube, label: "YouTube" },
];

// Liste des pays africains avec indicatif téléphonique (Maroc par défaut en premier)
const COUNTRIES = [
    { code: "MA", name: "Maroc", dial: "+212", flag: "🇲🇦" },

    // Afrique
    { code: "DZ", name: "Algérie", dial: "+213", flag: "🇩🇿" },
    { code: "AO", name: "Angola", dial: "+244", flag: "🇦🇴" },
    { code: "BJ", name: "Bénin", dial: "+229", flag: "🇧🇯" },
    { code: "BW", name: "Botswana", dial: "+267", flag: "🇧🇼" },
    { code: "BF", name: "Burkina Faso", dial: "+226", flag: "🇧🇫" },
    { code: "BI", name: "Burundi", dial: "+257", flag: "🇧🇮" },
    { code: "CV", name: "Cap-Vert", dial: "+238", flag: "🇨🇻" },
    { code: "CM", name: "Cameroun", dial: "+237", flag: "🇨🇲" },
    { code: "CF", name: "République centrafricaine", dial: "+236", flag: "🇨🇫" },
    { code: "TD", name: "Tchad", dial: "+235", flag: "🇹🇩" },
    { code: "KM", name: "Comores", dial: "+269", flag: "🇰🇲" },
    { code: "CG", name: "Congo-Brazzaville", dial: "+242", flag: "🇨🇬" },
    { code: "CD", name: "Congo-Kinshasa", dial: "+243", flag: "🇨🇩" },
    { code: "DJ", name: "Djibouti", dial: "+253", flag: "🇩🇯" },
    { code: "EG", name: "Égypte", dial: "+20", flag: "🇪🇬" },
    { code: "GQ", name: "Guinée équatoriale", dial: "+240", flag: "🇬🇶" },
    { code: "ER", name: "Érythrée", dial: "+291", flag: "🇪🇷" },
    { code: "SZ", name: "Eswatini", dial: "+268", flag: "🇸🇿" },
    { code: "ET", name: "Éthiopie", dial: "+251", flag: "🇪🇹" },
    { code: "GA", name: "Gabon", dial: "+241", flag: "🇬🇦" },
    { code: "GM", name: "Gambie", dial: "+220", flag: "🇬🇲" },
    { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
    { code: "GN", name: "Guinée", dial: "+224", flag: "🇬🇳" },
    { code: "GW", name: "Guinée-Bissau", dial: "+245", flag: "🇬🇼" },
    { code: "CI", name: "Côte d'Ivoire", dial: "+225", flag: "🇨🇮" },
    { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
    { code: "LS", name: "Lesotho", dial: "+266", flag: "🇱🇸" },
    { code: "LR", name: "Liberia", dial: "+231", flag: "🇱🇷" },
    { code: "LY", name: "Libye", dial: "+218", flag: "🇱🇾" },
    { code: "MG", name: "Madagascar", dial: "+261", flag: "🇲🇬" },
    { code: "MW", name: "Malawi", dial: "+265", flag: "🇲🇼" },
    { code: "ML", name: "Mali", dial: "+223", flag: "🇲🇱" },
    { code: "MR", name: "Mauritanie", dial: "+222", flag: "🇲🇷" },
    { code: "MU", name: "Maurice", dial: "+230", flag: "🇲🇺" },
    { code: "MZ", name: "Mozambique", dial: "+258", flag: "🇲🇿" },
    { code: "NA", name: "Namibie", dial: "+264", flag: "🇳🇦" },
    { code: "NE", name: "Niger", dial: "+227", flag: "🇳🇪" },
    { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
    { code: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼" },
    { code: "ST", name: "Sao Tomé-et-Principe", dial: "+239", flag: "🇸🇹" },
    { code: "SN", name: "Sénégal", dial: "+221", flag: "🇸🇳" },
    { code: "SC", name: "Seychelles", dial: "+248", flag: "🇸🇨" },
    { code: "SL", name: "Sierra Leone", dial: "+232", flag: "🇸🇱" },
    { code: "SO", name: "Somalie", dial: "+252", flag: "🇸🇴" },
    { code: "ZA", name: "Afrique du Sud", dial: "+27", flag: "🇿🇦" },
    { code: "SS", name: "Soudan du Sud", dial: "+211", flag: "🇸🇸" },
    { code: "SD", name: "Soudan", dial: "+249", flag: "🇸🇩" },
    { code: "TZ", name: "Tanzanie", dial: "+255", flag: "🇹🇿" },
    { code: "TG", name: "Togo", dial: "+228", flag: "🇹🇬" },
    { code: "TN", name: "Tunisie", dial: "+216", flag: "🇹🇳" },
    { code: "UG", name: "Ouganda", dial: "+256", flag: "🇺🇬" },
    { code: "ZM", name: "Zambie", dial: "+260", flag: "🇿🇲" },
    { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼" },

    // Europe
    { code: "AL", name: "Albanie", dial: "+355", flag: "🇦🇱" },
    { code: "AD", name: "Andorre", dial: "+376", flag: "🇦🇩" },
    { code: "AT", name: "Autriche", dial: "+43", flag: "🇦🇹" },
    { code: "BY", name: "Biélorussie", dial: "+375", flag: "🇧🇾" },
    { code: "BE", name: "Belgique", dial: "+32", flag: "🇧🇪" },
    { code: "BA", name: "Bosnie-Herzégovine", dial: "+387", flag: "🇧🇦" },
    { code: "BG", name: "Bulgarie", dial: "+359", flag: "🇧🇬" },
    { code: "HR", name: "Croatie", dial: "+385", flag: "🇭🇷" },
    { code: "CY", name: "Chypre", dial: "+357", flag: "🇨🇾" },
    { code: "CZ", name: "Tchéquie", dial: "+420", flag: "🇨🇿" },
    { code: "DK", name: "Danemark", dial: "+45", flag: "🇩🇰" },
    { code: "EE", name: "Estonie", dial: "+372", flag: "🇪🇪" },
    { code: "FI", name: "Finlande", dial: "+358", flag: "🇫🇮" },
    { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
    { code: "DE", name: "Allemagne", dial: "+49", flag: "🇩🇪" },
    { code: "GR", name: "Grèce", dial: "+30", flag: "🇬🇷" },
    { code: "HU", name: "Hongrie", dial: "+36", flag: "🇭🇺" },
    { code: "IS", name: "Islande", dial: "+354", flag: "🇮🇸" },
    { code: "IE", name: "Irlande", dial: "+353", flag: "🇮🇪" },
    { code: "IT", name: "Italie", dial: "+39", flag: "🇮🇹" },
    { code: "XK", name: "Kosovo", dial: "+383", flag: "🇽🇰" },
    { code: "LV", name: "Lettonie", dial: "+371", flag: "🇱🇻" },
    { code: "LI", name: "Liechtenstein", dial: "+423", flag: "🇱🇮" },
    { code: "LT", name: "Lituanie", dial: "+370", flag: "🇱🇹" },
    { code: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺" },
    { code: "MT", name: "Malte", dial: "+356", flag: "🇲🇹" },
    { code: "MD", name: "Moldavie", dial: "+373", flag: "🇲🇩" },
    { code: "MC", name: "Monaco", dial: "+377", flag: "🇲🇨" },
    { code: "ME", name: "Monténégro", dial: "+382", flag: "🇲🇪" },
    { code: "NL", name: "Pays-Bas", dial: "+31", flag: "🇳🇱" },
    { code: "MK", name: "Macédoine du Nord", dial: "+389", flag: "🇲🇰" },
    { code: "NO", name: "Norvège", dial: "+47", flag: "🇳🇴" },
    { code: "PL", name: "Pologne", dial: "+48", flag: "🇵🇱" },
    { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
    { code: "RO", name: "Roumanie", dial: "+40", flag: "🇷🇴" },
    { code: "RU", name: "Russie", dial: "+7", flag: "🇷🇺" },
    { code: "SM", name: "Saint-Marin", dial: "+378", flag: "🇸🇲" },
    { code: "RS", name: "Serbie", dial: "+381", flag: "🇷🇸" },
    { code: "SK", name: "Slovaquie", dial: "+421", flag: "🇸🇰" },
    { code: "SI", name: "Slovénie", dial: "+386", flag: "🇸🇮" },
    { code: "ES", name: "Espagne", dial: "+34", flag: "🇪🇸" },
    { code: "SE", name: "Suède", dial: "+46", flag: "🇸🇪" },
    { code: "CH", name: "Suisse", dial: "+41", flag: "🇨🇭" },
    { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
    { code: "GB", name: "Royaume-Uni", dial: "+44", flag: "🇬🇧" },
    { code: "VA", name: "Vatican", dial: "+379", flag: "🇻🇦" },

    // Asie
    { code: "AF", name: "Afghanistan", dial: "+93", flag: "🇦🇫" },
    { code: "AM", name: "Arménie", dial: "+374", flag: "🇦🇲" },
    { code: "AZ", name: "Azerbaïdjan", dial: "+994", flag: "🇦🇿" },
    { code: "BH", name: "Bahreïn", dial: "+973", flag: "🇧🇭" },
    { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
    { code: "BT", name: "Bhoutan", dial: "+975", flag: "🇧🇹" },
    { code: "BN", name: "Brunei", dial: "+673", flag: "🇧🇳" },
    { code: "KH", name: "Cambodge", dial: "+855", flag: "🇰🇭" },
    { code: "CN", name: "Chine", dial: "+86", flag: "🇨🇳" },
    { code: "GE", name: "Géorgie", dial: "+995", flag: "🇬🇪" },
    { code: "IN", name: "Inde", dial: "+91", flag: "🇮🇳" },
    { code: "ID", name: "Indonésie", dial: "+62", flag: "🇮🇩" },
    { code: "IR", name: "Iran", dial: "+98", flag: "🇮🇷" },
    { code: "IQ", name: "Irak", dial: "+964", flag: "🇮🇶" },
    { code: "IL", name: "Israël", dial: "+972", flag: "🇮🇱" },
    { code: "JP", name: "Japon", dial: "+81", flag: "🇯🇵" },
    { code: "JO", name: "Jordanie", dial: "+962", flag: "🇯🇴" },
    { code: "KZ", name: "Kazakhstan", dial: "+7", flag: "🇰🇿" },
    { code: "KW", name: "Koweït", dial: "+965", flag: "🇰🇼" },
    { code: "KG", name: "Kirghizistan", dial: "+996", flag: "🇰🇬" },
    { code: "LA", name: "Laos", dial: "+856", flag: "🇱🇦" },
    { code: "LB", name: "Liban", dial: "+961", flag: "🇱🇧" },
    { code: "MY", name: "Malaisie", dial: "+60", flag: "🇲🇾" },
    { code: "MV", name: "Maldives", dial: "+960", flag: "🇲🇻" },
    { code: "MN", name: "Mongolie", dial: "+976", flag: "🇲🇳" },
    { code: "MM", name: "Myanmar", dial: "+95", flag: "🇲🇲" },
    { code: "NP", name: "Népal", dial: "+977", flag: "🇳🇵" },
    { code: "KP", name: "Corée du Nord", dial: "+850", flag: "🇰🇵" },
    { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
    { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
    { code: "PS", name: "Palestine", dial: "+970", flag: "🇵🇸" },
    { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
    { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
    { code: "SA", name: "Arabie saoudite", dial: "+966", flag: "🇸🇦" },
    { code: "SG", name: "Singapour", dial: "+65", flag: "🇸🇬" },
    { code: "KR", name: "Corée du Sud", dial: "+82", flag: "🇰🇷" },
    { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
    { code: "SY", name: "Syrie", dial: "+963", flag: "🇸🇾" },
    { code: "TW", name: "Taïwan", dial: "+886", flag: "🇹🇼" },
    { code: "TJ", name: "Tadjikistan", dial: "+992", flag: "🇹🇯" },
    { code: "TH", name: "Thaïlande", dial: "+66", flag: "🇹🇭" },
    { code: "TL", name: "Timor oriental", dial: "+670", flag: "🇹🇱" },
    { code: "TR", name: "Turquie", dial: "+90", flag: "🇹🇷" },
    { code: "TM", name: "Turkménistan", dial: "+993", flag: "🇹🇲" },
    { code: "AE", name: "Émirats arabes unis", dial: "+971", flag: "🇦🇪" },
    { code: "UZ", name: "Ouzbékistan", dial: "+998", flag: "🇺🇿" },
    { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
    { code: "YE", name: "Yémen", dial: "+967", flag: "🇾🇪" },

    // Amérique
    { code: "AG", name: "Antigua-et-Barbuda", dial: "+1268", flag: "🇦🇬" },
    { code: "AR", name: "Argentine", dial: "+54", flag: "🇦🇷" },
    { code: "BS", name: "Bahamas", dial: "+1242", flag: "🇧🇸" },
    { code: "BB", name: "Barbade", dial: "+1246", flag: "🇧🇧" },
    { code: "BZ", name: "Belize", dial: "+501", flag: "🇧🇿" },
    { code: "BO", name: "Bolivie", dial: "+591", flag: "🇧🇴" },
    { code: "BR", name: "Brésil", dial: "+55", flag: "🇧🇷" },
    { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
    { code: "CL", name: "Chili", dial: "+56", flag: "🇨🇱" },
    { code: "CO", name: "Colombie", dial: "+57", flag: "🇨🇴" },
    { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
    { code: "CU", name: "Cuba", dial: "+53", flag: "🇨🇺" },
    { code: "DM", name: "Dominique", dial: "+1767", flag: "🇩🇲" },
    { code: "DO", name: "République dominicaine", dial: "+1809", flag: "🇩🇴" },
    { code: "EC", name: "Équateur", dial: "+593", flag: "🇪🇨" },
    { code: "SV", name: "Salvador", dial: "+503", flag: "🇸🇻" },
    { code: "GD", name: "Grenade", dial: "+1473", flag: "🇬🇩" },
    { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹" },
    { code: "GY", name: "Guyana", dial: "+592", flag: "🇬🇾" },
    { code: "HT", name: "Haïti", dial: "+509", flag: "🇭🇹" },
    { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳" },
    { code: "JM", name: "Jamaïque", dial: "+1876", flag: "🇯🇲" },
    { code: "MX", name: "Mexique", dial: "+52", flag: "🇲🇽" },
    { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮" },
    { code: "PA", name: "Panama", dial: "+507", flag: "🇵🇦" },
    { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
    { code: "PE", name: "Pérou", dial: "+51", flag: "🇵🇪" },
    { code: "KN", name: "Saint-Christophe-et-Niévès", dial: "+1869", flag: "🇰🇳" },
    { code: "LC", name: "Sainte-Lucie", dial: "+1758", flag: "🇱🇨" },
    { code: "VC", name: "Saint-Vincent-et-les-Grenadines", dial: "+1784", flag: "🇻🇨" },
    { code: "SR", name: "Suriname", dial: "+597", flag: "🇸🇷" },
    { code: "TT", name: "Trinité-et-Tobago", dial: "+1868", flag: "🇹🇹" },
    { code: "US", name: "États-Unis", dial: "+1", flag: "🇺🇸" },
    { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
    { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },

    // Océanie
    { code: "AU", name: "Australie", dial: "+61", flag: "🇦🇺" },
    { code: "FJ", name: "Fidji", dial: "+679", flag: "🇫🇯" },
    { code: "KI", name: "Kiribati", dial: "+686", flag: "🇰🇮" },
    { code: "MH", name: "Îles Marshall", dial: "+692", flag: "🇲🇭" },
    { code: "FM", name: "Micronésie", dial: "+691", flag: "🇫🇲" },
    { code: "NR", name: "Nauru", dial: "+674", flag: "🇳🇷" },
    { code: "NZ", name: "Nouvelle-Zélande", dial: "+64", flag: "🇳🇿" },
    { code: "PW", name: "Palaos", dial: "+680", flag: "🇵🇼" },
    { code: "PG", name: "Papouasie-Nouvelle-Guinée", dial: "+675", flag: "🇵🇬" },
    { code: "WS", name: "Samoa", dial: "+685", flag: "🇼🇸" },
    { code: "SB", name: "Îles Salomon", dial: "+677", flag: "🇸🇧" },
    { code: "TO", name: "Tonga", dial: "+676", flag: "🇹🇴" },
    { code: "TV", name: "Tuvalu", dial: "+688", flag: "🇹🇻" },
    { code: "VU", name: "Vanuatu", dial: "+678", flag: "🇻🇺" },
];

// Composant Toast personnalisé
const Toast = ({ message, type = "success", onClose, autoClose = 7000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, autoClose);

        return () => clearTimeout(timer);
    }, [autoClose, onClose]);

    const isSuccess = type === "success";
    const bgColor = isSuccess
        ? "bg-gradient-to-r from-green-500 to-emerald-500"
        : "bg-gradient-to-r from-red-500 to-orange-500";
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
                isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
            }`}
        >
            <div className={`${bgColor} text-white rounded-xl p-4 shadow-2xl flex gap-3 max-w-md backdrop-blur-sm border border-white/20`}>
                <div className="flex-shrink-0 mt-1">
                    <Icon className={`w-6 h-6 ${isSuccess ? "animate-bounce" : "animate-pulse"}`} />
                </div>
                <div className="flex-grow">
                    <p className="font-semibold text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors duration-200 mt-1"
                >
                    <X className="w-4 h-4" />
                </button>
                <style>{`
                    @keyframes progress {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                    .toast-progress {
                        animation: progress ${autoClose}ms linear forwards;
                    }
                `}</style>
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full toast-progress"></div>
            </div>
        </div>
    );
};

export default function ContactForm({ settings = {} }) {
    const sectionRef = useRef(null);
    const leftRef = useRef(null);
    const formRef = useRef(null);
    const [localErrors, setLocalErrors] = useState({}); // للأخطاء المحلية
    const [formMessage, setFormMessage] = useState(null); // لرسالة النجاح فقط

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: "",
        email: "",
        phone: "",
        country: "MA",
        organization: "",
        subject: "",
        message: "",
        consent: false,
    });

    // Fusionne l'indicatif téléphonique avec le numéro uniquement au moment de l'envoi
    transform((formData) => {
        const selected = COUNTRIES.find((c) => c.code === formData.country);
        const dial = selected ? selected.dial : "";
        return {
            ...formData,
            phone: formData.phone ? `${dial}${formData.phone.replace(/^0+/, "")}` : "",
        };
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-8");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        [leftRef.current, formRef.current].forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        if (!phone.trim()) return true;
        const cleanPhone = phone.replace(/[\s-]/g, "");
        return cleanPhone.length >= 9 && cleanPhone.length <= 15 && /^\d+$/.test(cleanPhone);
    };

    const submit = (e) => {
        e.preventDefault();
        setFormMessage(null);

        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = "Name is required";
        } else if (data.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(data.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (data.phone.trim() && !validatePhone(data.phone)) {
            newErrors.phone = "Phone number must be 9-15 digits";
        }

        if (!data.message.trim()) {
            newErrors.message = "Message is required";
        } else if (data.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        if (!data.consent) {
            newErrors.consent = "You must accept the terms to continue";
        }

        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }

        setLocalErrors({});

        post(route("contact.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setFormMessage({
                    type: "success",
                    message: "Thank you! Your message has been sent successfully.\nWe'll get back to you soon."
                });
                reset();
            },
            onError: () => {
                setFormMessage({
                    type: "error",
                    message: "Failed to send message.\nPlease try again later."
                });
            },
        });
    };

    const activeSocials = SOCIAL_NETWORKS.filter((network) => settings[network.key]);

    const inputClasses =
        "w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-12 pr-4 text-[#1f2d2d] placeholder:text-[#5f6967]/50 transition-all duration-300 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 hover:border-[#bf5429]/50";

    return (
        <section id="contact" ref={sectionRef} className="relative overflow-hidden py-24 lg:py-32">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#bf5429]/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-[#324949]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23bf5429%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                <div className="max-w-2xl mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-gradient-to-r from-[#bf5429] to-transparent"></span>
                        <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#bf5429]" />
                            Get in touch
                        </span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
                        Let's start a{" "}
                        <span className="relative">
                            <span className="relative z-10 text-[#bf5429]">conversation</span>
                            <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/15 -z-10 rounded-sm"></span>
                        </span>
                    </h2>
                    <p className="mt-5 text-[#5f6967] font-light text-lg leading-relaxed max-w-xl">
                        Questions, partnership requests, or research collaboration — our team
                        replies within one business day.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-5">
                    <div ref={leftRef} className="lg:col-span-2 opacity-0 translate-y-8 transition-all duration-700 ease-out">
                        <div className="relative h-full rounded-2xl bg-gradient-to-br from-[#1f2d2d] to-[#162020] p-10 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#bf5429]/20 blur-3xl group-hover:bg-[#bf5429]/30 transition-all duration-500"></div>
                            <div
                                className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(191,84,41,0.25), transparent 45%)" }}
                            ></div>
                            <MessageSquare className="absolute -bottom-6 -right-6 w-40 h-40 text-white/[0.04] rotate-12 group-hover:text-white/[0.06] transition-all duration-500" strokeWidth={1} />

                            <div className="relative space-y-8">
                                <div>
                                    <h3 className="font-display text-2xl lg:text-3xl text-white font-medium leading-snug">
                                        We're always happy to hear from you.
                                    </h3>
                                    <p className="mt-3 text-white/60 leading-relaxed text-sm">
                                        Reach out directly, or use the form — whichever is easier for you.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {settings.email && (
                                        <a href={`mailto:${settings.email}`} className="group/item flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/10 group-hover/item:bg-[#bf5429] group-hover/item:border-[#bf5429] transition-all duration-300 flex-shrink-0">
                                                <Mail className="h-5 w-5" />
                                            </span>
                                            <div className="flex-grow">
                                                <p className="text-xs text-white/50 font-medium">Email</p>
                                                <p className="text-sm font-semibold">{settings.email}</p>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 flex-shrink-0" />
                                        </a>
                                    )}

                                    {settings.phone && (
                                        <a href={`tel:${settings.phone}`} className="group/item flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/10 group-hover/item:bg-[#bf5429] group-hover/item:border-[#bf5429] transition-all duration-300 flex-shrink-0">
                                                <Phone className="h-5 w-5" />
                                            </span>
                                            <div className="flex-grow">
                                                <p className="text-xs text-white/50 font-medium">Phone</p>
                                                <p className="text-sm font-semibold">{settings.phone}</p>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 flex-shrink-0" />
                                        </a>
                                    )}

                                    {settings.address && (
                                        <div className="flex items-center gap-4 text-white/90 p-3 rounded-lg bg-white/5">
                                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex-shrink-0">
                                                <MapPin className="h-5 w-5" />
                                            </span>
                                            <div className="flex-grow">
                                                <p className="text-xs text-white/50 font-medium">Address</p>
                                                <p className="text-sm font-semibold">{settings.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {activeSocials.length > 0 && (
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-xs text-white/50 font-medium mb-3">Follow us</p>
                                        <div className="flex items-center gap-3">
                                            {activeSocials.map(({ key, icon: Icon, label }) => (
                                                <a
                                                    key={key}
                                                    href={settings[key]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={label}
                                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#bf5429] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group/social border border-white/10 hover:border-[#bf5429]"
                                                >
                                                    <Icon className="w-4 h-4 text-white/70 group-hover/social:text-white transition-colors duration-300" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div ref={formRef} className="lg:col-span-3 opacity-0 translate-y-8 transition-all duration-700 delay-150 ease-out">
                        <div className="rounded-2xl bg-white border border-[#d6d9d8]/30 p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#bf5429] to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Full Name <span className="text-[#bf5429]">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className={`${inputClasses} ${localErrors.name ? "border-red-500 ring-2 ring-red-200" : ""}`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {localErrors.name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {localErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Email <span className="text-[#bf5429]">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className={`${inputClasses} ${localErrors.email ? "border-red-500 ring-2 ring-red-200" : ""}`}
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                        {localErrors.email && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {localErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <CountrySelect
                                        value={data.country}
                                        onChange={(code) => setData("country", code)}
                                        options={COUNTRIES}
                                    />
                                    <div className="relative flex-grow">
                                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            className={`${inputClasses} ${localErrors.phone ? "border-red-500 ring-2 ring-red-200" : ""}`}
                                            placeholder="6XX XXX XXX"
                                        />
                                    </div>
                                </div>

                                <div className="group/field">
                                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData("subject", e.target.value)}
                                        className={`w-full rounded-xl border border-[#d6d9d8] bg-white p-3 text-[#1f2d2d] placeholder:text-[#5f6967]/50 transition-all duration-300 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 hover:border-[#bf5429]/50 ${errors.subject ? "border-[#bf5429]/50 ring-2 ring-[#bf5429]/20" : ""}`}
                                        placeholder="How can we help? (optional)"
                                    />

                                </div>

                                <div className="group/field">
                                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                        Message <span className="text-[#bf5429]">*</span>
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                        <textarea
                                            rows={6}
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            className={`${inputClasses} resize-none ${localErrors.message ? "border-red-500 ring-2 ring-red-200" : ""}`}
                                            placeholder="Write your message here... (minimum 10 characters)"
                                        />
                                    </div>
                                    {localErrors.message && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {localErrors.message}
                                        </p>
                                    )}
                                </div>

                                <div className={`flex items-start gap-3 p-3 bg-[#f8f9f8] rounded-lg border ${localErrors.consent ? "border-red-500 bg-red-50" : "border-[#d6d9d8]"}`}>
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        checked={data.consent}
                                        onChange={(e) => setData("consent", e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-[#d6d9d8] text-[#bf5429] focus:ring-[#bf5429]/30 cursor-pointer"
                                    />
                                    <label htmlFor="consent" className="text-sm text-[#1f2d2d] leading-relaxed cursor-pointer flex-grow font-medium">
                                        I agree to use my contact information to respond to my request
                                    </label>
                                </div>
                                {localErrors.consent && (
                                    <p className="text-sm text-red-600 flex items-center gap-1 -mt-4 font-medium">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {localErrors.consent}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2d2d] to-[#2a3a3a] px-6 py-4 font-semibold text-white transition-all duration-300 hover:from-[#bf5429] hover:to-[#a83f1f] hover:shadow-lg hover:shadow-[#bf5429]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -translate-x-full group-hover/btn:translate-x-full animate-shimmer"></div>
                                    <Send className="h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                    <span className="transition-all duration-300">
                                        {processing ? (
                                            <>
                                                <span className="inline-block animate-spin ml-2">⚡</span>
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </span>
                                </button>

                                {formMessage && formMessage.type === 'success' && (
                                    <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300 flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium text-green-800">
                                                ✓ {formMessage.message}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </form>

                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#bf5429]/5 to-transparent rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </section>
    );
}