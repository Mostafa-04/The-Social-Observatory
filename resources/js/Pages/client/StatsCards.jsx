import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  BarChart3,
  Users,
  Building2,
  Rocket,
  ArrowRight,
} from 'lucide-react';

const EMPTY_STATS = {
  total: 0,
  by_type: {
    association: 0,
    cooperative_sociale: 0,
    initiative: 0,
    fondation: 0,
    reseau: 0,
    autre: 0,
  },
};

/**
 * Section "écosystème social en chiffres" affichée sur la page d'accueil.
 * Même langage visuel que FeaturedPublications : fond dégradé sombre,
 * pattern de points, glows décoratifs, animations au scroll.
 *
 * Props:
 *   stats: { total, by_type: { association, cooperative_sociale, initiative, ... } }
 */
const StatsCards = ({ stats = EMPTY_STATS }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const safeStats = {
    total: stats?.total ?? 0,
    by_type: { ...EMPTY_STATS.by_type, ...(stats?.by_type ?? {}) },
  };

  const cards = [
    {
      key: 'total',
      label: 'Organisations recensées',
      value: safeStats.total,
      href: '/ecosystem',
      icon: BarChart3,
    },
    {
      key: 'association',
      label: 'Associations',
      value: safeStats.by_type.association,
      href: '/ecosystem?type=association',
      icon: Users,
    },
    {
      key: 'cooperative_sociale',
      label: 'Coopératives sociales',
      value: safeStats.by_type.cooperative_sociale,
      href: '/ecosystem?type=cooperative_sociale',
      icon: Building2,
    },
    {
      key: 'initiative',
      label: 'Initiatives',
      value: safeStats.by_type.initiative,
      href: '/ecosystem?type=initiative',
      icon: Rocket,
    },
  ];

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [stats]);

  return (
    <section
      id="ecosystem-stats"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1f2d2d 0%, #324949 50%, #1f2d2d 100%)',
      }}
    >
      {/* Subtle dot pattern, cohérent avec FeaturedPublications */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #bf5429 1px, transparent 1px),
              radial-gradient(circle at 80% 30%, #bf5429 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, #bf5429 1px, transparent 1px),
              radial-gradient(circle at 60% 20%, #bf5429 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      {/* Background decorative glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#bf5429]/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#bf5429]/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#bf5429] font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Écosystème social
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight">
              Ce que nous <span className="text-[#bf5429]">cartographions</span>
            </h2>
          </div>

          <Link
            href="/ecosystem"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#bf5429] transition-colors duration-300 whitespace-nowrap"
          >
            <span className="relative">
              Explorer l&rsquo;annuaire complet
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#bf5429] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                ref={(el) => (cardsRef.current[index] = el)}
                className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <Link href={card.href} className="block h-full">
                  <article className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-[#bf5429]/30 overflow-hidden flex flex-col h-full p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#bf5429]/15 mb-6">
                      <Icon className="w-6 h-6 text-[#bf5429]" strokeWidth={1.5} />
                    </div>

                    <p className="font-display text-4xl lg:text-5xl text-white font-medium leading-none mb-3">
                      {new Intl.NumberFormat('fr-FR').format(card.value)}
                    </p>

                    <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {card.label}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs text-white/50 group-hover:text-[#bf5429] transition-colors duration-300">
                      Voir la liste
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>

                    {/* Shine sweep, cohérent avec les cartes publications */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCards;