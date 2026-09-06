
import React, { useEffect, useState } from 'react';
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

        // Première apparition après 1 seconde
        const initialTimer = setTimeout(() => {
            setVisible(true);

            hideTimer = setTimeout(() => {
                setVisible(false);
            }, 5000);
        }, 1000);

        // Réapparition toutes les 20 secondes
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

    if (!content) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Icon
    |--------------------------------------------------------------------------
    */

    const getIcon = () => {
        switch (content.type) {
            case 'research':
                return <BookOpen className="w-6 h-6" strokeWidth={1.5} />;

            case 'insight':
                return <Lightbulb className="w-6 h-6" strokeWidth={1.5} />;

            case 'publication':
                return <FileText className="w-6 h-6" strokeWidth={1.5} />;

            case 'event':
                return <CalendarDays className="w-6 h-6" strokeWidth={1.5} />;

            default:
                return <Bell className="w-6 h-6" strokeWidth={1.5} />;
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Label
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Message
    |--------------------------------------------------------------------------
    */

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

    return (
        <div
            className={`
                fixed
                right-5
                bottom-5
                z-[9999]
                w-[calc(100%-2.5rem)]
                max-w-[390px]

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
            <div
                className="
                    group
                    relative
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
                "
            >

                {/* ------------------------------------------------------- */}
                {/* Decorative background */}
                {/* ------------------------------------------------------- */}

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        w-40
                        h-40
                        rounded-full
                        bg-[#bf5429]/10
                        blur-3xl
                        pointer-events-none
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-20
                        -left-20
                        w-40
                        h-40
                        rounded-full
                        bg-[#324949]/10
                        blur-3xl
                        pointer-events-none
                    "
                />

                {/* Small decorative sparkle */}
                <div
                    className="
                        absolute
                        top-4
                        right-14
                        opacity-10
                        pointer-events-none
                    "
                >
                    <Sparkles
                        className="w-10 h-10 text-[#bf5429]"
                        strokeWidth={1}
                    />
                </div>

                {/* ------------------------------------------------------- */}
                {/* Top accent */}
                {/* ------------------------------------------------------- */}

                <div className="h-1 w-full bg-gradient-to-r from-[#bf5429] to-transparent" />

                {/* ------------------------------------------------------- */}
                {/* Content */}
                {/* ------------------------------------------------------- */}

                <div className="relative p-5">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3">

                            {/* Icon */}
                            <div className="relative">

                                {/* Glow */}
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
                                        w-12
                                        h-12
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

                            {/* Label */}
                            <div>

                                <div className="flex items-center gap-2">

                                    <span
                                        className="
                                            text-xs
                                            font-medium
                                            uppercase
                                            tracking-[0.15em]
                                            text-[#324949]
                                        "
                                    >
                                        {getLabel()}
                                    </span>

                                    <span
                                        className="
                                            rounded-full
                                            bg-[#bf5429]
                                            px-2
                                            py-0.5

                                            text-[9px]
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

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setVisible(false)}
                            className="
                                flex
                                h-8
                                w-8
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
                            <X
                                className="w-4 h-4"
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* Title */}
                    {/* --------------------------------------------------- */}

                    <div className="mt-5">

                        <h3
                            className="
                                line-clamp-2
                                font-display
                                text-xl
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

                        {/* Small separator */}
                        <div
                            className="
                                mt-3
                                h-[2px]
                                w-12
                                bg-gradient-to-r
                                from-[#bf5429]
                                to-transparent
                            "
                        />

                        <p
                            className="
                                mt-3
                                text-sm
                                leading-relaxed
                                font-light
                                text-[#5f6967]
                            "
                        >
                            {getMessage()}
                        </p>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* Footer / CTA */}
                    {/* --------------------------------------------------- */}

                    <div className="mt-5 flex items-center justify-between">

                        <span
                            className="
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-[#5f6967]
                            "
                        >
                            The Social Observatory
                        </span>

                        <Link
                            href={content.url}
                            className="
                                group/link
                                inline-flex
                                items-center
                                gap-2

                                text-sm
                                font-medium
                                text-[#1f2d2d]

                                transition-colors
                                duration-300

                                hover:text-[#bf5429]
                            "
                        >
                            Découvrir

                            <ArrowRight
                                className="
                                    w-4
                                    h-4

                                    transition-transform
                                    duration-300

                                    group-hover/link:translate-x-1
                                "
                                strokeWidth={1.8}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LatestContentPopup;

