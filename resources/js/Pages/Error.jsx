import React from "react";
import { Head } from "@inertiajs/react";
import {
    FileQuestion,
    ShieldAlert,
    TimerReset,
    Hourglass,
    ServerCrash,
    Wrench,
    Home,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

/*
 * Tous les textes sont ici : modifie-les (ou traduis-les) librement.
 * `reload: true` affiche le bouton "Réessayer" au lieu de "Retour".
 */
const ERRORS = {
    403: {
        icon: ShieldAlert,
        title: "Accès non autorisé",
        message:
            "Vous n'avez pas la permission de consulter cette page.",
    },
    404: {
        icon: FileQuestion,
        title: "Page introuvable",
        message:
            "La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'adresse ou revenez à l'accueil.",
    },
    419: {
        icon: TimerReset,
        title: "Session expirée",
        message:
            "Votre session a expiré par sécurité. Rechargez la page, puis réessayez.",
        reload: true,
    },
    429: {
        icon: Hourglass,
        title: "Trop de tentatives",
        message:
            "Vous avez envoyé trop de requêtes en peu de temps. Patientez quelques instants avant de réessayer.",
        reload: true,
    },
    500: {
        icon: ServerCrash,
        title: "Une erreur est survenue",
        message:
            "Quelque chose s'est mal passé de notre côté. Notre équipe a été informée. Réessayez dans quelques instants.",
        reload: true,
    },
    503: {
        icon: Wrench,
        title: "Maintenance en cours",
        message:
            "Le site est temporairement indisponible pour maintenance. Nous revenons très vite.",
        reload: true,
    },
};

const FALLBACK = {
    icon: ServerCrash,
    title: "Une erreur est survenue",
    message: "Un problème inattendu s'est produit. Veuillez réessayer.",
    reload: true,
};

// NB : pas de route() / Ziggy ici, pour que la page fonctionne même si
// l'erreur vient de la configuration ou du routing.
export default function Error({ status = 500 }) {
    const { icon: Icon, title, message, reload } = ERRORS[status] ?? FALLBACK;

    return (
        <>
            <Head title={`${status} — ${title}`} />

            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1b2b2b] px-6 py-16">
                {/* Grand numéro en filigrane */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute select-none font-display text-[38vw] font-semibold leading-none text-white/[0.04] sm:text-[26rem]"
                >
                    {status}
                </span>

                {/* Halo orange dans le coin */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#BF5429]/25 blur-3xl"
                />

                {/* Carte */}
                <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#BF5429]/10 text-[#BF5429]">
                        <Icon size={30} strokeWidth={1.6} />
                    </div>

                    <p className="font-mono text-sm font-semibold text-[#BF5429]">
                        Erreur {status}
                    </p>

                    <h1 className="mt-2 font-display text-3xl font-medium leading-tight text-[#1f2d2d]">
                        {title}
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-[#5B6462]">
                        {message}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BF5429] px-6 py-3 text-[14px] font-medium text-white shadow-lg shadow-[#BF5429]/25 transition hover:bg-[#a8451f] focus:outline-none focus:ring-4 focus:ring-[#BF5429]/30"
                        >
                            <Home size={16} strokeWidth={1.8} />
                            Retour à l'accueil
                        </a>

                        {reload ? (
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D6D9D8] bg-white px-6 py-3 text-[14px] font-medium text-[#324949] transition hover:bg-[#F7F8F6] focus:outline-none focus:ring-4 focus:ring-[#324949]/10"
                            >
                                <RefreshCw size={16} strokeWidth={1.8} />
                                Réessayer
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D6D9D8] bg-white px-6 py-3 text-[14px] font-medium text-[#324949] transition hover:bg-[#F7F8F6] focus:outline-none focus:ring-4 focus:ring-[#324949]/10"
                            >
                                <ArrowLeft size={16} strokeWidth={1.8} />
                                Page précédente
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}