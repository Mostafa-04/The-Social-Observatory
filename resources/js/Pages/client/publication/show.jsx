import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  FileText,
  Download,
} from 'lucide-react';
import Nav from '../nav';
import DownloadRequestModal from '../../../Components/DownloadRequestModal';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Page de détail d'une publication.
 * Attendu depuis le contrôleur (Inertia::render):
 * - publication: { id, title, type, description, cover_image, pdf,
 *                  pages, language, published_at, slug? }
 */
const PublicationShow = ({ publication }) => {
    const [showDownloadModal, setShowDownloadModal] = useState(false);

  if (!publication) return null;

  return (
    <>
      <Head title={publication.title}>
        <meta
          name="description"
          content={publication.description?.slice(0, 160) ?? 'Publication from The Social Observatory.'}
        />
        <link
          rel="canonical"
          href={`https://the-social-observatory.com/publications/${publication.slug ?? publication.id}`}
        />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={publication.title} />
        <meta
          property="og:description"
          content={publication.description?.slice(0, 160) ?? ''}
        />
        {publication.cover_image && (
          <meta
            property="og:image"
            content={`https://the-social-observatory.com/storage/${publication.cover_image}`}
          />
        )}
        <meta
          property="og:url"
          content={`https://the-social-observatory.com/publications/${ publication.id}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={publication.title} />
        <meta name="twitter:description" content={publication.description?.slice(0, 160) ?? ''} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: publication.title,
            description: publication.description,
            image: publication.cover_image
              ? `https://the-social-observatory.com/storage/${publication.cover_image}`
              : undefined,
            inLanguage: publication.language,
            numberOfPages: publication.pages,
            datePublished: publication.published_at,
          })}
        </script>
      </Head>
        <Nav />
      <article className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <Link
            href={route('publication.index.client')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] hover:text-[#bf5429] transition-colors duration-300 mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all publications
          </Link>

          <div className="grid md:grid-cols-5 gap-10 lg:gap-14">
            {/* Cover */}
            <div className="md:col-span-2">
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-[#eaece9]">
                  {publication.cover_image ? (
                    <img
                      src={`/storage/${publication.cover_image}`}
                      alt={publication.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1f2d2d] to-[#bf5429]/60">
                      <BookOpen className="w-16 h-16 text-white/40" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

              {publication.pdf && (
                <button
                  type="button"
                  onClick={() => setShowDownloadModal(true)}
                  className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1f2d2d] hover:bg-[#bf5429] text-white font-semibold py-3.5 transition-colors duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
                      </div>
            </div>

            {/* Details */}
            <div className="md:col-span-3">
              {publication.type && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#bf5429]/10 rounded-full text-xs text-[#bf5429] font-medium uppercase tracking-wider mb-6 capitalize">
                  {publication.type}
                </span>
              )}

              <h1 className="font-display text-3xl sm:text-4xl text-[#1f2d2d] font-medium leading-tight mb-6">
                {publication.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#5f6967] border-t border-b border-[#d6d9d8]/30 py-4 mb-8">
                {publication.published_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#bf5429]" />
                    {formatDate(publication.published_at)}
                  </span>
                )}
                {publication.language && (
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#bf5429]" />
                    {publication.language}
                  </span>
                )}
                {publication.pages && (
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#bf5429]" />
                    {publication.pages} pages
                  </span>
                )}
              </div>

              <p className="text-[#5f6967] leading-relaxed whitespace-pre-line">
                {publication.description}
              </p>
            </div>
          </div>
        </div>
              <DownloadRequestModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                publicationId={publication.id}
              />
      </article>
    </>
  );
};

export default PublicationShow;