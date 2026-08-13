// resources/js/Pages/Auth/Login.jsx

import { useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Connexion" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F6F4] font-sans">

                {/* === Panneau gauche : Branding === */}
                <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden bg-[#1f2d2d] p-12">

                    {/* Formes animées en arrière-plan */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="blob blob-1" />
                        <div className="blob blob-2" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(191,84,41,0.12),transparent_55%)]" />
                    </div>

                    {/* Logo */}
                    <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
                        <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
                        <span className="font-display text-lg tracking-wide text-white">
                            {import.meta.env.VITE_APP_NAME ?? "Mon Application"}
                        </span>
                    </Link>

                    {/* Accroche */}
                    <div className="relative z-10 max-w-md">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-3">
                            Espace administrateur
                        </p>
                        <p className="font-display text-3xl leading-snug text-white/95">
                            Gérez votre contenu, vos paramètres et vos contacts en un seul endroit.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
                            <ShieldCheck size={16} strokeWidth={1.8} className="text-[#BF5429]" />
                            Connexion sécurisée
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-xs text-white/35">
                        &copy; {new Date().getFullYear()} — Tous droits réservés
                    </div>
                </div>

                {/* === Panneau droit : Formulaire === */}
                <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-sm animate-fade-up">

                        {/* Logo mobile */}
                        <div className="mb-8 flex justify-center lg:hidden">
                            <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
                        </div>

                        {/* Carte */}
                        <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">

                            <div className="mb-6">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                                    Bienvenue
                                </p>
                                <h1 className="font-display text-2xl text-[#1f2d2d]">
                                    Connexion
                                </h1>
                                <p className="mt-1 text-[13px] text-[#5B6462]">
                                    Entrez vos identifiants pour accéder à votre espace.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">

                                {/* Email */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="text-[13px] font-medium text-[#1f2d2d]"
                                    />
                                    <div className="relative mt-1.5">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A9290]">
                                            <Mail size={15} strokeWidth={1.8} />
                                        </span>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full !pl-9 text-[13.5px] rounded-lg border-[#D6D9D8] focus:border-[#BF5429] focus:ring-[#BF5429]/25"
                                            autoComplete="username"
                                            isFocused={true}
                                            placeholder="vous@exemple.com"
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Mot de passe"
                                        className="text-[13px] font-medium text-[#1f2d2d]"
                                    />
                                    <div className="relative mt-1.5">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A9290]">
                                            <Lock size={15} strokeWidth={1.8} />
                                        </span>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="block w-full !pl-9 !pr-9 text-[13.5px] rounded-lg border-[#D6D9D8] focus:border-[#BF5429] focus:ring-[#BF5429]/25"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            onChange={(e) => setData("password", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((p) => !p)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A9290] hover:text-[#1f2d2d] transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={15} strokeWidth={1.8} />
                                            ) : (
                                                <Eye size={15} strokeWidth={1.8} />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember + Forgot */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center cursor-pointer select-none">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData("remember", e.target.checked)}
                                        />
                                        <span className="ms-2 text-[13px] text-[#5B6462]">
                                            Se souvenir de moi
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-[13px] text-[#5B6462] hover:text-[#BF5429] underline-offset-4 hover:underline transition-colors"
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton
                                    className="w-full justify-center py-2.5 !bg-[#BF5429] hover:!bg-[#a8451f] !rounded-lg !shadow-sm !shadow-[#BF5429]/20 transition-all"
                                    disabled={processing}
                                >
                                    {processing ? "Connexion..." : "Se connecter"}
                                </PrimaryButton>
                            </form>
                        </div>

                        <p className="mt-6 text-center text-[12px] text-[#8A9290]">
                            Accès réservé aux administrateurs
                        </p>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                .blob {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(70px);
                    opacity: 0.4;
                    animation: float 20s ease-in-out infinite;
                }
                .blob-1 {
                    width: 300px; height: 300px;
                    top: -50px; left: -50px;
                    background: radial-gradient(circle, #BF5429, transparent 70%);
                }
                .blob-2 {
                    width: 260px; height: 260px;
                    bottom: -30px; right: -30px;
                    background: radial-gradient(circle, #324949, transparent 70%);
                    animation-delay: -8s;
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(25px, -20px) scale(1.05); }
                    66%      { transform: translate(-15px, 15px) scale(0.95); }
                }
                .animate-fade-up { animation: fadeUp 0.45s ease-out; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .blob, .animate-fade-up { animation: none; }
                }
            `}</style>
        </>
    );
}