import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const estimateReadTime = (content) => {
  if (!content) return '1 min read';
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

/**
 * Page de détail d'un insight.
 * Attendu depuis le contrôleur (Inertia::render):
 * - insight: { id, title, excerpt, content, featured_image,
 *              author: { name, ... } | null, category: { name, ... } | null, published_at, slug? }
 */
const InsightShow = ({ insight }) => {
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

  if (!insight) return null;

  return (
    <>
      <Head title={insight.title}>
        <meta
          name="description"
          content={insight.excerpt?.slice(0, 160) ?? 'Insight from The Social Observatory.'}
        />
        <link
          rel="canonical"
          href={`https://the-social-observatory.com/insights/${ insight.id}`}
        />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={insight.title} />
        <meta
          property="og:description"
          content={insight.excerpt?.slice(0, 160) ?? ''}
        />
        {insight.featured_image && (
          <meta
            property="og:image"
            content={`https://the-social-observatory.com/storage/${insight.featured_image}`}
          />
        )}
        <meta
          property="og:url"
          content={`https://the-social-observatory.com/insights/${insight.slug ?? insight.id}`}
        />
        {insight.published_at && (
          <meta property="article:published_time" content={insight.published_at} />
        )}
        {insight.author?.name && (
          <meta property="article:author" content={insight.author.name} />
        )}
        {insight.category?.name && (
          <meta property="article:section" content={insight.category.name} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={insight.title} />
        <meta name="twitter:description" content={insight.excerpt?.slice(0, 160) ?? ''} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: insight.title,
            description: insight.excerpt,
            image: insight.featured_image
              ? `https://the-social-observatory.com/storage/${insight.featured_image}`
              : undefined,
            author: insight.author ? { '@type': 'Person', name: insight.author.name } : undefined,
            articleSection: insight.category?.name,
            datePublished: insight.published_at,
          })}
        </script>
      </Head>

      <article className="relative">
        {/* ===== HERO ===== */}
        <div className="relative">
          {/* Back link, positioned above the hero */}
          <Link
            href={route('insight.index')}
            className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all insights
          </Link>

          {/* Hero image */}
          <div className="relative h-[55vh] min-h-[380px] max-h-[600px] w-full overflow-hidden bg-[#1f2d2d]">
            {insight.featured_image ? (
              <img
                src={`/storage/${insight.featured_image}`}
                alt={insight.title}
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
              {insight.category && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#bf5429] rounded-lg text-xs sm:text-sm text-white font-semibold uppercase tracking-wider -translate-y-6 shadow-lg">
                  <Tag className="w-3.5 h-3.5" />
                  {insight.category.name}
                </span>
              )}

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight mb-8">
                {insight.title}
              </h1>

              {/* Meta pill */}
              <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-sm text-white/80">
                {insight.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#bf5429]" />
                    {insight.author.name}
                  </span>
                )}
                {insight.published_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#bf5429]" />
                    {formatDate(insight.published_at)}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#bf5429]" />
                  {estimateReadTime(insight.content)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="relative py-16 lg:py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

          <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">
            {/* Excerpt */}
            {insight.excerpt && (
              <p className="text-lg text-[#324949] leading-relaxed mb-10 font-medium">
                {insight.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              ref={contentRef}
              className="prose prose-lg max-w-none opacity-0 translate-y-8 transition-all duration-700 ease-out
                         prose-headings:font-display prose-headings:text-[#1f2d2d]
                         prose-p:text-[#5f6967] prose-p:leading-relaxed
                         prose-a:text-[#bf5429] prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-[#1f2d2d]
                         prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: insight.content }}
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default InsightShow;