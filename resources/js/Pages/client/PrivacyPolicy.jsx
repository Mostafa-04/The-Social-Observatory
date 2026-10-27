import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */
// 👉 Mets ici le chemin réel de ton logo (dossier /public)
const LOGO_SRC = "/logo.jpg";
const SITE_NAME = "The Social Observatory";

const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "responsable", title: "2. Responsable du traitement" },
    { id: "donnees", title: "3. Données collectées" },
    { id: "finalites", title: "4. Finalités du traitement" },
    { id: "bases", title: "5. Bases et conditions du traitement" },
    { id: "partage", title: "6. Partage des données" },
    { id: "conservation", title: "7. Durée de conservation" },
    { id: "securite", title: "8. Sécurité des données" },
    { id: "droits", title: "9. Droits des utilisateurs" },
    { id: "cookies", title: "10. Cookies et technologies similaires" },
    { id: "transferts", title: "11. Transferts de données" },
    { id: "modifications", title: "12. Modifications de la politique" },
    { id: "contact", title: "13. Contact" },
];

/* ------------------------------------------------------------------ */
/*  Hooks                                                               */
/* ------------------------------------------------------------------ */
function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
            setShowTop(window.scrollY > 600);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return { progress, showTop };
}

function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);

    return active;
}

/* ------------------------------------------------------------------ */
/*  Small components                                                    */
/* ------------------------------------------------------------------ */
const Logo = ({ light = false }) => {
    const [failed, setFailed] = useState(false);

    return (
        <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2 rounded-lg"
            aria-label={`${SITE_NAME} – Accueil`}
        >
            {!failed ? (
                <img
                    src={LOGO_SRC}
                    alt=""
                    onError={() => setFailed(true)}
                    className="h-10 w-auto object-contain sm:h-11"
                />
            ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174f4b] text-lg font-bold text-white">
                    S
                </span>
            )}
            <span
                className={`hidden text-[15px] font-semibold leading-tight tracking-tight sm:block ${
                    light ? "text-white" : "text-[#174f4b]"
                }`}
            >
                {SITE_NAME}
            </span>
        </Link>
    );
};

const SiteHeader = ({ progress }) => (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Logo />

            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Navigation principale">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-[#174f4b] hover:text-[#174f4b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] sm:inline-flex"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
                        <path d="M7 14h10v7H7z" />
                    </svg>
                    Imprimer
                </button>
                <Link
                    href="/"
                    className="rounded-lg bg-[#174f4b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#123e3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2"
                >
                    Retour au site
                </Link>
            </nav>
        </div>

        {/* Barre de progression de lecture */}
        <div className="h-[3px] w-full bg-transparent" aria-hidden="true">
            <div
                className="h-full bg-[#bf5429] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    </header>
);

const Section = ({ id, title, children }) => (
    <section
        id={id}
        className="scroll-mt-28 border-b border-gray-200 py-9 last:border-b-0 print:break-inside-avoid"
    >
        <h2 className="mb-5 flex items-start gap-3 text-xl font-semibold tracking-tight text-[#174f4b] sm:text-2xl">
            <span aria-hidden="true" className="mt-1.5 h-6 w-1 shrink-0 rounded-full bg-[#e6a17f]" />
            {title}
        </h2>
        <div className="space-y-4 pl-4 text-[15px] leading-7 text-gray-600">{children}</div>
    </section>
);

const InfoBox = ({ children, className = "" }) => (
    <div className={`rounded-xl border border-[#174f4b]/10 bg-[#f1f5f3] p-5 ${className}`}>
        {children}
    </div>
);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function PrivacyPolicy() {
    const updatedAt = "27 octobre 2026";
    const { progress, showTop } = useScrollProgress();
    const ids = sections.map((s) => s.id);
    const active = useActiveSection(ids);

    return (
        <>
            <Head title="Politique de confidentialité" />

            <div className="min-h-screen bg-[#f7f8f6] text-gray-800">
                <SiteHeader progress={progress} />

                <main>
                    {/* Hero */}
                    <section className="relative overflow-hidden bg-[#174f4b] text-white">
                        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/5" />

                        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90">
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7">
                                    <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                                Confidentialité et protection des données
                            </div>

                            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                                Politique de confidentialité
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                                Découvrez comment vos données personnelles sont
                                collectées, utilisées, conservées et protégées
                                lorsque vous utilisez notre site et nos services.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href="#droits"
                                    className="rounded-lg bg-[#e6a17f] px-5 py-3 text-sm font-semibold text-[#174f4b] transition hover:bg-[#efb396] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    Exercer mes droits
                                </a>
                                <a
                                    href="#contact"
                                    className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    Nous contacter
                                </a>
                            </div>

                            {/* <p className="mt-8 text-sm text-white/70">
                                Dernière mise à jour : {updatedAt}
                            </p> */}
                        </div>
                    </section>

                    {/* Contenu */}
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-12 lg:py-16">
                        {/* Sommaire */}
                        <aside className="h-fit lg:sticky lg:top-24 print:hidden">
                            {/* Mobile : repliable */}
                            <details className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:hidden">
                                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#174f4b]">
                                    Sommaire
                                </summary>
                                <ol className="space-y-1 border-t border-gray-100 px-3 py-3">
                                    {sections.map((s) => (
                                        <li key={s.id}>
                                            <a
                                                href={`#${s.id}`}
                                                className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-[#f1f5f3] hover:text-[#bf5429]"
                                            >
                                                {s.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </details>

                            {/* Desktop */}
                            <div className="hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
                                <h2 className="mb-4 text-base font-semibold text-[#174f4b]">Sommaire</h2>
                                <nav aria-label="Sommaire de la politique">
                                    <ol className="space-y-0.5">
                                        {sections.map((s) => {
                                            const isActive = active === s.id;
                                            return (
                                                <li key={s.id}>
                                                    <a
                                                        href={`#${s.id}`}
                                                        aria-current={isActive ? "true" : undefined}
                                                        className={`block border-l-2 py-1.5 pl-4 text-sm leading-6 transition-colors ${
                                                            isActive
                                                                ? "border-[#bf5429] font-semibold text-[#174f4b]"
                                                                : "border-gray-200 text-gray-500 hover:border-[#e6a17f] hover:text-[#bf5429]"
                                                        }`}
                                                    >
                                                        {s.title}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </nav>
                            </div>
                        </aside>

                        {/* Politique */}
                        <article className="min-w-0 rounded-2xl border border-gray-200 bg-white px-6 py-2 shadow-sm sm:px-10">
                            <div className="border-b border-gray-200 py-9">
                                <p className="text-base leading-7 text-gray-700">
                                    La présente politique décrit les principes
                                    applicables à la protection des données
                                    personnelles dans le cadre de l'utilisation du
                                    site The Social Observatory.
                                </p>
                                <p className="mt-4 text-[15px] leading-7 text-gray-600">
                                    Notre objectif est d'informer les utilisateurs
                                    de manière transparente sur les données
                                    susceptibles d'être traitées, les finalités de
                                    ce traitement et les moyens d'exercer leurs
                                    droits.
                                </p>
                            </div>

                            <Section id="introduction" title="1. Introduction">
                                <p>
                                    The Social Observatory accorde une importance
                                    particulière au respect de la vie privée et à
                                    la protection des informations personnelles.
                                </p>
                                <p>
                                    Cette politique s'applique aux interactions
                                    avec notre site et, le cas échéant, aux
                                    formulaires, espaces utilisateurs et services
                                    qui y sont proposés.
                                </p>
                                <p>
                                    Elle doit être lue conjointement avec les
                                    informations spécifiques présentées au moment
                                    où des données sont collectées.
                                </p>
                            </Section>

                            <Section id="responsable" title="2. Responsable du traitement">
                                <p>
                                    Le responsable du traitement est l'entité qui
                                    détermine les finalités et les moyens du
                                    traitement des données personnelles.
                                </p>
                                <InfoBox className="space-y-1">
                                    <p><strong className="text-[#174f4b]">Organisation :</strong> The Social Observatory</p>
                                    <p><strong className="text-[#174f4b]">Adresse :</strong> Casablanca, Maroc</p>
                                    <p><strong className="text-[#174f4b]">Contact :</strong> contact@the-social-observatory.com</p>
                                </InfoBox>
                                <p>
                                    Ces informations doivent être complétées et
                                    validées par l'organisation avant publication.
                                </p>
                            </Section>

                            <Section id="donnees" title="3. Données collectées">
                                <p>
                                    Selon les fonctionnalités effectivement
                                    utilisées, les catégories suivantes peuvent
                                    être concernées :
                                </p>
                                <ul className="list-disc space-y-2 pl-6 marker:text-[#e6a17f]">
                                    <li>
                                        <strong className="text-gray-800">Données d'identification :</strong>{" "}
                                        nom, prénom et autres informations
                                        d'identification fournies volontairement.
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Données de contact :</strong>{" "}
                                        adresse e-mail, numéro de téléphone et
                                        informations communiquées dans un message.
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Données de compte :</strong>{" "}
                                        identifiant et informations nécessaires
                                        à la gestion d'un compte, si cette
                                        fonctionnalité existe.
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Données techniques :</strong>{" "}
                                        adresse IP, journaux techniques et
                                        informations relatives au navigateur,
                                        lorsqu'elles sont effectivement collectées.
                                    </li>
                                    <li>
                                        <strong className="text-gray-800">Autres informations :</strong>{" "}
                                        informations transmises dans le cadre
                                        d'une demande, d'une enquête ou d'un
                                        service proposé par la plateforme.
                                    </li>
                                </ul>
                                <p>
                                    Nous devons limiter la collecte aux données
                                    pertinentes et nécessaires aux finalités
                                    annoncées. Les catégories ci-dessus ne signifient
                                    pas que toutes ces données sont collectées.
                                </p>
                            </Section>

                            <Section id="finalites" title="4. Finalités du traitement">
                                <p>
                                    Les données personnelles peuvent être traitées,
                                    lorsque cela est nécessaire et applicable, pour :
                                </p>
                                <ul className="list-disc space-y-2 pl-6 marker:text-[#e6a17f]">
                                    <li>Répondre aux demandes et messages reçus.</li>
                                    <li>Fournir et administrer les services demandés.</li>
                                    <li>Gérer les comptes et les accès autorisés.</li>
                                    <li>Assurer la sécurité et le bon fonctionnement du site.</li>
                                    <li>Analyser l'utilisation du site, si des outils de mesure sont utilisés.</li>
                                    <li>Respecter les obligations légales applicables.</li>
                                </ul>
                                <p>
                                    Les finalités exactes doivent correspondre aux
                                    traitements réellement mis en œuvre par
                                    l'organisation.
                                </p>
                            </Section>

                            <Section id="bases" title="5. Bases et conditions du traitement">
                                <p>
                                    Chaque traitement doit disposer d'une
                                    justification appropriée au regard de la
                                    législation applicable. Selon le contexte,
                                    il peut notamment reposer sur le consentement
                                    de la personne, la nécessité de fournir un
                                    service demandé ou le respect d'une obligation
                                    légale.
                                </p>
                                <p>
                                    Lorsque le consentement est requis, il doit
                                    être recueilli dans les conditions prévues par
                                    la législation applicable. Les informations
                                    fournies aux utilisateurs doivent préciser les
                                    conditions pertinentes pour chaque traitement.
                                </p>
                            </Section>

                            <Section id="partage" title="6. Partage des données">
                                <p>
                                    Les données peuvent être accessibles aux seules
                                    personnes habilitées et, lorsque cela est
                                    nécessaire, aux prestataires intervenant pour
                                    l'hébergement, la maintenance ou le
                                    fonctionnement des services.
                                </p>
                                <p>
                                    Toute communication à un tiers doit être
                                    encadrée et respecter les exigences légales
                                    applicables ainsi que les finalités annoncées.
                                </p>
                                <p>
                                    Les destinataires effectifs et les éventuelles
                                    communications particulières doivent être
                                    précisés par l'organisation selon les services
                                    réellement utilisés.
                                </p>
                            </Section>

                            <Section id="conservation" title="7. Durée de conservation">
                                <p>
                                    Les données personnelles sont conservées
                                    pendant une durée adaptée à la finalité pour
                                    laquelle elles ont été collectées et aux
                                    obligations légales applicables.
                                </p>
                                <p>
                                    À l'issue de cette durée, les données sont
                                    supprimées, anonymisées ou archivées lorsque
                                    cela est autorisé et justifié.
                                </p>
                                <p>
                                    Les durées de conservation propres à chaque
                                    catégorie de données doivent être déterminées
                                    et documentées par le responsable du traitement.
                                </p>
                            </Section>

                            <Section id="securite" title="8. Sécurité des données">
                                <p>
                                    L'organisation doit mettre en œuvre des mesures
                                    techniques et organisationnelles adaptées aux
                                    risques afin de protéger les données contre
                                    les accès non autorisés, la perte,
                                    l'altération ou la divulgation.
                                </p>
                                <p>
                                    Ces mesures peuvent inclure la gestion des
                                    permissions, la sécurisation des accès, les
                                    mises à jour techniques et la surveillance
                                    des incidents, selon les besoins du service.
                                </p>
                                <p>
                                    Aucune méthode de transmission ou de stockage
                                    ne peut garantir une sécurité absolue.
                                </p>
                            </Section>

                            <Section id="droits" title="9. Droits des utilisateurs">
                                <p>
                                    Sous réserve des conditions et limites prévues
                                    par la législation applicable, les personnes
                                    concernées peuvent notamment disposer des
                                    droits suivants :
                                </p>
                                <ul className="list-disc space-y-2 pl-6 marker:text-[#e6a17f]">
                                    <li>Être informées de la collecte et de l'utilisation de leurs données.</li>
                                    <li>Demander l'accès aux données les concernant.</li>
                                    <li>Demander la rectification de données inexactes ou incomplètes.</li>
                                    <li>Demander, lorsque les conditions légales sont réunies, la suppression ou l'opposition au traitement.</li>
                                    <li>Retirer leur consentement lorsque le traitement repose sur celui-ci, dans les conditions applicables.</li>
                                </ul>
                                <p>
                                    Pour exercer un droit, veuillez contacter le
                                    responsable du traitement à l'adresse indiquée
                                    dans la rubrique « Contact ». Une vérification
                                    raisonnable de l'identité peut être nécessaire.
                                </p>
                                <p>
                                    Si vous estimez que vos droits ne sont pas
                                    respectés, vous pouvez consulter la Commission
                                    Nationale de contrôle de la Protection des
                                    Données à caractère Personnel (CNDP), sous
                                    réserve de sa compétence.
                                </p>
                                <p>
                                    <a
                                        href="https://www.cndp.ma/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-[#bf5429] underline underline-offset-4 hover:text-[#174f4b]"
                                    >
                                        Consulter le site officiel de la CNDP
                                    </a>
                                </p>
                            </Section>

                            <Section id="cookies" title="10. Cookies et technologies similaires">
                                <p>
                                    Le site peut utiliser des cookies ou des
                                    technologies similaires nécessaires à son
                                    fonctionnement. D'autres cookies peuvent être
                                    utilisés selon les outils effectivement
                                    installés, notamment pour mesurer l'audience
                                    ou mémoriser des préférences.
                                </p>
                                <p>
                                    Les catégories de cookies utilisées, leurs
                                    finalités, leur durée et les moyens de gérer
                                    les préférences doivent être décrits selon
                                    la configuration réelle du site.
                                </p>
                                <p>
                                    Aucun outil d'analyse, de publicité ou de
                                    suivi ne doit être déclaré comme utilisé
                                    sans vérification préalable.
                                </p>
                            </Section>

                            <Section id="transferts" title="11. Transferts de données">
                                <p>
                                    Certains prestataires techniques peuvent
                                    héberger ou traiter des données depuis un
                                    autre pays. Si un transfert international
                                    existe, l'organisation doit en identifier
                                    les destinations et vérifier les conditions
                                    et formalités requises par la législation
                                    applicable.
                                </p>
                                <p>
                                    Les informations publiées à ce sujet doivent
                                    correspondre aux prestataires, aux
                                    infrastructures et aux flux de données réels.
                                </p>
                            </Section>

                            <Section id="modifications" title="12. Modifications de la politique">
                                <p>
                                    Cette politique peut être mise à jour pour
                                    refléter l'évolution des services, des
                                    pratiques de traitement ou des exigences
                                    légales.
                                </p>
                                <p>
                                    La date de dernière mise à jour figure en
                                    haut de cette page. Lorsque cela est requis,
                                    les utilisateurs sont informés des changements
                                    selon les modalités appropriées.
                                </p>
                            </Section>

                            <Section id="contact" title="13. Contact">
                                <p>
                                    Pour toute question concernant cette politique
                                    ou pour exercer vos droits relatifs aux
                                    données personnelles, contactez l'organisation
                                    responsable :
                                </p>
                                <InfoBox>
                                    <p className="font-semibold text-[#174f4b]">The Social Observatory</p>
                                    <p className="mt-2">
                                        E-mail :{" "}
                                        <a
                                            href="mailto:contact@the-social-observatory.com"
                                            className="font-medium text-[#bf5429] underline underline-offset-4 hover:text-[#174f4b]"
                                        >
                                            contact@the-social-observatory.com
                                        </a>
                                    </p>
                                    <p>Adresse postale : Casablanca, Maroc</p>
                                    <p className="mt-3 text-sm text-gray-500">
                                        Veuillez ne pas transmettre de données
                                        personnelles sensibles dans votre message,
                                        sauf si cela est nécessaire et demandé
                                        par un canal approprié.
                                    </p>
                                </InfoBox>
                            </Section>

                            {/* Footer actions */}
                            <div className="flex flex-col gap-4 border-t border-gray-200 py-8 sm:flex-row sm:items-center sm:justify-between print:hidden">
                                <p className="text-sm text-gray-500">
                                    The Social Observatory — Protection des données
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-lg bg-[#174f4b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123e3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2"
                                >
                                    Retour à l'accueil
                                </Link>
                            </div>
                        </article>
                    </div>
                </main>

                {/* Retour en haut */}
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Retour en haut de la page"
                    className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#174f4b] text-white shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf5429] focus-visible:ring-offset-2 print:hidden ${
                        showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="m6 14 6-6 6 6" />
                    </svg>
                </button>
            </div>
        </>
    );
}