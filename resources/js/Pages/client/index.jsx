import React from 'react'
import Navbar from './navbar'
import Hero from './hero'
import About from './about'
import AreasOfFocus from './AreasOfFocus'
import FeaturedResearch from './FeaturedResearch'
import ImpactStats from './ImpactStats'
import LatestInsights from './LatestInsights'
import Events from './Events'
import Partners from './Partners'
import CTA from './CTA'
import Footer from './footer'
import ContactForm from './contact'
import FeaturedPublications from './FeaturedPublications'
import AfricaProjectsSection from './AfricaProjectsSection';


function Index({ settings, researches, insights, events, partners, publications,africaProjectCountries }) {

  return (
    <div className="bg-[#eaece9]">
      
      <Navbar />
      <Hero />
      <About />
      <AfricaProjectsSection projectCountries={africaProjectCountries} />
      <AreasOfFocus />
      <FeaturedResearch researches={researches} />
      <FeaturedPublications publications={publications} />
      <LatestInsights insights={insights} />
      <Events events={events} />
      <ContactForm settings={settings} />
      <Partners partners={partners} />
      <CTA />
      <Footer settings={settings} />
    </div>
  )
}

export default Index
