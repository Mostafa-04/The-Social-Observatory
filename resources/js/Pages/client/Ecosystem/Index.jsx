import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  Landmark,
  MapPin,
  Network,
  Rocket,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import Nav from '../nav';

const TYPE_META = {
  association: { label: 'Association', icon: Users },
  initiative: { label: 'Initiative', icon: Rocket },
  cooperative_sociale: { label: 'Coopérative sociale', icon: Building2 },
  fondation: { label: 'Fondation', icon: Landmark },
  reseau: { label: 'Réseau', icon: Network },
  autre: { label: 'Autre', icon: Sparkles },
};

const GRADIENTS = [
  'from-[#324949]/15 to-[#1f2d2d]/5',
  'from-[#bf5429]/15 to-[#324949]/5',
  'from-[#1f2d2d]/10 to-[#324949]/10',
];

/**
 * Carte d'une organisation, même langage visuel que InsightCard :
 * image/placeholder avec icône + gradient, badges superposés,
 * puis titre + meta en dessous, animée au scroll.
 */
const AssociationCard = ({ association: a, index }) => {
  const cardRef = useRef(null);

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
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const meta = TYPE_META[a.type] ?? TYPE_META.autre;
  const Icon = meta.icon;
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const categoryName = a.categories?.[0]?.name ?? meta.label;

  return (
    <div
      ref={cardRef}
      className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <Link href={`/ecosystem/${a.slug}`} className="group cursor-pointer h-full block">
        <article className="h-full">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#eaece9] transition-all duration-500 group-hover:shadow-xl">
            {a.logo_path ? (
              <img
                src={`/storage/${a.logo_path}`}
                alt={a.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div className={`absolute inset-0 bg-gradient-to-tr ${gradient}`}></div>
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(191,84,41,0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(191,84,41,0.1) 0%, transparent 50%)
                      `,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#bf5429]/20 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative w-20 h-20 rounded-full border-2 border-[#bf5429]/30 group-hover:border-[#bf5429]/60 flex items-center justify-center group-hover:scale-110 transition-all duration-500 bg-white/10 backdrop-blur-sm">
                      <Icon className="w-8 h-8 text-[#bf5429] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#bf5429] group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </div>
              </>
            )}

            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#1f2d2d] shadow-sm">
                <Icon className="w-3 h-3 text-[#bf5429]" />
                {meta.label}
              </span>
            </div>

            {(a.city || a.country?.name) && (
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/10">
                  <MapPin className="w-3 h-3" />
                  {a.city ? `${a.city}, ` : ''}{a.country?.name}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium tracking-wider uppercase text-[#bf5429]">
                {categoryName}
              </span>
              {a.founding_year && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#bf5429]/30"></span>
                  <span className="text-xs text-[#5f6967]">Depuis {a.founding_year}</span>
                </>
              )}
            </div>

            <h3 className="font-display text-xl text-[#1f2d2d] mb-2 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
              {a.name}
            </h3>

            {a.description && (
              <p className="text-sm text-[#5f6967] leading-relaxed line-clamp-2 group-hover:text-[#1f2d2d] transition-colors duration-300">
                {a.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#bf5429] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
              <span>Voir le profil</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

/**
 * Page /ecosystem — liste filtrable des organisations, même identité
 * visuelle que la page Insights.
 */
export default function EcosystemIndex({ associations, filters, countries, categories }) {
  const [q, setQ] = useState(filters.q ?? '');
  const headerRef = useRef(null);

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
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  function applyFilter(key, value) {
    router.get(
      '/ecosystem',
      { ...filters, [key]: value || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  }

  function submitSearch(e) {
    e.preventDefault();
    applyFilter('q', q);
  }

  return (
    <>
      <Head title="Écosystème social" />
      <Nav />

      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#bf5429]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#324949]/5 via-transparent to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          {/* Header */}
          <div
            ref={headerRef}
            className="max-w-2xl mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] hover:text-[#bf5429] transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&rsquo;accueil
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#bf5429]" />
                Écosystème social
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              Associations, coopératives et{' '}
              <span className="relative">
                <span className="relative z-10 text-[#bf5429]">initiatives</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/10 -z-10"></span>
              </span>{' '}
              recensées
            </h1>
          </div>

          {/* Barre de filtres */}
          <div className="mb-10 rounded-2xl border border-[#d6d9d8]/50 bg-white/60 backdrop-blur-sm p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <form onSubmit={submitSearch} className="md:col-span-2 relative">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5f6967]">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6967]/50" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nom de l'organisation..."
                    className="w-full rounded-full border border-[#d6d9d8] bg-white py-2 pl-9 pr-3 text-sm text-[#1f2d2d] focus:border-[#bf5429] focus:outline-none focus:ring-1 focus:ring-[#bf5429]"
                  />
                </div>
              </form>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5f6967]">
                  Type
                </label>
                <select
                  value={filters.type ?? ''}
                  onChange={(e) => applyFilter('type', e.target.value)}
                  className="w-full rounded-full border border-[#d6d9d8] bg-white px-3 py-2 text-sm text-[#1f2d2d] focus:border-[#bf5429] focus:outline-none"
                >
                  <option value="">Tous les types</option>
                  {Object.entries(TYPE_META).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5f6967]">
                  Pays
                </label>
                <select
                  value={filters.country ?? ''}
                  onChange={(e) => applyFilter('country', e.target.value)}
                  className="w-full rounded-full border border-[#d6d9d8] bg-white px-3 py-2 text-sm text-[#1f2d2d] focus:border-[#bf5429] focus:outline-none"
                >
                  <option value="">Tous les pays</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#d6d9d8]/60 pt-4">
              <button
                onClick={() => applyFilter('category', '')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                  !filters.category
                    ? 'bg-[#bf5429] text-white'
                    : 'bg-[#eaece9]/60 text-[#5f6967] hover:text-[#bf5429]'
                }`}
              >
                Tous les thèmes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => applyFilter('category', cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                    Number(filters.category) === cat.id
                      ? 'bg-[#bf5429] text-white'
                      : 'bg-[#eaece9]/60 text-[#5f6967] hover:text-[#bf5429]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-6 text-sm text-[#5f6967]">
            {associations.total} résultat{associations.total > 1 ? 's' : ''}
          </p>

          {/* Grille */}
          {associations.data.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#5f6967]">Aucune organisation ne correspond à ces critères.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {associations.data.map((a, index) => (
                <AssociationCard key={a.id} association={a} index={index} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {associations.links.length > 3 && (
            <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
              {associations.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || '#'}
                  preserveScroll
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    link.active
                      ? 'bg-[#bf5429] text-white'
                      : 'bg-[#eaece9]/30 text-[#5f6967] hover:text-[#bf5429] border border-[#d6d9d8]/30'
                  } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}