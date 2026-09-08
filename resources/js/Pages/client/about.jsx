import React, { useEffect, useRef } from 'react';
import {
  Shield,
  BarChart3,
  Globe,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const About = ({ countResearches }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const observerRef = useRef(null);

  useEffect(() => {
    // Create the observer first...
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // ...then observe every target from a single place, after the
    // observer exists. Refs are guaranteed to be attached by the time
    // this effect runs (effects fire after commit), so nothing here
    // depends on render-order timing the way inline callback refs did.
    const targets = [sectionRef.current, titleRef.current, contentRef.current, ...cardsRef.current].filter(Boolean);

    targets.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

const values = [
{
title: 'Social Progress',
description:
'Our work serves one end: measurable social progress, dignity, cohesion, and shared opportunity for all.                        ',
icon: TrendingUp,
},
{
title: 'Evidence-Based',
description:
'We generate robust evidence through qualitative and quantitative research, grounded in reliable data and diverse perspectives.',
icon: BarChart3,
},
{
title: 'Human-Centered',
description:
'We place people’s lived experiences, needs, and aspirations at the center of policy design, programs, and social innovation.',
icon: Users,
},
];


  return (
    <section id="about" ref={sectionRef} className="relative py-14 lg:py-16 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#bf5429]/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#324949]/5 blur-3xl" />


      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <div
              ref={titleRef}
              className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-[#bf5429]" />
                <span className="text-sm tracking-widest uppercase text-[#324949] font-medium">
                  About Us
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] leading-tight font-medium">
                A research institute built for a world that changes faster than policy can follow.
              </h2>
              <div className="mt-8 w-20 h-1 bg-gradient-to-r from-[#bf5429] to-transparent" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div
              ref={contentRef}
              className="opacity-0 translate-y-8 transition-all duration-700 delay-100 ease-out"
            >
              <div className="relative">
                <div className="absolute -left-4 -top-4 text-[#bf5429]/10">
                  <span className="text-7xl font-serif">"</span>
                </div>
                  <p className="text-justify text-lg text-[#5f6967] leading-relaxed font-light relative z-10">
                    The Social Observatory is a non-partisan association conceived as a Think & Do Tank,
                    headquartered in Casablanca, Morocco, and working across the African continent.
                    We are dedicated to understanding social transformation and turning knowledge into action,
                    with a focus on measurable social progress, dignity, cohesion, and shared opportunity.
                  </p>

                  <p className="text-justify mt-6 text-lg text-[#5f6967] leading-relaxed font-light">
                    We combine robust qualitative and quantitative research, social dialogue, social advocacy,
                    and social audit and social progress assessment to generate evidence, anticipate emerging
                    trends, and support evidence-based, citizen-centered action. Our work brings together
                    social intelligence, foresight, and a territorial approach to better understand people's
                    lived experiences, needs, aspirations, and the realities of communities across Africa.
                  </p>

              </div>

              <div className="mt-12 grid sm:grid-cols-3 gap-6 border-t border-[#d6d9d8] pt-12">
                {values.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      ref={(el) => (cardsRef.current[index] = el)}
                      className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                      style={{ transitionDelay: `${150 + index * 100}ms` }}
                    >
                      <div className="relative p-6 rounded-2xl bg-[#eaece9]/30 hover:bg-[#eaece9]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:border-[#bf5429] border-2 border-transparent">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-[#bf5429]/10 flex items-center justify-center mb-4 group-hover:bg-[#bf5429] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <Icon className="w-7 h-7 text-[#bf5429] group-hover:text-white transition-all duration-300" strokeWidth={1.5} />
                          </div>
                          <div className="absolute -inset-1 rounded-full bg-[#bf5429]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <h3 className="font-display text-xl text-[#1f2d2d] mb-2 group-hover:text-[#bf5429] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#5f6967] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;