import React, { useEffect, useRef } from 'react';
import {
  Calendar,
  MapPin,
  Video,
  Clock,
  ArrowRight,
  CalendarDays,
  Building2,
  Globe,
  Users,
  Presentation,
  GraduationCap,
  MessagesSquare,
  CalendarX,
} from 'lucide-react';

// أيقونة لكل نوع فعالية حسب enum event_type في قاعدة البيانات
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

// تنسيق حسب حالة الفعالية (status) بدلاً من علم "Featured" الثابت الذي لم يعد موجوداً في قاعدة البيانات
const STATUS_STYLES = {
  upcoming: {
    dot: 'bg-[#bf5429]',
    ring: 'ring-[#bf5429]/20',
    border: 'border-[#bf5429]',
    badge: 'bg-white/80 text-[#5f6967] border border-[#d6d9d8]/30',
    pulse: true,
  },
  ongoing: {
    dot: 'bg-[#bf5429]',
    ring: 'ring-[#bf5429]/30',
    border: 'border-[#bf5429]',
    badge: 'bg-[#bf5429] text-white',
    pulse: true,
  },
  completed: {
    dot: 'bg-white',
    ring: 'ring-[#1f2d2d]/10',
    border: 'border-[#1f2d2d]/20',
    badge: 'bg-[#eaece9] text-[#5f6967]',
    pulse: false,
  },
  cancelled: {
    dot: 'bg-white',
    ring: 'ring-red-200',
    border: 'border-red-300',
    badge: 'bg-red-50 text-red-500 border border-red-200',
    pulse: false,
  },
};

const formatEventDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString)
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase();
};

// يحول "09:00:00" إلى "09:00"
const formatTime = (timeString) => (timeString ? timeString.slice(0, 5) : '');

const Events = ({ events = [] }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const eventsRef = useRef([]);
  const isEmpty = !events || events.length === 0;

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

    eventsRef.current.forEach((event) => {
      if (event) observer.observe(event);
    });

    return () => observer.disconnect();
  }, [events]);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23bf5429%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Floating decorative icons */}
      <div className="absolute top-20 right-20 opacity-10 animate-[float_8s_ease-in-out_infinite]">
        <Calendar className="w-16 h-16 text-[#bf5429]" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 animate-[float_6s_ease-in-out_infinite_delay]">
        <Globe className="w-16 h-16 text-[#bf5429]" />
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
              <CalendarDays className="w-4 h-4 text-[#bf5429]" />
              Events
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
            <span className="relative">
              <span className="relative z-10 text-[#bf5429]">Convenings</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/10 -z-10"></span>
            </span>{' '}
            & briefings
          </h2>
          <p className="mt-5 text-[#5f6967] font-light text-lg leading-relaxed max-w-xl">
            Join us for upcoming events, briefings, and convenings where we share insights and build partnerships for social change.
          </p>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="max-w-2xl mx-auto text-center py-12 px-8 rounded-2xl border border-dashed">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#bf5429]/10 mb-5">
              <CalendarX className="w-7 h-7 text-[#bf5429]" />
            </div>
            <h3 className="font-display text-xl text-[#1f2d2d] mb-2">
              No events scheduled yet
            </h3>
            <p className="text-sm text-[#5f6967] leading-relaxed max-w-md mx-auto lg:mx-0">
              We don't have any upcoming convenings or briefings at the moment. Check back soon, or get in touch if you'd like to partner on one.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#bf5429] hover:gap-3 transition-all duration-300"
            >
              <span>Get in touch</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          /* Timeline */
          <div className="relative max-w-3xl mx-auto lg:mx-0">
            {/* Timeline line with animation */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#bf5429] via-[#bf5429]/50 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-b from-[#bf5429] via-[#bf5429]/30 to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
            </div>

            {events.map((event, index) => {
              const Icon = TYPE_ICONS[event.event_type] ?? Calendar;
              const style = STATUS_STYLES[event.status] ?? STATUS_STYLES.upcoming;
              const isVirtual = event.event_type === 'webinar';
              const locationLabel = isVirtual
                ? 'ONLINE'
                : [event.city, event.country?.name].filter(Boolean).join(', ').toUpperCase();

              return (
                <div
                  key={event.id}
                  ref={(el) => (eventsRef.current[index] = el)}
                  className="group relative pl-12 pb-14 last:pb-0 opacity-0 translate-y-8 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {/* Timeline dot with animation */}
                  <div className="absolute left-0 top-1.5">
                    <div className={`relative w-4 h-4 rounded-full ${style.dot} ring-4 ${style.ring} border-2 ${style.border} transition-all duration-500 group-hover:scale-150 group-hover:ring-[#bf5429]/40`}>
                      {style.pulse && (
                        <div className="absolute inset-0 rounded-full animate-[ping_2s_ease-in-out_infinite] bg-[#bf5429]/20"></div>
                      )}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="relative">
                    {/* Status badge (remplace le badge "Featured" statique) */}
                    {(event.status === 'ongoing' || event.status === 'cancelled') && (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-3 ${style.badge}`}>
                        {event.status === 'ongoing' ? 'Ongoing' : 'Cancelled'}
                      </div>
                    )}

                    {/* Event type badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-[#5f6967] border border-[#d6d9d8]/30 mb-3 capitalize">
                      <Icon className="w-3 h-3 text-[#bf5429]" />
                      {event.event_type}
                    </div>

                    {/* Date and Location */}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#bf5429]" />
                        <span className="font-mono text-xs font-semibold text-[#324949]">
                          {formatEventDate(event.date)}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-[#d6d9d8]"></div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#bf5429]" />
                        <span className="text-xs font-medium text-[#5f6967]">
                          {locationLabel}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl text-[#1f2d2d] mb-2 leading-snug group-hover:text-[#bf5429] transition-colors duration-300">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#5f6967] leading-relaxed max-w-xl">
                      {event.description}
                    </p>

                    {/* Event details */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-[#d6d9d8]/30">
                      {(event.start_time || event.end_time) && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#5f6967]" />
                          <span className="text-xs text-[#5f6967]">
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <>
                          <div className="w-px h-3 bg-[#d6d9d8]"></div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#5f6967]" />
                            <span className="text-xs text-[#5f6967]">{event.location}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Hover action - lien d'inscription réel */}
                    {event.registration_link && event.status !== 'cancelled' && event.status !== 'completed' && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#bf5429] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
                      >
                        <span>Register now</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!isEmpty && (
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
            <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 bg-white rounded-full shadow-xl border border-[#d6d9d8]/30 hover:border-[#bf5429]/30 transition-all duration-300 hover:shadow-2xl group">
              <span className="text-sm text-[#5f6967]">Looking to host a briefing or partner event?</span>
              <div className="w-px h-6 bg-[#d6d9d8]"></div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-[#bf5429] font-semibold transition-all duration-300 group-hover:gap-3"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, 10px) rotate(-5deg); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Events;