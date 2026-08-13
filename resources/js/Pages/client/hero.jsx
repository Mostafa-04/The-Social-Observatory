import React from "react";

const Hero = () => {
    return (
        <section
            id="top"
            className="relative min-h-screen overflow-hidden bg-[#1f2d2d]"
        >
            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="absolute inset-0">
                {/* Static image - fast LCP */}
                <img
                    src="/hero.jpg"
                    alt=""
                    width="1920"
                    height="1080"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-hidden="true"
                />

                {/* Dark overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#1f2d2d]/95 via-[#1f2d2d]/80 to-[#1f2d2d]/55"
                    aria-hidden="true"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1f2d2d]/90 via-transparent to-[#1f2d2d]/20"
                    aria-hidden="true"
                />
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <div className="relative z-10 flex min-h-screen items-center">
                <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">

                    <div className="grid items-center gap-16 lg:grid-cols-12">

                        {/* =================================================
                            LEFT
                        ================================================= */}

                        <div className="lg:col-span-7">

                            {/* Label */}
                            <div className="mb-7 flex items-center gap-3">
                                <span
                                    className="h-px w-8 bg-[#bf5429]"
                                    aria-hidden="true"
                                />

                                <span className="text-sm font-medium uppercase tracking-widest text-[#bf5429]">
                                    Independent Research Institute · Est. 2025
                                </span>
                            </div>

                            {/* H1 */}

                            <h1 className="font-display text-[1.75rem] font-medium leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.6rem] lg:leading-[1.04]">
                                Think.
                                Observe.
                                <br />
                                Anticipate.
                                <span className="text-[#f7b18f]">
                                    Act.
                                </span>
                            </h1>

                            {/* Description */}

                            <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-white/70">
                                The Social Observatory turns emerging social
                                signals into rigorous evidence — helping
                                governments, institutions, and communities
                                anticipate change before it arrives, and act
                                on it with confidence.
                            </p>

                            {/* Buttons */}

                            <div className="mt-11 flex flex-col gap-4 sm:flex-row">

                                <a
                                    href="#research"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#bf5429] px-7 py-3.5 text-[15px] font-semibold text-white"
                                >
                                    Explore Research

                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M5 12h14M13 6l6 6-6 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>

                                <a
                                    href="#contact"
                                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white"
                                >
                                    Partner With Us
                                </a>

                            </div>

                            {/* =================================================
                                STATS
                            ================================================== */}

                            <div className="mt-16 flex flex-wrap items-center gap-10">

                                <div className="text-center sm:text-left">
                                    <div className="font-display text-3xl font-semibold text-white">
                                        20+
                                    </div>

                                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                                        Countries studied
                                    </div>
                                </div>

                                <div
                                    className="hidden h-9 w-px bg-white/10 sm:block"
                                    aria-hidden="true"
                                />

                                <div className="text-center sm:text-left">
                                    <div className="font-display text-3xl font-semibold text-white">
                                        60+
                                    </div>

                                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                                        Publications
                                    </div>
                                </div>

                                <div
                                    className="hidden h-9 w-px bg-white/10 sm:block"
                                    aria-hidden="true"
                                />

                                <div className="text-center sm:text-left">
                                    <div className="font-display text-3xl font-semibold text-white">
                                        30+
                                    </div>

                                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                                        Strategic partners
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* =================================================
                            RIGHT VISUAL
                        ================================================== */}

                        <div className="relative hidden lg:col-span-5 lg:block">

                            <div className="relative mx-auto aspect-square max-w-md">

                                {/* Main image */}

                                <div className="absolute inset-0 overflow-hidden rounded-[2rem]">

                                    <img
                                        src="/logo.png"
                                        alt="Social Observatory network visualization"
                                        width="448"
                                        height="448"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-[#1f2d2d]/30 via-transparent to-[#bf5429]/20"
                                        aria-hidden="true"
                                    />

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SCROLL
            ====================================================== */}

            <a
                href="#about"
                aria-label="Scroll to next section"
                className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
            >
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                    Scroll
                </span>
            </a>
        </section>
    );
};

export default Hero;