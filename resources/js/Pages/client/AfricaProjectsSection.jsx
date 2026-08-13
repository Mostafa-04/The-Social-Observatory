import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';

// react-simple-maps (+d3-geo, d3-array, topojson-client) daba f chunk
// mnfsel (~100kB). Ma ghadich ithml 7ta l Suspense boundary tban
// f viewport — chouf l useEffect taht bach n-triggiw l load.
const AfricaMap = lazy(() => import('./AfricaMap'));

const AfricaProjectsSection = ({
    title = 'Our presence in Africa',
    description = 'We work directly with governments and civil society across the continent, and in each country, we have a concrete impact.',
    projectCountries = [],
}) => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const mapRef = useRef(null);
    const [shouldLoadMap, setShouldLoadMap] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-8');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (titleRef.current) observer.observe(titleRef.current);
        if (mapRef.current) observer.observe(mapRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Triggiw l import dyal l map ghi mnin l wrapper dyalha
        // y9rb mel viewport (rootMargin 200px = ybda ytHml chwiya
        // 9bel ma ywsslo l scroll, bach mayb9ach spinner bayn).
        const mapObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoadMap(true);
                    mapObserver.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (mapRef.current) mapObserver.observe(mapRef.current);

        return () => mapObserver.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background decorations - Style AreasOfFocus */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite_delay]"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Header - Style AreasOfFocus */}
                    <div
                        ref={titleRef}
                        className="lg:col-span-5 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[2px] bg-gradient-to-r from-[#bf5429] to-transparent"></span>
                            <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#bf5429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Our Presence
                            </span>
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
                            {title}
                        </h2>
                        <p className="mt-5 text-[#5f6967] font-light text-lg leading-relaxed">
                            {description}
                        </p>

                        {/* Stats */}
                        <div className="mt-8 flex items-center gap-8">
                            <div>
                                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                                    {projectCountries.length}
                                </div>
                                <div className="text-sm text-[#5f6967] mt-1">Active Countries</div>
                            </div>
                            <div className="w-px h-12 bg-[#d6d9d8]"></div>
                            <div>
                                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                                    15+
                                </div>
                                <div className="text-sm text-[#5f6967] mt-1">Projects in Progress</div>
                            </div>
                            <div className="w-px h-12 bg-[#d6d9d8]"></div>
                            <div>
                                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                                    50+
                                </div>
                                <div className="text-sm text-[#5f6967] mt-1">Partners</div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div
                        ref={mapRef}
                        className="lg:col-span-7 opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
                    >
                        <div className="relative">
                            <div className="relative rounded-2xl p-6 border border-[#d6d9d8]/30 hover:border-[#bf5429]/50 transition-all duration-500 hover:shadow-2xl">
                                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#bf5429] via-[#bf5429] to-transparent w-full rounded-t-2xl"></div>

                                <div className="absolute -top-3 -right-3 bg-[#bf5429] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    {projectCountries.length} Countries
                                </div>

                                {shouldLoadMap ? (
                                    <Suspense
                                        fallback={
                                            <div className="flex h-[500px] items-center justify-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d6d9d8] border-t-[#bf5429]" />
                                            </div>
                                        }
                                    >
                                        <AfricaMap projectCountries={projectCountries} />
                                    </Suspense>
                                ) : (
                                    // Placeholder b nafs l aspect ratio (700x820) bach
                                    // ma ykounch layout shift mnin the map t-load
                                    <div className="aspect-[700/820] w-full" />
                                )}

                                {/* Légende */}
                                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#d6d9d8]/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#bf5429]"></div>
                                        <span className="text-xs text-[#5f6967]">Active Countries</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#1f2d2d]"></div>
                                        <span className="text-xs text-[#5f6967]">Other Countries</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* B7al 3adi (bla "jsx" attribute li khass Next.js/styled-jsx w
               makhdmach f Vite). @keyframes blob khassa tb9a hna 3la
               khatar l classes animate-[blob_...] fo9 kayst5dmoha b
               arbitrary value. */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
            `}</style>
        </section>
    );
};

export default AfricaProjectsSection;