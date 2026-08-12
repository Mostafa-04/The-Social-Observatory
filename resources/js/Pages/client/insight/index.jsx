import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  TrendingUp,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  Globe,
  Heart,
  Target,
} from 'lucide-react';
import Nav from '../nav';

const ICONS = [Globe, Heart, Lightbulb, TrendingUp, Target];
const GRADIENTS = [
  'from-[#324949]/15 to-[#1f2d2d]/5',
  'from-[#bf5429]/15 to-[#324949]/5',
  'from-[#1f2d2d]/10 to-[#324949]/10',
];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

const estimateReadTime = (content) => {
  if (!content) return '1 min read';
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const InsightCard = ({ insight, index }) => {
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

  const Icon = ICONS[index % ICONS.length];
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const categoryName = insight.category?.name ?? 'Insight';
  const readTime = estimateReadTime(insight.content);

  return (
    <div
      ref={cardRef}
      className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <Link href={route('insight.show.client', insight.id)} className="group cursor-pointer h-full block">
        <article className="h-full">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#eaece9] transition-all duration-500 group-hover:shadow-xl">
            {insight.featured_image ? (
              <img
                src={`/storage/${insight.featured_image}`}
                alt={insight.title}
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
                <Clock className="w-3 h-3 text-[#bf5429]" />
                {readTime}
              </span>
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#bf5429]/90 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                <Target className="w-3 h-3" />
                {categoryName}
              </span>
            </div>

            {insight.published_at && (
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/10">
                  <Calendar className="w-3 h-3" />
                  {formatDate(insight.published_at)}
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
              <span className="w-1 h-1 rounded-full bg-[#bf5429]/30"></span>
              <span className="text-xs text-[#5f6967]">{readTime}</span>
            </div>

            <h3 className="font-display text-xl text-[#1f2d2d] mb-2 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
              {insight.title}
            </h3>

            <p className="text-sm text-[#5f6967] leading-relaxed group-hover:text-[#1f2d2d] transition-colors duration-300">
              {insight.excerpt}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#bf5429] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

/**
 * Page listant l'ensemble des insights (paginés côté backend).
 * Attendu depuis le contrôleur (Inertia::render):
 * - insights: objet de pagination Laravel { data: [...], links: [...] }
 *   ou simplement un tableau si vous n'utilisez pas de pagination.
 */
const InsightsIndex = ({ insights }) => {
  const headerRef = useRef(null);
  const items = Array.isArray(insights) ? insights : insights?.data ?? [];
  const links = insights?.links ?? insights?.meta?.links ?? null;

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
    
      <Head title="Insights" />
      <Nav />
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#bf5429]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#324949]/5 via-transparent to-transparent rounded-full blur-3xl"></div>

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
                Insights
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              Commentary from our{' '}
              <span className="relative">
                <span className="relative z-10 text-[#bf5429]">research</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/10 -z-10"></span>
              </span>{' '}
              teams
            </h1>
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#5f6967]">No insights published yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </div>
          )}

          {/* Pagination (si insights est un objet paginé Laravel) */}
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

export default InsightsIndex;