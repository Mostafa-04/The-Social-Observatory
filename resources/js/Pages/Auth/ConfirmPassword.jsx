// resources/js/Pages/Auth/ConfirmPassword.jsx

import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Lock, Eye, EyeOff, ShieldCheck, ShieldAlert } from "lucide-react";

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Confirmer le mot de passe" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F6F4] font-sans">

                {/* === Panneau gauche : Branding === */}
                <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden bg-[#1f2d2d] p-12">

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="blob blob-1" />
                        <div className="blob blob-2" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(191,84,41,0.12),transparent_55%)]" />
                    </div>

                    <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
                        <img src="./logo.png" alt="Logo" className="h-20 w-auto" />
                        <span className="font-display text-lg tracking-wide text-white">
                            {import.meta.env.VITE_APP_NAME ?? "Mon Application"}
                        </span>
                    </Link>

                    <div className="relative z-10 max-w-md">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-3">
                            Zone sécurisée
                        </p>
                        <p className="font-display text-3xl leading-snug text-white/95">
                            Confirmez votre identité avant de continuer.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
                            <ShieldCheck size={16} strokeWidth={1.8} className="text-[#BF5429]" />
                            Connexion sécurisée
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-white/35">
                        &copy; {new Date().getFullYear()} — Tous droits réservés
                    </div>
                </div>

                {/* === Panneau droit : Formulaire === */}
                <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-sm animate-fade-up">

                        <div className="mb-8 flex justify-center lg:hidden">
                            <img src="./logo.png" alt="Logo" className="h-9 w-auto" />
                        </div>

                        <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">

                            {/* Icône */}
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#BF5429]/10">
                                <ShieldAlert size={22} strokeWidth={1.8} className="text-[#BF5429]" />
                            </div>

                            <div className="mb-6">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                                    Vérification requise
                                </p>
                                <h1 className="font-display text-2xl text-[#1f2d2d]">
                                    Confirmer le mot de passe
                                </h1>
                                <p className="mt-2 text-[13px] leading-relaxed text-[#5B6462]">
                                    Ceci est une zone sécurisée de l'application.
                                    Merci de confirmer votre mot de passe avant
                                    de continuer.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">

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
                                            isFocused={true}
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

                                <PrimaryButton
                                    className="w-full justify-center py-2.5 !bg-[#BF5429] hover:!bg-[#a8451f] !rounded-lg !shadow-sm !shadow-[#BF5429]/20 transition-all"
                                    disabled={processing}
                                >
                                    {processing ? "Confirmation..." : "Confirmer"}
                                </PrimaryButton>
                            </form>
                        </div>

                        <p className="mt-6 text-center text-[12px] text-[#8A9290]">
                            Accès réservé aux administrateurs
                        </p>
                    </div>
                </div>
            </div>

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