import React, { useEffect, useRef } from 'react';
import {
  Users,
  VenusAndMars,
  HeartPulse,
  Globe2,
  Landmark,
  Cpu,
  Leaf,
  Map,
  Target,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const AreasOfFocus = () => {
  const titleRef = useRef(null);
  const pillarsRef = useRef([]);
  const forcesRef = useRef([]);
  const ctaRef = useRef(null);

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
      {
        threshold: 0.1,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    pillarsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    forcesRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

      // ✅ Ajouter le CTA
      if (ctaRef.current) {
        observer.observe(ctaRef.current);
      }

    return () => observer.disconnect();
  }, []);

  /*
   * THE FIVE THEMATIC PILLARS
   */
  const pillars = [
    {
      number: '1.',
      title: 'Human Capital & Work',
      icon: Users,
      items: [
        'Youth & Skills',
        'NEETs & Neo-NEETs',
        'Employability',
        'Entrepreneurship',
        'Informal Economy',
      ],
    },
    {
      number: '2.',
      title: 'Gender, Inclusion & Diverse Abilities',
      icon: VenusAndMars,
      items: [
        'Women’s Empowerment',
        'Disability Inclusion',
        'Vulnerable Workers',
        'Invisible Workers',
        'Intergenerational Justice',
      ],
    },
    {
      number: '3.',
      title: 'Health, Social Protection & Demographic Transitions',
      icon: HeartPulse,
      items: [
        'Public Health',
        'Social Protection Systems',
        'Population Dynamics',
        'Aging & Fertility',
        'Well-being',
      ],
    },
    {
      number: '4.',
      title: 'Mobility, Migration & Diaspora',
      icon: Globe2,
      items: [
        'Intra-African Migration',
        'Diaspora & Talent',
        'Urbanization',
        'Climate-Driven Mobility',
      ],
    },
    {
      number: '5.',
      title: 'Governance, Democracy & the Social Contract',
      icon: Landmark,
      items: [
        'Institutional Trust & Quality',
        'Democratic Participation & Accountability',
        'State–Citizen Social Dialogue',
        'Civic Engagement & Youth Volunteering',
      ],
    },
  ];

  /*
   * THE THREE CROSS-CUTTING FORCES
   */
  const crossCuttingForces = [
    {
      title: 'Technology & Artificial Intelligence',
      description:
        'reshaping work, public services, information, and digital inclusion across every theme.',
      icon: Cpu,
    },
    {
      title: 'Climate & Sustainability',
      description:
        'a structural driver of migration, food security, green jobs, and environmental health.',
      icon: Leaf,
    },
    {
      title: 'A Territorial Approach',
      description:
        'the same issue never reads the same from one territory to another. Place is our systematic lens.',
      icon: Map,
    },
  ];

  return (
    <section
      id="focus"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#bf5429]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#174f4b]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div
          ref={titleRef}
          className="max-w-3xl mr-auto mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out text-left"
        >
          <div className="flex items-center justify-start gap-3 mb-6">
            <span className="w-12 h-[2px] bg-[#bf5429]" />

            <span className="text-sm tracking-widest uppercase text-[#174f4b] font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-[#bf5429]" />
              Our Thematic Focus
            </span>

            <span className="w-12 h-[2px] bg-[#bf5429]" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#174f4b] font-medium leading-tight">
            What we study —
            <span className="text-[#bf5429]"> and how we read it</span>
          </h2>

          <p className="mt-6 text-[#5f6967] font-light text-lg leading-relaxed max-w-2xl mr-auto">
            Our work is organized around one constant, five thematic pillars,
            and three cross-cutting forces. This architecture keeps our
            attention on the issues that will shape the continent through 2050.
          </p>
        </div>

        {/* =========================================================
            THE CONSTANT
        ========================================================= */}
        <div className="mb-12">
          <div className="max-w-xl mx-auto">
            <div className="bg-[#174f4b] rounded-2xl px-8 py-7 text-center shadow-xl relative overflow-hidden">
              
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -right-20 w-48 h-48 border border-white rounded-full" />
                <div className="absolute -bottom-24 -left-20 w-56 h-56 border border-white rounded-full" />
              </div>

              <div className="relative">
                <span className="block text-xs tracking-[0.25em] uppercase text-[#d8b76a] mb-2">
                  The Constant
                </span>

                <h3 className="font-display text-2xl sm:text-3xl text-white font-medium">
                  Social Progress
                </h3>

                <p className="mt-3 text-white/75 text-sm leading-relaxed">
                  Dignity, cohesion, and shared opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FIVE THEMATIC PILLARS
        ========================================================= */}
        <div className="mb-20">

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-[#d6d9d8]" />

            <h3 className="font-display text-xl sm:text-2xl text-[#174f4b] font-medium text-center">
              The Five Thematic Pillars
            </h3>

            <div className="h-px flex-1 bg-[#d6d9d8]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">

            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.number}
                  ref={(el) => (pillarsRef.current[index] = el)}
                  className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="
                      relative
                      h-full
                      min-h-[470px]
                      rounded-2xl
                      bg-[#174f4b]
                      text-white
                      p-6
                      overflow-hidden
                      shadow-lg
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:shadow-2xl
                    "
                  >

                    {/* Decorative pattern */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.07]">
                      <div className="absolute inset-0 rounded-full border-[18px] border-[#d8b76a]" />
                      <div className="absolute inset-5 rounded-full border-[10px] border-[#d8b76a]" />
                    </div>

                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8b76a]" />

                    {/* Icon */}
                    <div className="relative flex justify-center mb-5">
                      <div
                        className="
                          w-16
                          h-16
                          rounded-full
                          border
                          border-white/30
                          flex
                          items-center
                          justify-center
                          bg-white/5
                          group-hover:bg-white/10
                          group-hover:scale-110
                          transition-all
                          duration-500
                        "
                      >
                        <Icon
                          className="w-8 h-8 text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Number */}
                    <div className="text-center mb-3">
                      <span className="font-display text-2xl text-[#d8b76a] font-medium">
                        {pillar.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="relative text-center font-display text-lg font-semibold leading-tight min-h-[70px] flex items-center justify-center">
                      {pillar.title}
                    </h4>

                    {/* Gold separator */}
                    <div className="w-10 h-[2px] bg-[#d8b76a] mx-auto my-5" />

                    {/* Items */}
                    <ul className="relative space-y-3">
                      {pillar.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-white/80 leading-snug"
                        >
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#d8b76a] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* =========================================================
            THREE CROSS-CUTTING FORCES
        ========================================================= */}
        <div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-[#d6d9d8]" />

            <h3 className="font-display text-xl sm:text-2xl text-[#174f4b] font-medium text-center">
              The Three Cross-Cutting Forces
            </h3>

            <div className="h-px flex-1 bg-[#d6d9d8]" />
          </div>

          <p className="text-center text-[#5f6967] text-sm mb-8">
            How we read every pillar
          </p>

          <div className="space-y-5">

            {crossCuttingForces.map((force, index) => {
              const Icon = force.icon;

              return (
                <div
                  key={force.title}
                  ref={(el) => (forcesRef.current[index] = el)}
                  className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}
                >
                  <div
                    className="
                      relative
                      bg-white
                      rounded-2xl
                      border
                      border-[#d6d9d8]
                      px-6
                      sm:px-10
                      py-7
                      shadow-sm
                      hover:shadow-xl
                      hover:-translate-y-1
                      transition-all
                      duration-500
                      overflow-hidden
                    "
                  >

                    {/* Left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#bf5429] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />

                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">

                      {/* Icon */}
                      <div
                        className="
                          flex-shrink-0
                          w-14
                          h-14
                          rounded-xl
                          bg-[#174f4b]/5
                          flex
                          items-center
                          justify-center
                          group-hover:bg-[#bf5429]/10
                          transition-colors
                          duration-300
                        "
                      >
                        <Icon
                          className="w-7 h-7 text-[#174f4b] group-hover:text-[#bf5429] transition-colors duration-300"
                          strokeWidth={1.7}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h4 className="font-display text-lg sm:text-xl text-[#174f4b] font-semibold mb-2">
                          {force.title}
                        </h4>

                        <p className="text-sm sm:text-base text-[#5f6967] leading-relaxed">
                          {force.description}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* =========================================================
            GENDER LENS
        ========================================================= */}
<div
  id="cta-section"
  ref={ctaRef}
  className="mt-16 text-center opacity-0 translate-y-8 transition-all duration-700 delay-700 ease-out"
>
  <div className="inline-flex items-center gap-6 px-8 py-4 bg-white rounded-full shadow-xl border border-[#d6d9d8]/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
    
    <span className="text-sm text-[#5f6967]">
      Ready to collaborate?
    </span>

    <div className="w-px h-6 bg-[#d6d9d8]" />

    <Link
      href={route("groups.join.create")}
      className="inline-flex items-center gap-2 text-[#bf5429] font-semibold hover:gap-3 transition-all duration-300 group"
    >
      <span>Rejoindre un Groupe</span>

      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </Link>

  </div>
</div>
      </div>
            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animate-blob-delay {
          animation: blob 7s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default AreasOfFocus;