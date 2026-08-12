import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  BookOpen,
  ArrowRight,
  Calendar,
  Globe,
  FileText,
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

/**
 * Section "dernières publications" affichant les 3 dernières publications
 * envoyées depuis le contrôleur (Inertia::render):
 * - publications: [{ id, title, type, description, cover_image, pdf, pages, language, published_at }]
 */
const FeaturedPublications = ({ publications = [] }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [publications]);

  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1f2d2d 0%, #324949 50%, #1f2d2d 100%)',
      }}
    >
      {/* Subtle dot pattern, cohérent avec ImpactStats */}
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
                <BookOpen className="w-4 h-4" />
                Publications
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight">
              Latest <span className="text-[#bf5429]">publications</span>
            </h2>
          </div>
          <Link
            href={route('publication.index.client')}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#bf5429] transition-colors duration-300 whitespace-nowrap"
          >
            <span className="relative">
              View all publications
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#bf5429] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Publications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((publication, index) => (
            <div
              key={publication.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Link href={route('publication.show.client', publication.id)} className="block h-full">
                <article className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-[#bf5429]/30 overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-xl hover:-translate-y-2 sm:flex-row lg:flex-col">
                  {/* Cover */}
                  <div className="relative w-full sm:w-40 lg:w-full aspect-[3/4] sm:aspect-auto sm:h-auto lg:aspect-[4/3] flex-shrink-0 bg-white/5 overflow-hidden">
                    {publication.cover_image ? (
                      <img
                        src={`/storage/${publication.cover_image}`}
                        alt={publication.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2d2d] to-[#bf5429]/40">
                        <BookOpen className="w-10 h-10 text-white/30" strokeWidth={1.5} />
                      </div>
                    )}

                    {publication.type && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#bf5429]/90 backdrop-blur-sm rounded-full text-xs text-white font-medium capitalize">
                          {publication.type}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-lg text-white mb-3 leading-snug group-hover:text-[#bf5429] transition-colors duration-300 line-clamp-2">
                      {publication.title}
                    </h3>

                    <p className="text-sm text-white/60 leading-relaxed line-clamp-3 flex-1 group-hover:text-white/80 transition-colors duration-300">
                      {publication.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
                      {publication.published_at && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#bf5429]" />
                          {formatDate(publication.published_at)}
                        </span>
                      )}
                      {publication.language && (
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#bf5429]" />
                          {publication.language}
                        </span>
                      )}
                      {publication.pages && (
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#bf5429]" />
                          {publication.pages}p
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPublications;