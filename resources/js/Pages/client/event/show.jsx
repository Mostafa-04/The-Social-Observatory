import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ExternalLink,
  Building2,
  Video,
  Users,
  Presentation,
  GraduationCap,
  MessagesSquare,
} from 'lucide-react';

const TYPE_ICONS = {
  conference: Building2,
  workshop: Presentation,
  seminar: GraduationCap,
  webinar: Video,
  forum: Users,
  roundtable: MessagesSquare,
  training: GraduationCap,
  meeting: Users,
};

const STATUS_LABELS = {
  upcoming: { label: 'Upcoming', color: '#bf5429' },
  ongoing: { label: 'Ongoing', color: '#bf5429' },
  completed: { label: 'Completed', color: '#5f6967' },
  cancelled: { label: 'Cancelled', color: '#dc2626' },
};

const formatEventDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeString) => (timeString ? timeString.slice(0, 5) : '');

/**
 * Page de détail d'un événement.
 * Attendu depuis le contrôleur (Inertia::render):
 * - event: { id, title, description, event_type, city, location,
 *            country: { name } | null, date, start_time, end_time,
 *            registration_link, image, status }
 */
const EventShow = ({ event }) => {
  if (!event) return null;

  const Icon = TYPE_ICONS[event.event_type] ?? Calendar;
  const status = STATUS_LABELS[event.status] ?? STATUS_LABELS.upcoming;
  const isVirtual = event.event_type === 'webinar';
  const locationLabel = isVirtual
    ? 'Online'
    : [event.city, event.country?.name].filter(Boolean).join(', ');

  const canRegister =
    event.registration_link && event.status !== 'cancelled' && event.status !== 'completed';

  return (
    <>
      <Head title={event.title} />

      <article className="relative">
        {/* ===== HERO ===== */}
        <div className="relative">
          <Link
            href="/#events"
            className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>

          <div className="relative h-[45vh] min-h-[320px] max-h-[500px] w-full overflow-hidden bg-[#1f2d2d]">
            {event.image ? (
              <img
                src={`/storage/${event.image}`}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2d2d] to-[#bf5429]/60"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#1f2d2d]/70 to-[#1f2d2d]"></div>
          </div>

          <div className="relative bg-[#1f2d2d] px-6 lg:px-10 pb-12 -mt-1">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 -translate-y-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#bf5429] rounded-lg text-xs sm:text-sm text-white font-semibold uppercase tracking-wider shadow-lg capitalize">
                  <Icon className="w-3.5 h-3.5" />
                  {event.event_type}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm text-white font-semibold uppercase tracking-wider shadow-lg"
                  style={{ backgroundColor: status.color }}
                >
                  {status.label}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight mb-8">
                {event.title}
              </h1>

              {/* Meta pill */}
              <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-sm text-white/80">
                {event.date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#bf5429]" />
                    {formatEventDate(event.date)}
                  </span>
                )}
                {(event.start_time || event.end_time) && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#bf5429]" />
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </span>
                )}
                {locationLabel && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#bf5429]" />
                    {locationLabel}
                  </span>
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
            <div className="grid md:grid-cols-3 gap-10">
              {/* Description */}
              <div className="md:col-span-2">
                <h2 className="font-display text-xl text-[#1f2d2d] font-medium mb-4">
                  About this event
                </h2>
                <p className="text-[#5f6967] leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {event.location && (
                  <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-[#eaece9]/40 border border-[#d6d9d8]/30">
                    <MapPin className="w-4 h-4 text-[#bf5429] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1f2d2d]">Venue</p>
                      <p className="text-sm text-[#5f6967] mt-0.5">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar / registration card */}
              <div>
                <div className="sticky top-24 rounded-2xl border border-[#d6d9d8]/40 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#bf5429] mb-4">
                    Event details
                  </p>

                  <dl className="space-y-4 text-sm">
                    {event.date && (
                      <div>
                        <dt className="text-[#5f6967] text-xs mb-1">Date</dt>
                        <dd className="text-[#1f2d2d] font-medium">{formatEventDate(event.date)}</dd>
                      </div>
                    )}
                    {(event.start_time || event.end_time) && (
                      <div>
                        <dt className="text-[#5f6967] text-xs mb-1">Time</dt>
                        <dd className="text-[#1f2d2d] font-medium">
                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </dd>
                      </div>
                    )}
                    {locationLabel && (
                      <div>
                        <dt className="text-[#5f6967] text-xs mb-1">Location</dt>
                        <dd className="text-[#1f2d2d] font-medium">{locationLabel}</dd>
                      </div>
                    )}
                  </dl>

                  {canRegister ? (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1f2d2d] hover:bg-[#bf5429] text-white font-semibold py-3.5 transition-colors duration-300"
                    >
                      Register now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : event.status === 'completed' ? (
                    <p className="mt-6 text-center text-sm text-[#5f6967] py-3">
                      This event has ended.
                    </p>
                  ) : event.status === 'cancelled' ? (
                    <p className="mt-6 text-center text-sm text-red-500 py-3">
                      This event has been cancelled.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default EventShow;