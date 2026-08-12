import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import Nav from '../nav';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  FileText,
  Download,
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Page de détail d'une recherche.
 * Attendu depuis le contrôleur (Inertia::render):
 * - research: { id, title, summary, content, featured_image, pdf,
 *               author: { name, ... }, category: { name, ... }, published_at }
 */
const ResearchShow = ({ research }) => {
  const contentRef = useRef(null);

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
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  if (!research) return null;

  return (
    <>
      <Head title={research.title} />
      <Nav />
      <article className="relative">
        {/* ===== HERO ===== */}
        <div className="relative">
          {/* Back link, positioned above the hero */}
          <Link
            href={route('research.index')}
            className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all publications
          </Link>

          {/* Hero image */}
          <div className="relative h-[55vh] min-h-[380px] max-h-[600px] w-full overflow-hidden bg-[#1f2d2d]">
            {research.featured_image ? (
              <img
                src={`/storage/${research.featured_image}`}
                alt={research.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2d2d] to-[#bf5429]/60"></div>
            )}
            {/* Dark gradient blending the photo into the panel below */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#1f2d2d]/70 to-[#1f2d2d]"></div>
          </div>

          {/* Dark panel with badge, title, meta — overlaps the bottom of the hero */}
          <div className="relative bg-[#1f2d2d] px-6 lg:px-10 pb-12 -mt-1">
            <div className="max-w-4xl mx-auto">
              {research.category && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#bf5429] rounded-lg text-xs sm:text-sm text-white font-semibold uppercase tracking-wider -translate-y-6 shadow-lg">
                  <Tag className="w-3.5 h-3.5" />
                  {research.category.name}
                </span>
              )}

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight mb-8">
                {research.title}
              </h1>

              {/* Meta pill, echoing the social-icons pill in the reference design */}
              <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-sm text-white/80">
                {research.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#bf5429]" />
                    {research.author.name}
                  </span>
                )}
                {research.published_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#bf5429]" />
                    {formatDate(research.published_at)}
                  </span>
                )}
                {research.pdf && (
                  <a
                    href={`/storage/${research.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-semibold text-white hover:text-[#bf5429] transition-colors duration-300"
                  >
                    <Download className="w-4 h-4 text-[#bf5429]" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="relative py-16 lg:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

          <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">
            {/* Summary */}
            <p className="text-lg text-[#324949] leading-relaxed mb-10 font-medium">
              {research.summary}
            </p>

            {/* Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none opacity-0 translate-y-8 transition-all duration-700 ease-out
                         prose-headings:font-display prose-headings:text-[#1f2d2d]
                         prose-p:text-[#5f6967] prose-p:leading-relaxed
                         prose-a:text-[#bf5429] prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-[#1f2d2d]
                         prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: research.content }}
            />

            {/* PDF banner */}
            {research.pdf && (
              <div className="mt-16 inline-flex items-center gap-6 px-8 py-4 bg-[#eaece9]/30 rounded-full border border-[#d6d9d8]/30">
                <span className="flex items-center gap-2 text-sm text-[#5f6967]">
                  <FileText className="w-4 h-4 text-[#bf5429]" />
                  Full report available as PDF
                </span>
                <div className="w-px h-6 bg-[#d6d9d8]"></div>
                <a
                  href={`/storage/${research.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#bf5429] font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default ResearchShow;