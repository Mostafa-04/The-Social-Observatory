import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';

import Navbar from './navbar';
import Hero from './hero';

const About = lazy(() => import('./about'));
const AfricaProjectsSection = lazy(() => import('./AfricaProjectsSection'));
const AreasOfFocus = lazy(() => import('./AreasOfFocus'));
const FeaturedResearch = lazy(() => import('./FeaturedResearch'));
const FeaturedPublications = lazy(() => import('./FeaturedPublications'));
const LatestInsights = lazy(() => import('./LatestInsights'));
const Events = lazy(() => import('./Events'));
const ContactForm = lazy(() => import('./contact'));
const Partners = lazy(() => import('./Partners'));
const CTA = lazy(() => import('./CTA'));
const Footer = lazy(() => import('./footer'));

/**
 * Load a section only when it gets close to the viewport.
 */
const LazySection = ({ children, minHeight = 300 }) => {
    const ref = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '400px 0px',
                threshold: 0,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                minHeight: shouldLoad ? undefined : minHeight,
            }}
        >
            {shouldLoad && (
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            )}
        </div>
    );
};

function Index({
    settings,
    researches,
    insights,
    events,
    partners,
    publications,
    africaProjectCountries,
}) {
    return (
        <div className="bg-[#eaece9]">
            {/* Critical content */}
            <Navbar />
            <Hero />

            {/* Lazy sections */}
            <LazySection minHeight={400}>
                <About />
            </LazySection>

            <LazySection minHeight={500}>
                <AfricaProjectsSection
                    projectCountries={africaProjectCountries}
                />
            </LazySection>

            <LazySection minHeight={500}>
                <AreasOfFocus />
            </LazySection>

            <LazySection minHeight={500}>
                <FeaturedResearch
                    researches={researches}
                />
            </LazySection>

            <LazySection minHeight={500}>
                <FeaturedPublications
                    publications={publications}
                />
            </LazySection>

            <LazySection minHeight={500}>
                <LatestInsights
                    insights={insights}
                />
            </LazySection>

            <LazySection minHeight={500}>
                <Events
                    events={events}
                />
            </LazySection>

            <LazySection minHeight={500}>
                <ContactForm
                    settings={settings}
                />
            </LazySection>

            <LazySection minHeight={400}>
                <Partners
                    partners={partners}
                />
            </LazySection>

            <LazySection minHeight={300}>
                <CTA />
            </LazySection>

            <LazySection minHeight={300}>
                <Footer
                    settings={settings}
                />
            </LazySection>
        </div>
    );
}

export default Index;