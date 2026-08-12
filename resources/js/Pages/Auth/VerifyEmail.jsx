// resources/js/Pages/Auth/VerifyEmail.jsx

import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { MailCheck, ShieldCheck, LogOut } from "lucide-react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Vérification de l'email" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F6F4] font-sans">

                {/* === Panneau gauche : Branding === */}
                <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden bg-[#1f2d2d] p-12">

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="blob blob-1" />
                        <div className="blob blob-2" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(191,84,41,0.12),transparent_55%)]" />
                    </div>

                    <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
                        <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
                        <span className="font-display text-lg tracking-wide text-white">
                            {import.meta.env.VITE_APP_NAME ?? "Mon Application"}
                        </span>
                    </Link>

                    <div className="relative z-10 max-w-md">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-3">
                            Dernière étape
                        </p>
                        <p className="font-display text-3xl leading-snug text-white/95">
                            Confirmez votre adresse email pour accéder à votre espace.
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

                {/* === Panneau droit : Contenu === */}
                <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-sm animate-fade-up">

                        <div className="mb-8 flex justify-center lg:hidden">
                            <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
                        </div>

                        <div className="rounded-xl border border-[#D6D9D8] bg-white p-8 shadow-sm">

                            {/* Icône */}
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#BF5429]/10">
                                <MailCheck size={22} strokeWidth={1.8} className="text-[#BF5429]" />
                            </div>

                            <div className="mb-6">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BF5429] mb-1">
                                    Vérification
                                </p>
                                <h1 className="font-display text-2xl text-[#1f2d2d]">
                                    Vérifiez votre email
                                </h1>
                                <p className="mt-2 text-[13px] leading-relaxed text-[#5B6462]">
                                    Merci de votre inscription ! Avant de commencer, veuillez
                                    confirmer votre adresse email en cliquant sur le lien que
                                    nous venons de vous envoyer. Vous ne l'avez pas reçu ?
                                    Nous pouvons vous en renvoyer un.
                                </p>
                            </div>

                            {status === "verification-link-sent" && (
                                <div className="mb-5 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">
                                    Un nouveau lien de vérification a été envoyé à
                                    l'adresse email fournie lors de votre inscription.
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <PrimaryButton
                                    className="w-full justify-center py-2.5 !bg-[#BF5429] hover:!bg-[#a8451f] !rounded-lg !shadow-sm !shadow-[#BF5429]/20 transition-all"
                                    disabled={processing}
                                >
                                    {processing ? "Envoi..." : "Renvoyer l'email de vérification"}
                                </PrimaryButton>

                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] text-[#5B6462] hover:text-[#1f2d2d] transition-colors"
                                >
                                    <LogOut size={14} strokeWidth={1.8} />
                                    Se déconnecter
                                </Link>
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