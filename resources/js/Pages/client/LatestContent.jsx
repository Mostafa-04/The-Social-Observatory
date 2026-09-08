import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    BookOpen,
    CalendarDays,
    FileText,
    Lightbulb,
    Sparkles,
    X,
} from 'lucide-react';

function LatestContentPopup({ content }) {
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasLoadedPreview, setHasLoadedPreview] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const hoverTimerRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Show / Hide cycle
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!content) {
            return;
        }

        let hideTimer;

        const initialTimer = setTimeout(() => {
            setVisible(true);

            hideTimer = setTimeout(() => {
                setVisible(false);
            }, 5000);
        }, 1000);

        const showTimer = setInterval(() => {
            setVisible(true);

            hideTimer = setTimeout(() => {
                setVisible(false);
            }, 5000);
        }, 20000);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(hideTimer);
            clearInterval(showTimer);
        };
    }, [content]);

    // Déclenche le chargement de l'iframe seulement après un petit délai
    // au survol, pour éviter de charger inutilement si l'utilisateur ne
    // fait que passer rapidement au-dessus de la carte.
    const handleMouseEnter = () => {
        setIsHovered(true);
        hoverTimerRef.current = setTimeout(() => {
            setHasLoadedPreview(true);
        }, 250);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        clearTimeout(hoverTimerRef.current);
    };

    if (!content) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Icon / Label / Message
    |--------------------------------------------------------------------------
    */

    const getIcon = () => {
        switch (content.type) {
            case 'research':
                return <BookOpen className="w-5 h-5" strokeWidth={1.5} />;
            case 'insight':
                return <Lightbulb className="w-5 h-5" strokeWidth={1.5} />;
            case 'publication':
                return <FileText className="w-5 h-5" strokeWidth={1.5} />;
            case 'event':
                return <CalendarDays className="w-5 h-5" strokeWidth={1.5} />;
            default:
                return <Bell className="w-5 h-5" strokeWidth={1.5} />;
        }
    };

    const getLabel = () => {
        switch (content.type) {
            case 'research':
                return 'Nouvelle recherche';
            case 'insight':
                return 'Nouvel insight';
            case 'publication':
                return 'Nouvelle publication';
            case 'event':
                return 'Nouvel événement';
            default:
                return 'Nouveau contenu';
        }
    };

    const getMessage = () => {
        switch (content.type) {
            case 'research':
                return 'Une nouvelle recherche vient d’être publiée.';
            case 'insight':
                return 'Un nouvel insight vient d’être publié.';
            case 'publication':
                return 'Une nouvelle publication est maintenant disponible.';
            case 'event':
                return 'Un nouvel événement vient d’être annoncé.';
            default:
                return 'Un nouveau contenu vient d’être publié.';
        }
    };

    const getPreviewPath = () => {
        try {
            const url = new URL(content.url, window.location.origin);
            return url.pathname;
        } catch {
            return content.url;
        }
    };

    return (
        <div
            className={`
                fixed
                right-5
                bottom-5
                z-[9999]
                w-[calc(100%-2.5rem)]
                max-w-[320px]

                transition-all
                duration-700
                ease-out

                ${
                    visible
                        ? 'translate-y-0 translate-x-0 opacity-100'
                        : 'translate-y-8 translate-x-4 opacity-0 pointer-events-none'
                }
            `}
        >
            {/* ----------------------------------------------------------- */}
            {/* Aperçu live de la page (iframe) — flotte au-dessus de la carte */}
            {/* ----------------------------------------------------------- */}
            {hasLoadedPreview && (
                <div
                    className={`
                        absolute
                        bottom-full
                        right-0
                        mb-3
                        w-[340px]
                        h-[220px]

                        origin-bottom-right

                        transition-all
                        duration-300
                        ease-out

                        ${
                            isHovered
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                        }
                    `}
                >
                    <div
                        className="
                            relative
                            h-full
                            w-full
                            overflow-hidden
                            rounded-xl

                            border
                            border-[#d6d9d8]

                            bg-white

                            shadow-[0_20px_50px_rgba(31,45,45,0.25)]
                        "
                    >
                        {/* Barre de titre façon navigateur */}
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                border-b
                                border-[#d6d9d8]
                                bg-[#eaece9]
                                px-3
                                py-2
                            "
                        >
                            <span className="w-2 h-2 rounded-full bg-[#d6d9d8]" />
                            <span className="w-2 h-2 rounded-full bg-[#d6d9d8]" />
                            <span className="w-2 h-2 rounded-full bg-[#d6d9d8]" />
                            <span className="ml-2 truncate text-[10px] font-light text-[#5f6967]">
                                {getPreviewPath()}
                            </span>
                        </div>

                        {/* Spinner de chargement */}
                        {!iframeLoaded && (
                            <div className="absolute inset-0 top-8 flex items-center justify-center bg-white">
                                <div
                                    className="
                                        h-6
                                        w-6
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-[#d6d9d8]
                                        border-t-[#bf5429]
                                    "
                                />
                            </div>
                        )}

                        {/* Iframe mis à l'échelle pour montrer la page complète */}
                        <div
                            className="absolute inset-0 top-8 overflow-hidden"
                            style={{ pointerEvents: 'none' }}
                        >
                            <iframe
                                src={content.url}
                                title={content.title}
                                onLoad={() => setIframeLoaded(true)}
                                loading="lazy"
                                style={{
                                    width: '1280px',
                                    height: '840px',
                                    border: 'none',
                                    transform: 'scale(0.266)',
                                    transformOrigin: 'top left',
                                }}
                            />
                        </div>
                    </div>

                    {/* Petite pointe façon bulle, pointant vers la carte */}
                    <div
                        className="
                            absolute
                            -bottom-1.5
                            right-8
                            h-3
                            w-3
                            rotate-45
                            border-b
                            border-r
                            border-[#d6d9d8]
                            bg-white
                        "
                    />
                </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* Carte principale */}
            {/* ----------------------------------------------------------- */}
            <Link
                href={content.url}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="
                    group
                    relative
                    block
                    overflow-hidden
                    rounded-2xl

                    border-2
                    border-transparent

                    bg-[#eaece9]

                    shadow-[0_20px_50px_rgba(31,45,45,0.18)]

                    transition-all
                    duration-300

                    hover:border-[#bf5429]
                    hover:shadow-[0_25px_60px_rgba(31,45,45,0.22)]
                    hover:-translate-y-1
                "
            >
                <div
                    className="
                        absolute
                        -top-16
                        -right-16
                        w-32
                        h-32
                        rounded-full
                        bg-[#bf5429]/10
                        blur-3xl
                        pointer-events-none
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-16
                        -left-16
                        w-32
                        h-32
                        rounded-full
                        bg-[#324949]/10
                        blur-3xl
                        pointer-events-none
                    "
                />

                <div className="absolute top-3 right-12 opacity-10 pointer-events-none">
                    <Sparkles className="w-8 h-8 text-[#bf5429]" strokeWidth={1} />
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-[#bf5429] to-transparent" />

                <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div
                                    className="
                                        absolute
                                        -inset-2
                                        rounded-full
                                        bg-[#bf5429]/20
                                        blur-xl
                                        opacity-0
                                        transition-opacity
                                        duration-300
                                        group-hover:opacity-100
                                    "
                                />
                                <div
                                    className="
                                        relative
                                        flex
                                        w-10
                                        h-10
                                        items-center
                                        justify-center
                                        rounded-full

                                        bg-[#bf5429]/10
                                        text-[#bf5429]

                                        transition-all
                                        duration-300

                                        group-hover:bg-[#bf5429]
                                        group-hover:text-white
                                        group-hover:scale-110
                                        group-hover:rotate-6
                                    "
                                >
                                    {getIcon()}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="
                                            text-[11px]
                                            font-medium
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#324949]
                                        "
                                    >
                                        {getLabel()}
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            bg-[#bf5429]
                                            px-1.5
                                            py-0.5

                                            text-[8px]
                                            font-bold
                                            tracking-wider
                                            text-white
                                        "
                                    >
                                        NEW
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setVisible(false);
                            }}
                            className="
                                relative
                                z-10
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full

                                text-[#5f6967]

                                transition-all
                                duration-300

                                hover:bg-white
                                hover:text-[#bf5429]
                                hover:rotate-90
                            "
                            aria-label="Fermer"
                        >
                            <X className="w-3.5 h-3.5" strokeWidth={1.8} />
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3
                            className="
                                line-clamp-2
                                font-display
                                text-base
                                leading-snug
                                font-medium
                                text-[#1f2d2d]

                                transition-colors
                                duration-300

                                group-hover:text-[#bf5429]
                            "
                        >
                            {content.title}
                        </h3>

                        <div
                            className="
                                mt-2.5
                                h-[2px]
                                w-10
                                bg-gradient-to-r
                                from-[#bf5429]
                                to-transparent
                            "
                        />

                        <p
                            className="
                                mt-2.5
                                text-[13px]
                                leading-relaxed
                                font-light
                                text-[#5f6967]
                            "
                        >
                            {getMessage()}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <span
                            className="
                                text-[9px]
                                uppercase
                                tracking-widest
                                text-[#5f6967]
                            "
                        >
                            The Social Observatory
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5

                                text-[13px]
                                font-medium
                                text-[#1f2d2d]

                                transition-colors
                                duration-300

                                group-hover:text-[#bf5429]
                            "
                        >
                            Découvrir
                            <ArrowRight
                                className="
                                    w-3.5
                                    h-3.5

                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                                strokeWidth={1.8}
                            />
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default LatestContentPopup;