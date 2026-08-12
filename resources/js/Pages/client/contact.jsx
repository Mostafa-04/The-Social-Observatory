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

// مكون Toast المخصص
const Toast = ({ message, type = "success", onClose, autoClose = 5000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, autoClose);

        return () => clearTimeout(timer);
    }, [autoClose, onClose]);

    const isSuccess = type === "success";
    const bgColor = isSuccess ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-orange-500";
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
                isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
            }`}
        >
            <div className={`${bgColor} text-white rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-80 backdrop-blur-sm border border-white/20`}>
                {/* Icon with animation */}
                <div className="flex-shrink-0">
                    <Icon className={`w-6 h-6 ${isSuccess ? "animate-bounce" : "animate-pulse"}`} />
                </div>

                {/* Message */}
                <div className="flex-grow">
                    <p className="font-semibold text-sm leading-tight">{message}</p>
                </div>

                {/* Close button */}
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Progress bar */}
                <style>{`
                    @keyframes progress {
                        from {
                            width: 100%;
                        }
                        to {
                            width: 0%;
                        }
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
    const [toasts, setToasts] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        subject: "",
        message: "",
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

    const addToast = (message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const submit = (e) => {
        e.preventDefault();

        // التحقق من الأخطاء قبل الإرسال
        const newErrors = {};
        if (!data.name.trim()) newErrors.name = "Name is required";
        if (!data.email.trim()) newErrors.email = "Email is required";
        if (!data.message.trim()) newErrors.message = "Message is required";

        if (Object.keys(newErrors).length > 0) {
            addToast("Please fill in all required fields", "error");
            return;
        }

        post(route("contact.store"), {
            preserveScroll: true,
            onSuccess: () => {
                addToast("Message sent successfully! We'll get back to you soon.", "success");
                reset();
            },
            onError: () => {
                addToast("Failed to send message. Please try again.", "error");
            },
        });
    };

    const activeSocials = SOCIAL_NETWORKS.filter((network) => settings[network.key]);

    const inputClasses =
        "w-full rounded-xl border border-[#d6d9d8] bg-white py-3 pl-12 pr-4 text-[#1f2d2d] placeholder:text-[#5f6967]/50 transition-all duration-300 focus:border-[#bf5429] focus:outline-none focus:ring-2 focus:ring-[#bf5429]/20 hover:border-[#bf5429]/50";

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-40 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#bf5429]/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-[#324949]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23bf5429%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                {/* Header */}
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
                    {/* Left panel */}
                    <div
                        ref={leftRef}
                        className="lg:col-span-2 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                    >
                        <div className="relative h-full rounded-2xl bg-gradient-to-br from-[#1f2d2d] to-[#162020] p-10 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            {/* Animated background gradient */}
                            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#bf5429]/20 blur-3xl group-hover:bg-[#bf5429]/30 transition-all duration-500"></div>
                            <div
                                className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 80% 20%, rgba(191,84,41,0.25), transparent 45%)",
                                }}
                            ></div>
                            <MessageSquare
                                className="absolute -bottom-6 -right-6 w-40 h-40 text-white/[0.04] rotate-12 group-hover:text-white/[0.06] transition-all duration-500"
                                strokeWidth={1}
                            />

                            <div className="relative space-y-8">
                                <div>
                                    <h3 className="font-display text-2xl lg:text-3xl text-white font-medium leading-snug">
                                        We're always happy to hear from you.
                                    </h3>
                                    <p className="mt-3 text-white/60 leading-relaxed text-sm">
                                        Reach out directly, or use the form — whichever is easier
                                        for you.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {settings.email && (
                                        <a
                                            href={`mailto:${settings.email}`}
                                            className="group/item flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                                        >
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
                                        <a
                                            href={`tel:${settings.phone}`}
                                            className="group/item flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                                        >
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

                                {/* Social links */}
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

                    {/* Form */}
                    <div
                        ref={formRef}
                        className="lg:col-span-3 opacity-0 translate-y-8 transition-all duration-700 delay-150 ease-out"
                    >
                        <div className="rounded-2xl bg-white border border-[#d6d9d8]/30 p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            {/* Form header decoration */}
                            <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#bf5429] to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className={`${inputClasses} ${errors.name ? "border-[#bf5429]/50 ring-2 ring-[#bf5429]/20" : ""}`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className={`${inputClasses} ${errors.email ? "border-[#bf5429]/50 ring-2 ring-[#bf5429]/20" : ""}`}
                                                placeholder="john@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="group/field">
                                        <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData("phone", e.target.value)}
                                                className={inputClasses}
                                                placeholder="+212 6XX XXX XXX"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.phone}
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
                                                onChange={(e) =>
                                                    setData("organization", e.target.value)
                                                }
                                                className={inputClasses}
                                                placeholder="Your organization"
                                            />
                                        </div>
                                        {errors.organization && (
                                            <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.organization}
                                            </p>
                                        )}
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
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && (
                                        <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.subject}
                                        </p>
                                    )}
                                </div>

                                <div className="group/field">
                                    <label className="mb-2 block text-sm font-semibold text-[#1f2d2d] group-hover/field:text-[#bf5429] transition-colors duration-300">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-3.5 h-5 w-5 text-[#5f6967] group-focus-within:text-[#bf5429] transition-colors duration-300" />
                                        <textarea
                                            rows={6}
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            className={`${inputClasses} resize-none ${errors.message ? "border-[#bf5429]/50 ring-2 ring-[#bf5429]/20" : ""}`}
                                            placeholder="Write your message..."
                                        />
                                    </div>
                                    {errors.message && (
                                        <p className="mt-2 text-sm text-[#bf5429] flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f2d2d] to-[#2a3a3a] px-6 py-4 font-semibold text-white transition-all duration-300 hover:from-[#bf5429] hover:to-[#a83f1f] hover:shadow-lg hover:shadow-[#bf5429]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -translate-x-full group-hover/btn:translate-x-full animation-shimmer"></div>
                                    <Send className="h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                    <span className="transition-all duration-300">
                                        {processing ? (
                                            <>
                                                <span className="inline-block animate-spin mr-2">⚡</span>
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Decorative corner accent */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#bf5429]/5 to-transparent rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animation-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </section>
    );
}