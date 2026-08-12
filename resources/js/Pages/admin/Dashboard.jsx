import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Pages/admin/AdminLayout';
import {
  HiOutlineBookOpen,
  HiOutlineLightBulb,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineEnvelope,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowUpRight,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
} from 'react-icons/hi2';

import { HeartHandshake } from 'lucide-react';

const safeRoute = (name, params) => {
  try {
    return route(name, params);
  } catch (e) {
    return '#';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const initials = (text) => (text ? text.trim().charAt(0).toUpperCase() : '?');

const StatCard = ({ icon: Icon, label, value, sublabel, href, accent = '#bf5429' }) => (
  <Link
    href={href}
    className="group relative bg-white rounded-2xl border border-[#d6d9d8]/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent"
  >
    {/* Top accent bar, couleur propre à chaque module */}
    <div className="h-1 w-full" style={{ backgroundColor: accent }}></div>

    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ backgroundColor: accent }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <HiOutlineArrowUpRight
          className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          style={{ color: accent }}
        />
      </div>

      <p className="font-display text-3xl text-[#1f2d2d] font-medium leading-none">{value}</p>
      <p className="mt-2 text-sm text-[#1f2d2d] font-medium">{label}</p>
      {sublabel && <p className="mt-0.5 text-xs text-[#5f6967]">{sublabel}</p>}
    </div>
  </Link>
);

/**
 * Dashboard admin — attend depuis le contrôleur (Inertia::render):
 * - stats: { research, insights, events, publications, partners, newsletter, contacts }
 * - recentContacts: [{ id, name, email, subject, created_at }]
 * - recentSubscribers: [{ id, email, created_at }]
 */
const Dashboard = ({ stats, recentContacts = [], recentSubscribers = [] }) => {
  const cards = [
    {
      icon: HiOutlineBookOpen,
      label: 'Research',
      value: stats?.research?.total ?? 0,
      sublabel: `${stats?.research?.published ?? 0} published`,
      href: safeRoute('research.index'),
      accent: '#bf5429',
    },
    {
      icon: HiOutlineLightBulb,
      label: 'Insights',
      value: stats?.insights?.total ?? 0,
      sublabel: `${stats?.insights?.published ?? 0} published`,
      href: safeRoute('insights.index'),
      accent: '#bf5429',
    },
    {
      icon: HiOutlineCalendarDays,
      label: 'Events',
      value: stats?.events?.total ?? 0,
      sublabel: `${stats?.events?.upcoming ?? 0} upcoming`,
      href: safeRoute('events.index'),
      accent: '#324949',
    },
    {
      icon: HiOutlineDocumentText,
      label: 'Publications',
      value: stats?.publications?.total ?? 0,
      sublabel: 'Total publications',
      href: safeRoute('publications.index'),
      accent: '#324949',
    },
    {
      icon: HiOutlineUsers,
      label: 'Partners',
      value: stats?.partners?.total ?? 0,
      sublabel: 'Active partners',
      href: safeRoute('partners.index'),
      accent: '#1f2d2d',
    },
    {
      icon: HiOutlineEnvelope,
      label: 'Newsletter',
      value: stats?.newsletter?.total ?? 0,
      sublabel: `+${stats?.newsletter?.this_month ?? 0} this month`,
      href: safeRoute('newsletter.index'),
      accent: '#bf5429',
    },
    {
      icon: HiOutlineChatBubbleLeftRight,
      label: 'Messages',
      value: stats?.contacts?.total ?? 0,
      sublabel: `${stats?.contacts?.unread ?? 0} unread`,
      href: safeRoute('contacts.index'),
      accent: '#1f2d2d',
    },
  ];

  const totalItems =
    (stats?.research?.total ?? 0) +
    (stats?.insights?.total ?? 0) +
    (stats?.events?.total ?? 0) +
    (stats?.publications?.total ?? 0);

  return (
    <AdminLayout>
        {/* ===== Welcome Banner ===== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c2b2b] via-[#2f4a4a] to-[#172222] p-8 lg:p-10 shadow-2xl border border-white/10">

        {/* Background Decorations */}
        <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#bf5429]/20 blur-[120px]" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-400/10 blur-[120px]" />
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.08),transparent_40%)]" />
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between gap-8">

            {/* Left */}
            <div className="max-w-2xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-[#bf5429]/30 bg-[#bf5429]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59f74]">
                <HiOutlineSparkles className="h-4 w-4" />
                Dashboard Overview
            </span>

            <div className="mt-5 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#bf5429] to-[#d96a38] shadow-lg shadow-[#bf5429]/30">
                <HeartHandshake className="h-8 w-8 text-white" />
                </div>

                <div>
                <h1 className="font-display text-4xl font-semibold text-white">
                    Welcome Back
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-7 text-gray-300">
                    Manage your research publications, articles, partners, and engagement
                    from one beautiful dashboard.
                </p>
                </div>

            </div>
            </div>

            {/* Right Stats */}
            <div className="flex items-center">

            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl px-6 py-5 shadow-xl">

                <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#bf5429]/20 text-[#f59f74]">
                    <HiOutlineArrowTrendingUp className="h-7 w-7" />
                </div>

                <div>

                    <p className="text-4xl font-bold text-white">
                    {totalItems}
                    </p>

                    <p className="mt-1 text-sm text-gray-300">
                    Total Content
                    </p>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#bf5429] to-orange-400"
                        style={{ width: "75%" }}
                    />
                    </div>

                </div>

                </div>

            </div>

            </div>

        </div>
        </div>

      {/* ===== Stats grid ===== */}
      <div className="grid grid-cols-2 p-4 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ===== Recent activity ===== */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        {/* Recent contact messages */}
        <div className="bg-white rounded-2xl border border-[#d6d9d8]/40 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#d6d9d8]/40 bg-[#f5f6f4]/50">
            <h2 className="font-display text-base text-[#1f2d2d] font-medium flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#1f2d2d] flex items-center justify-center">
                <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-white" />
              </span>
              Recent messages
            </h2>
            <Link
              href={safeRoute('contacts.index')}
              className="text-xs font-semibold text-[#bf5429] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <p className="px-6 py-10 text-sm text-[#5f6967] text-center">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-[#d6d9d8]/30">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#eaece9] flex items-center justify-center text-[#324949] font-semibold text-sm flex-shrink-0">
                    {initials(contact.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1f2d2d] truncate">{contact.name}</p>
                    <p className="text-xs text-[#5f6967] truncate">{contact.subject || contact.email}</p>
                  </div>
                  <span className="text-xs text-[#5f6967] flex-shrink-0">
                    {formatDate(contact.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent newsletter subscribers */}
        <div className="bg-white rounded-2xl border border-[#d6d9d8]/40 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#d6d9d8]/40 bg-[#f5f6f4]/50">
            <h2 className="font-display text-base text-[#1f2d2d] font-medium flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#bf5429] flex items-center justify-center">
                <HiOutlineArrowTrendingUp className="w-4 h-4 text-white" />
              </span>
              Recent subscribers
            </h2>
            <Link
              href={safeRoute('newsletter.index')}
              className="text-xs font-semibold text-[#bf5429] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentSubscribers.length === 0 ? (
            <p className="px-6 py-10 text-sm text-[#5f6967] text-center">No subscribers yet.</p>
          ) : (
            <ul className="divide-y divide-[#d6d9d8]/30">
              {recentSubscribers.map((sub) => (
                <li key={sub.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#bf5429]/10 flex items-center justify-center text-[#bf5429] font-semibold text-sm flex-shrink-0">
                    {initials(sub.email)}
                  </div>
                  <p className="text-sm font-medium text-[#1f2d2d] truncate flex-1">{sub.email}</p>
                  <span className="text-xs text-[#5f6967] flex-shrink-0">
                    {formatDate(sub.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;