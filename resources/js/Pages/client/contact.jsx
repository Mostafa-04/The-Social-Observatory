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
import { FaFacebookF, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

const SOCIAL_NETWORKS = [
    { key: "facebook", icon: FaFacebookF, label: "Facebook" },
    { key: "linkedin", icon: FaLinkedin, label: "LinkedIn" },
    { key: "twitter", icon: FaTwitter, label: "Twitter" },
    { key: "youtube", icon: FaYoutube, label: "YouTube" },
];

// Liste des pays africains avec indicatif téléphonique (Maroc par défaut en premier)
const COUNTRIES = [
    { code: "MA", name: "Maroc", dial: "+212", flag: "🇲🇦" },
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

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Phone
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={data.country}
                                                onChange={(e) => setData("country", e.target.value)}
                                                className="rounded-xl border border-[#d6d9d8] bg-white px-2 text-sm text-[#1f2d2d] focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 hover:border-[#bf5429]/50 transition-all duration-300 max-w-[160px]"
                                            >
                                                {COUNTRIES.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.flag} {c.name} ({c.dial})
                                                    </option>
                                                ))}
                                            </select>
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
                                        {localErrors.phone && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {localErrors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Organization
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={data.organization}
                                                onChange={(e) => setData("organization", e.target.value)}
                                                className={inputClasses}
                                                placeholder="Your organization (optional)"
                                            />
                                        </div>

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

            <style jsx>{`
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