import React, { useEffect, useRef } from 'react';
import {
  Brain,
  FileText,
  Heart,
  Map,
  Lightbulb,
  Users,
  Briefcase,
  Globe,
  Target,
} from 'lucide-react';

const AreasOfFocus = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

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

    // Observer le titre
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    // Observer les cartes
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    // Observer le CTA
    const ctaElement = document.querySelector('#cta-section');
    if (ctaElement) {
      observer.observe(ctaElement);
    }

    return () => observer.disconnect();
  }, []);

  const focusAreas = [
    {
      title: 'Social Intelligence Insights',
      description:
        'Generate qualitative and quantitative evidence to understand emerging social trends, territorial realities, and support evidence-based decision-making.',
      icon: Brain,
    },
    {
      title: 'Social Dialogue',
      description:
        'Facilitate dialogue between institutions, citizens, employers, vulnerable groups, and communities to anticipate social challenges and strengthen social cohesion.',
      icon: Users,
    },
    {
      title: 'Social Advocacy & Campaigns',
      description:
        'Transform research into accessible knowledge that informs public debate, influences policy, and promotes evidence-based social action.',
      icon: Lightbulb,
    },
    {
      title: 'Social Audit & Progress Assessment',
      description:
        'Assess the social impact of public policies, organizations, and development programs through rigorous monitoring and evaluation.',
      icon: Map,
    },
    {
      title: 'Knowledge Production',
      description:
        'Produce flagship research reports, territorial dashboards, foresight studies, policy briefs, and scientific publications.',
      icon: FileText,
    },
    {
      title: 'Capacity Building',
      description:
        'Support governments, NGOs, universities, and communities through training, innovation labs, youth leadership, and gender initiatives.',
      icon: Briefcase,
    },
    {
      title: 'Accelerating Social Progress',
      description:
        'Connect governments, researchers, civil society, and international partners to transform evidence into practical and sustainable action.',
      icon: Heart,
    },
    {
      title: 'Annual Forum for Social Intelligence',
      description:
        'Convene policymakers, researchers, development partners, and civil society each year to exchange knowledge and shape future social policies.',
      icon: Globe,
    },
  ];

  return (
    <section
      id="focus"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite_delay]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={titleRef}
          className="max-w-2xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-gradient-to-r from-[#bf5429] to-transparent"></span>
            <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-[#bf5429]" />
              Areas of Focus
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
           Think Tank &  <span className="relative">
              <span className="relative z-10 text-[#bf5429]">Do Tank</span>
              <span className="absolute bottom-0 left-0 w-full h-2  "></span>
            </span>
          </h2>
          <p className="mt-5 text-[#5f6967] font-light text-lg leading-relaxed max-w-xl">
              The Social Observatory combines research, dialogue, innovation, and action to
              generate evidence, strengthen institutions, and accelerate social progress
              across Africa and the MENA region.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group opacity-0 translate-y-8 transition-all duration-700 ease-out h-full"
                style={{ transitionDelay: `${200 + index * 50}ms` }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-[#d6d9d8]/30 hover:border-[#bf5429]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bf5429]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Top border accent */}
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#bf5429] via-[#bf5429] to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                  
                  {/* Number badge */}
                  <div className="absolute top-4 right-4 text-xs font-mono text-[#d6d9d8] group-hover:text-[#bf5429] transition-colors duration-300 font-bold">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6 flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#bf5429]/10 to-[#bf5429]/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <Icon className="w-6 h-6 text-[#bf5429] group-hover:text-[#bf5429] transition-all duration-300" strokeWidth={1.8} />
                      <div className="absolute inset-0 rounded-2xl bg-[#bf5429]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-display text-base font-semibold text-[#1f2d2d] mb-3 group-hover:text-[#bf5429] transition-colors duration-300 leading-snug line-clamp-2">
                      {area.title}
                    </h3>
                    <p className="text-sm text-[#5f6967] leading-relaxed group-hover:text-[#1f2d2d] transition-colors duration-300 flex-grow line-clamp-4">
                      {area.description}
                    </p>
                  </div>

                  {/* Separator line */}
                  <div className="w-8 h-[2px] bg-gradient-to-r from-[#bf5429] to-transparent my-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div
          id="cta-section"
          className="mt-16 text-center opacity-0 translate-y-8 transition-all duration-700 delay-700 ease-out"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white rounded-full shadow-xl border border-[#d6d9d8]/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <span className="text-sm text-[#5f6967]">Ready to collaborate?</span>
            <div className="w-px h-6 bg-[#d6d9d8]"></div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[#bf5429] font-semibold hover:gap-3 transition-all duration-300 group"
            >
              <span>Get in touch</span>
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
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
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