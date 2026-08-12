import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Globe,
  Download,
} from 'lucide-react';
import Nav from '../nav';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

const PublicationCard = ({ publication, index }) => {
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

  return (
    <div
      ref={cardRef}
      className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <Link
        href={route('publication.show.client', publication.id)}
        className="block h-full"
      >
        <article className="h-full bg-white rounded-2xl border border-[#d6d9d8]/30 hover:border-[#bf5429]/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
          {/* Cover */}
          <div className="relative aspect-[3/4] bg-[#eaece9] overflow-hidden">
            {publication.cover_image ? (
              <img
                src={`/storage/${publication.cover_image}`}
                alt={publication.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2d2d] to-[#bf5429]/60">
                <BookOpen className="w-12 h-12 text-white/40" strokeWidth={1.5} />
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
            <h3 className="font-display text-lg text-[#1f2d2d] mb-3 leading-snug group-hover:text-[#bf5429] transition-colors duration-300 line-clamp-2">
              {publication.title}
            </h3>

            <p className="text-sm text-[#5f6967] leading-relaxed line-clamp-3 flex-1">
              {publication.description}
            </p>

            <div className="mt-5 pt-4 border-t border-[#d6d9d8]/30 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5f6967]">
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
                  {publication.pages} pages
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

/**
 * Page listant l'ensemble des publications (paginées côté backend).
 * Attendu depuis le contrôleur (Inertia::render):
 * - publications: objet de pagination Laravel { data: [...], links: [...] }
 */
const PublicationsIndex = ({ publications }) => {
  const headerRef = useRef(null);
  const items = Array.isArray(publications) ? publications : publications?.data ?? [];
  const links = publications?.links ?? publications?.meta?.links ?? null;

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

  return (
    <>
    <Nav />
      <Head title="Publications" />

      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          {/* Header */}
          <div
            ref={headerRef}
            className="max-w-2xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] hover:text-[#bf5429] transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#bf5429]" />
                Publications
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              Reports & <span className="text-[#bf5429]">publications</span>
            </h1>
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#5f6967]">No publications available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((publication, index) => (
                <PublicationCard key={publication.id} publication={publication} index={index} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {links && links.length > 3 && (
            <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
              {links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || '#'}
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
};

export default PublicationsIndex;