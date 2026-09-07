import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  Landmark,
  Mail,
  MapPin,
  Network,
  Phone,
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react';
import Nav from '../nav';

const TYPE_META = {
  association: { label: 'Association', icon: Users },
  initiative: { label: 'Initiative', icon: Rocket },
  cooperative_sociale: { label: 'Social Cooperative', icon: Building2 },
  fondation: { label: 'Foundation', icon: Landmark },
  reseau: { label: 'Network', icon: Network },
  autre: { label: 'Other', icon: Sparkles },
};

/**
 * client/Ecosystem/Show — single organization profile.
 * Same visual identity as the Insights page (light background,
 * terracotta accent, scroll-in animations).
 * Props: association (with country + categories loaded)
 */
export default function EcosystemShow({ association: a }) {
  const heroRef = useRef(null);
  const bodyRef = useRef(null);

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
    if (heroRef.current) observer.observe(heroRef.current);
    if (bodyRef.current) observer.observe(bodyRef.current);
    return () => observer.disconnect();
  }, []);

  const meta = TYPE_META[a.type] ?? TYPE_META.autre;
  const Icon = meta.icon;
  const social = a.social_links ?? {};
  const hasContact = a.website || a.email || a.phone || Object.values(social).some(Boolean);

  return (
    <>
      <Head title={a.name} />
      <Nav />

      <section className="relative py-24 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#bf5429]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#324949]/5 via-transparent to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          {/* Hero */}
          <div
            ref={heroRef}
            className="max-w-2xl mb-14 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6967] hover:text-[#bf5429] transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to directory
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#bf5429]"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#bf5429]" />
                {meta.label}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              {a.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5f6967]">
              {(a.city || a.country?.name) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#bf5429]" />
                  {a.city ? `${a.city}, ` : ''}{a.country?.name}
                </span>
              )}
              {a.founding_year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#bf5429]" />
                  Since {a.founding_year}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0 translate-y-8 transition-all duration-700 ease-out delay-150"
          >
            {/* Main column */}
            <div className="md:col-span-2 space-y-8">
              {a.description && (
                <div>
                  <h2 className="font-display text-xl text-[#1f2d2d] mb-3">
                    About
                  </h2>
                  <p className="text-justify text-[#5f6967] leading-relaxed">
                    {a.description}
                  </p>
                </div>
              )}

              {a.categories?.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium tracking-wider uppercase text-[#bf5429] mb-3">
                    Focus areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {a.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-full bg-[#eaece9] px-3 py-1 text-sm text-[#1f2d2d]"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#d6d9d8]/50 bg-[#eaece9]/40 p-5">
                <h3 className="text-xs font-medium tracking-wider uppercase text-[#bf5429] mb-4">
                  Details
                </h3>
                <dl className="space-y-3 text-sm">
                  {a.beneficiaries_count && (
                    <div>
                      <dt className="text-[#5f6967]">Estimated beneficiaries</dt>
                      <dd className="font-medium text-[#1f2d2d]">
                        {new Intl.NumberFormat('en-US').format(a.beneficiaries_count)}
                      </dd>
                    </div>
                  )}
                  {a.address && (
                    <div>
                      <dt className="text-[#5f6967]">Address</dt>
                      <dd className="font-medium text-[#1f2d2d]">{a.address}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {hasContact && (
                <div className="rounded-2xl border border-[#d6d9d8]/50 bg-[#eaece9]/40 p-5">
                  <h3 className="text-xs font-medium tracking-wider uppercase text-[#bf5429] mb-4">
                    Contact
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {a.website && (
                      <li className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-[#bf5429]" />
                        <a
                          href={a.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1f2d2d] hover:text-[#bf5429] transition-colors truncate"
                        >
                          {a.website}
                        </a>
                      </li>
                    )}
                    {a.email && (
                      <li className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#bf5429]" />
                        <a
                          href={`mailto:${a.email}`}
                          className="text-[#1f2d2d] hover:text-[#bf5429] transition-colors truncate"
                        >
                          {a.email}
                        </a>
                      </li>
                    )}
                    {a.phone && (
                      <li className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-[#bf5429]" />
                        <span className="text-[#1f2d2d]">{a.phone}</span>
                      </li>
                    )}
                    {Object.entries(social).map(
                      ([platform, url]) =>
                        url && (
                          <li key={platform}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="capitalize text-[#5f6967] hover:text-[#bf5429] transition-colors"
                            >
                              {platform}
                            </a>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}