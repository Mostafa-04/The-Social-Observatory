import React, { useEffect, useRef } from 'react';
import { Users, Sparkles, TrendingUp } from 'lucide-react';


const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const Partners = ({ partners = [] }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

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

    return () => observer.disconnect();
  }, [partners]);

  if (!partners || partners.length === 0) {
    return null;
  }

 
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 border-y border-[#d6d9d8]/30 bg-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#bf5429]/5 via-transparent to-[#bf5429]/5"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 opacity-5 animate-[float_8s_ease-in-out_infinite]">
        <Sparkles className="w-12 h-12 text-[#bf5429]" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5 animate-[float_6s_ease-in-out_infinite_delay]">
        <TrendingUp className="w-12 h-12 text-[#bf5429]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-[#bf5429]"></span>
            <span className="text-sm tracking-widest uppercase text-[#5f6967] font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-[#bf5429]" />
              Trusted by institutions across the globe
            </span>
            <span className="w-12 h-[1px] bg-[#bf5429]"></span>
          </div>
        </div>
      </div>

      {/* Marquee / Scrolling Partners */}
      <div className="relative overflow-hidden">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Marquee Track - scrolling from right to left */}
        <div className="flex gap-16 px-8 animate-marquee">
          {duplicatedPartners.map((partner, index) => {
            const CardTag = partner.website ? 'a' : 'div';
            const cardProps = partner.website
              ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <CardTag
                key={`${partner.id}-${index}`}
                {...cardProps}
                className="group flex items-center gap-4 flex-shrink-0 transition-all duration-300 hover:scale-110"
              >
                {/* Logo container */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[#eaece9]/50 flex items-center justify-center overflow-hidden group-hover:bg-[#bf5429] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {partner.logo ? (
                      <img
                        src={`/storage/${partner.logo}`}
                        alt={`${partner.name} logo`}
                        className="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
                        onError={(e) => {
                          // إذا فشل تحميل الصورة، إظهار الأحرف الأولى من الاسم بدلاً منها
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (!parent.querySelector('.partner-fallback')) {
                            const fallback = document.createElement('span');
                            fallback.className =
                              'partner-fallback text-sm font-bold text-[#5f6967] group-hover:text-white transition-all duration-300';
                            fallback.textContent = getInitials(partner.name);
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#5f6967] group-hover:text-white transition-all duration-300">
                        {getInitials(partner.name)}
                      </span>
                    )}
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-[#bf5429]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Partner name */}
                <span className="font-display text-lg md:text-2xl text-[#5f6967] group-hover:text-[#bf5429] transition-all duration-300 whitespace-nowrap">
                  {partner.name}
                </span>
              </CardTag>
            );
          })}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#bf5429]/20 to-transparent"></div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, 10px) rotate(-5deg); }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Partners;