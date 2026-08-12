import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Clock,
  Calendar,
  BookOpen,
  Globe,
  Sparkles,
  Heart,
  Target,
} from 'lucide-react';

// أيقونات وتدرجات يتم التناوب عليها حسب ترتيب العنصر
// لأن جدول insights لا يحتوي على عمود خاص بالأيقونة أو التدرج
const ICONS = [Globe, Heart, Lightbulb, TrendingUp, Sparkles, Target];
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

// تقدير مدة القراءة من طول المحتوى (لا يوجد عمود لها في قاعدة البيانات)
const estimateReadTime = (content) => {
  if (!content) return '1 min read';
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const LatestInsights = ({ insights = [] }) => {
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
  }, [insights]);

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="relative py-14 lg:py-16 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#bf5429]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#324949]/5 via-transparent to-transparent rounded-full blur-3xl"></div>

      {/* Floating decorative icons */}
      <div className="absolute top-20 right-20 opacity-10 animate-[float_8s_ease-in-out_infinite]">
        <Sparkles className="w-16 h-16 text-[#bf5429]" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 animate-[float_6s_ease-in-out_infinite_delay]">
        <TrendingUp className="w-16 h-16 text-[#bf5429]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-2xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-[#bf5429]"></span>
            <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#bf5429]" />
              Latest Insights
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
            Commentary from our{' '}
            <span className="relative">
              <span className="relative z-10 text-[#bf5429]">research</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/10 -z-10"></span>
            </span>{' '}
            teams
          </h2>
        </div>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {insights.map((insight, index) => {
            const Icon = ICONS[index % ICONS.length];
            const gradient = GRADIENTS[index % GRADIENTS.length];
            const categoryName = insight.category?.name ?? 'Insight';
            const readTime = estimateReadTime(insight.content);

            return (
              <div
                key={insight.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <Link
                  href={route('insight.show.client', insight.id)}
                  className="group cursor-pointer h-full block"
                >
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
                          {/* Gradient overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-tr ${gradient}`}></div>

                          {/* Animated background pattern */}
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

                          {/* Icon container */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              {/* Glow ring */}
                              <div className="absolute inset-0 rounded-full bg-[#bf5429]/20 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700"></div>

                              {/* Main circle */}
                              <div className="relative w-20 h-20 rounded-full border-2 border-[#bf5429]/30 group-hover:border-[#bf5429]/60 flex items-center justify-center group-hover:scale-110 transition-all duration-500 bg-white/10 backdrop-blur-sm">
                                <Icon className="w-8 h-8 text-[#bf5429] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                              </div>

                              {/* Dot indicator */}
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#bf5429] group-hover:scale-150 transition-transform duration-300"></div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Category badge (read time) */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#1f2d2d] shadow-sm">
                          <Clock className="w-3 h-3 text-[#bf5429]" />
                          {readTime}
                        </span>
                      </div>

                      {/* Tag */}
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#bf5429]/90 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                          <Target className="w-3 h-3" />
                          {categoryName}
                        </span>
                      </div>

                      {/* Date */}
                      {insight.published_at && (
                        <div className="absolute bottom-4 right-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/10">
                            <Calendar className="w-3 h-3" />
                            {formatDate(insight.published_at)}
                          </span>
                        </div>
                      )}

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium tracking-wider uppercase text-[#bf5429]">
                          {categoryName}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#bf5429]/30"></span>
                        <span className="text-xs text-[#5f6967]">{readTime}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl text-[#1f2d2d] mb-2 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
                        {insight.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[#5f6967] leading-relaxed group-hover:text-[#1f2d2d] transition-colors duration-300">
                        {insight.excerpt}
                      </p>

                      {/* Read More */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#bf5429] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
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
            <span className="text-sm text-[#5f6967]">Stay updated with our latest research</span>
            <div className="w-px h-6 bg-[#d6d9d8]"></div>
            <Link
              href={route('insight.index')}
              className="inline-flex items-center gap-2 text-[#bf5429] font-semibold transition-all duration-300 group-hover:gap-3"
            >
              <span>Insights</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, 10px) rotate(-5deg); }
        }
      `}</style>
    </section>
  );
};

export default LatestInsights;