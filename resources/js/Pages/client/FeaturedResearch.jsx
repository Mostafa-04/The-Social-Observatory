import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  Map,
  Briefcase,
  Users,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
} from 'lucide-react';

const ICONS = [Map, Briefcase, Users, TrendingUp, Award, BookOpen];
const GRADIENTS = [
  'from-[#1f2d2d] to-[#bf5429]/80',
  'from-[#bf5429] to-[#1f2d2d]/80',
  'from-[#1f2d2d] via-[#1f2d2d] to-[#bf5429]/80',
];


const formatYear = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

const FeaturedResearch = ({ researches = [] }) => {
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
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [researches]);

  if (!researches || researches.length === 0) {
    return null;
  }

  return (
    <section
      id="research"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23bf5429%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#bf5429]" />
                Featured Research
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              Recent <span className="text-[#bf5429]">flagship</span> studies
            </h2>
          </div>
          <Link
             href= {route('research.index')}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1f2d2d] hover:text-[#bf5429] transition-colors duration-300 whitespace-nowrap"
          >
            <span className="relative">
              View all publications
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#bf5429] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Research Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {researches.map((research, index) => {
            const CategoryIcon = ICONS[index % ICONS.length];
            const gradient = GRADIENTS[index % GRADIENTS.length];
            const categoryName = research.category?.name ?? 'Research';

            return (
              <div
                key={research.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <article className="relative bg-white rounded-2xl border border-[#d6d9d8]/30 hover:border-[#bf5429]/50 overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {/* Image / Gradient Header */}
                  <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {research.featured_image ? (
                      <img
                        src={`/storage/${research.featured_image}`}
                        alt={research.title}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 opacity-30">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 80% 70%, rgba(191,84,41,0.3), transparent 45%)`,
                          }}
                        ></div>
                      </div>
                    )}

                    {/* Floating icon decoration */}
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <CategoryIcon className="w-6 h-6 text-white/80" />
                      </div>
                    </div>

                    {/* Date badge */}
                    {research.published_at && (
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/10">
                          <Calendar className="w-3 h-3" />
                          {formatYear(research.published_at)}
                        </span>
                      </div>
                    )}

                    {/* Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#bf5429]/90 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                        <Award className="w-3 h-3" />
                        Research Report
                      </span>
                    </div>

                    {/* Animated shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-1 relative">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryIcon className="w-4 h-4 text-[#bf5429]" />
                      <span className="text-xs font-medium tracking-wider uppercase text-[#bf5429]">
                        {categoryName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl text-[#1f2d2d] mb-3 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
                      {research.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-[#5f6967] leading-relaxed flex-1">
                      {research.summary}
                    </p>

                    {/* Read More Link */}
                    <div className="mt-6 pt-4 border-t border-[#d6d9d8]/30 flex items-center justify-between">
                      <Link
                        href={route('research.show.client', research.id)}
                        className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#1f2d2d] hover:text-[#bf5429] transition-colors duration-300"
                      >
                        <span className="relative">
                          Read More
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#bf5429] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>

                      {/* PDF indicator if available, otherwise the original "Trending" indicator */}
                      {research.pdf ? (
                        <a
                          href={`/storage/${research.pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#5f6967] hover:text-[#bf5429] transition-colors duration-300"
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </a>
                      ) : (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-[#5f6967] group-hover:text-[#bf5429] transition-colors duration-300" />
                          <span className="text-xs text-[#5f6967] group-hover:text-[#bf5429] transition-colors duration-300">
                            Trending
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 text-center opacity-0 translate-y-8 transition-all duration-700 delay-700 ease-out"
          ref={(el) => {
            if (el) {
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
              observer.observe(el);
            }
          }}
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-[#eaece9]/30 rounded-full border border-[#d6d9d8]/30 hover:border-[#bf5429]/30 transition-all duration-300 hover:shadow-lg group">
            <span className="text-sm text-[#5f6967]">Explore our full research portfolio</span>
            <div className="w-px h-6 bg-[#d6d9d8]"></div>
            <Link
              href={route('research.index')}
              className="inline-flex items-center gap-2 text-[#bf5429] font-semibold transition-all duration-300 group-hover:gap-3"
            >
              <span>View all publications</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;