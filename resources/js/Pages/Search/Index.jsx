import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Search,
  BookOpen,
  Lightbulb,
  FileText,
  CalendarDays,
  ArrowRight,
  SearchX,
} from 'lucide-react';

const TYPE_META = {
  research: { icon: BookOpen, label: 'Research', color: '#bf5429' },
  insight: { icon: Lightbulb, label: 'Insight', color: '#324949' },
  publication: { icon: FileText, label: 'Publication', color: '#1f2d2d' },
  event: { icon: CalendarDays, label: 'Event', color: '#bf5429' },
};

const stripHtml = (text) => (text ? text.replace(/<[^>]*>/g, ' ').trim() : '');

/**
 * Page de résultats de recherche globale.
 * Attendu depuis le contrôleur (Inertia::render):
 * - query: string (le terme recherché)
 * - results: [{ id, type, title, excerpt, url }]
 */
const SearchResults = ({ query, results = [] }) => {
  const hasResults = results.length > 0;

  return (
    <>
      <Head title={query ? `Search: ${query}` : 'Search'} />

      <section className="relative py-24 lg:py-32 overflow-hidden min-h-[70vh]">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#bf5429]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-[#324949]/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <Search className="w-4 h-4 text-[#bf5429]" />
                Search
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1f2d2d] font-medium leading-tight">
              {hasResults ? (
                <>
                  {results.length} result{results.length > 1 ? 's' : ''} for{' '}
                  <span className="text-[#bf5429]">"{query}"</span>
                </>
              ) : query ? (
                <>
                  No results for <span className="text-[#bf5429]">"{query}"</span>
                </>
              ) : (
                'Search The Social Observatory'
              )}
            </h1>
          </div>

          {/* Results */}
          {hasResults ? (
            <div className="space-y-4">
              {results.map((result) => {
                const meta = TYPE_META[result.type] ?? TYPE_META.research;
                const Icon = meta.icon;

                return (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="group flex items-start gap-4 bg-white rounded-2xl border border-[#d6d9d8]/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-[#bf5429]/40 hover:-translate-y-0.5"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <h3 className="font-display text-lg text-[#1f2d2d] mt-1 mb-1 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
                        {result.title}
                      </h3>
                      {result.excerpt && (
                        <p className="text-sm text-[#5f6967] line-clamp-2">
                          {stripHtml(result.excerpt)}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#5f6967]/40 flex-shrink-0 mt-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                );
              })}
            </div>
          ) : query ? (
            /* No results state */
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#eaece9] flex items-center justify-center mx-auto mb-6">
                <SearchX className="w-7 h-7 text-[#5f6967]" strokeWidth={1.5} />
              </div>
              <p className="text-[#1f2d2d] font-medium mb-2">No results found</p>
              <p className="text-sm text-[#5f6967] max-w-sm mx-auto">
                We couldn't find anything matching "{query}". Try a different keyword or check
                the spelling.
              </p>
            </div>
          ) : (
            /* Empty state (no query yet) */
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#eaece9] flex items-center justify-center mx-auto mb-6">
                <Search className="w-7 h-7 text-[#5f6967]" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-[#5f6967]">
                Search across research, insights, publications, and events.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResults;