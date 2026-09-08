import React, { lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';

import Navbar from './navbar';
import Hero from './hero';
import StatsCards from './StatsCards';

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
import LatestContent from './LatestContent';

function Index({
    settings,
    researches,
    insights,
    events,
    partners,
    publications,
    africaProjectCountries,
    stats,
    latestContent,
    countCountries,
    countProjets,
    countParteners,
    countPublications,
    countResearches,
}) {
    return (
        <div className="bg-[#eaece9]">
            <Head title='Research & Social Anticipation'>
                <meta
                    name="description"
                    content="The Social Observatory turns emerging social signals into rigorous evidence — helping governments, institutions, and communities anticipate change and act with confidence."
                />
                <link rel="canonical" href="https://the-social-observatory.com" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="The Social Observatory" />
                <meta
                    property="og:description"
                    content="Research and social anticipation — think, observe, anticipate, act."
                />
                <meta property="og:image" content="https://the-social-observatory.com/logo.png" />
                <meta property="og:url" content="https://the-social-observatory.com" />
                <meta property="og:site_name" content="The Social Observatory" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="The Social Observatory" />
                <meta
                    name="twitter:description"
                    content="Research and social anticipation — think, observe, anticipate, act."
                />
                <meta name="twitter:image" content="https://the-social-observatory.com/logo.png" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'The Social Observatory',
                        url: 'https://the-social-observatory.com',
                        logo: 'https://the-social-observatory.com/logo.png',
                    })}
                </script>
            </Head>

            {/* Critical content */}
            <Navbar />
            <Hero     countParteners={countParteners} countPublications={countPublications} countCountries={countCountries} countProjets={countProjets} />
            <LatestContent content={latestContent} />

            {/* Sections */}
            <Suspense fallback={null}>
                <About countResearches={countResearches} />
                <AfricaProjectsSection countParteners={countParteners} countProjets={countProjets} countCountries={countCountries}  projectCountries={africaProjectCountries} />
                <AreasOfFocus />
                {/* <StatsCards stats={stats} /> */}
                {/* <FeaturedResearch researches={researches} /> */}
                <FeaturedPublications publications={publications} />
                {/* <LatestInsights insights={insights} /> */}
                <Events events={events} />
                <ContactForm settings={settings} />
                <Partners partners={partners} />
                <CTA />
                <Footer settings={settings} />
            </Suspense>
        </div>
    );
}

export default Index;