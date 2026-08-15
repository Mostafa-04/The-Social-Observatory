import React, { lazy, Suspense } from 'react';

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

            {/* Sections */}
            <Suspense fallback={null}>
                <About />

                <AfricaProjectsSection
                    projectCountries={africaProjectCountries}
                />

                <AreasOfFocus />

                <FeaturedResearch
                    researches={researches}
                />

                <FeaturedPublications
                    publications={publications}
                />

                <LatestInsights
                    insights={insights}
                />

                <Events
                    events={events}
                />

                <ContactForm
                    settings={settings}
                />

                <Partners
                    partners={partners}
                />

                <CTA />

                <Footer
                    settings={settings}
                />
            </Suspense>
        </div>
    );
}

export default Index;