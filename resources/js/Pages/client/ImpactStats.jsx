import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Globe,
  Users,
  FileText,
  Award,
  TrendingUp,
  BarChart,
  Target,
  Sparkles
} from 'lucide-react';

const ImpactStats = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  // Animated counter
  const useCounter = (target, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime = null;
      let animationFrame;

      const updateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        setCount(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCounter);
        } else {
          setCount(target);
        }
      };

      animationFrame = requestAnimationFrame(updateCounter);

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }, [isVisible, target, duration]);

    return count;
  };

  const stats = [
    {
      id: 1,
      target: 128,
      label: 'Research Publications',
      icon: BookOpen,
      suffix: '+',
      color: '#bf5429',
      description: 'Peer-reviewed papers and reports',
    },
    {
      id: 2,
      target: 42,
      label: 'Countries',
      icon: Globe,
      suffix: '',
      color: '#bf5429',
      description: 'Across 5 continents',
    },
    {
      id: 3,
      target: 65,
      label: 'Strategic Partners',
      icon: Users,
      suffix: '+',
      color: '#bf5429',
      description: 'Governments, NGOs, universities',
    },
    {
      id: 4,
      target: 94,
      label: 'Policy Initiatives',
      icon: FileText,
      suffix: '',
      color: '#bf5429',
      description: 'Informing policy decisions',
    },
  ];

  const counts = stats.map(stat => useCounter(stat.target));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            if (entry.target === sectionRef.current) {
              setIsVisible(true);
            }
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
    
    statsRef.current.forEach((stat) => {
      if (stat) observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1f2d2d 0%, #324949 50%, #1f2d2d 100%)',
      }}
    >
      {/* Particle canvas would go here */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #bf5429 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, #bf5429 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, #bf5429 1px, transparent 1px),
            radial-gradient(circle at 60% 20%, #bf5429 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}></div>
      </div>

      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#bf5429]/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#bf5429]/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-2xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-[#bf5429]"></span>
            <span className="text-sm tracking-widest uppercase text-[#bf5429] font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Our Impact
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight">
            Two decades of <span className="text-[#bf5429]">evidence</span>, translated into action
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                ref={(el) => (statsRef.current[index] = el)}
                className="group opacity-0 translate-y-8 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-[#bf5429]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#bf5429]/10 flex items-center justify-center group-hover:bg-[#bf5429] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Icon className="w-6 h-6 text-[#bf5429] group-hover:text-white transition-all duration-300" strokeWidth={1.8} />
                    </div>
                    <Sparkles className="w-4 h-4 text-[#bf5429]/50 group-hover:text-[#bf5429] transition-colors duration-300" />
                  </div>

                  {/* Number */}
                  <div className="flex items-center gap-1">
                    <p className="font-display text-4xl sm:text-5xl text-white font-medium">
                      {counts[index] || 0}
                    </p>
                    {stat.suffix && (
                      <span className="font-display text-4xl sm:text-5xl text-[#bf5429]">
                        {stat.suffix}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                    {stat.label}
                  </p>

                  {/* Description */}
                  <p className="mt-1 text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300">
                    {stat.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#bf5429] to-[#bf5429]/50 rounded-full transition-all duration-1000"
                      style={{ 
                        width: isVisible ? `${(counts[index] / stat.target) * 100}%` : '0%',
                        transitionDelay: `${300 + index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-[#bf5429]/30 transition-all duration-300 hover:shadow-xl group">
            <span className="text-sm text-white/70">Explore our impact</span>
            <div className="w-px h-6 bg-white/10"></div>
            <a
              href="#publications"
              className="inline-flex items-center gap-2 text-[#bf5429] font-semibold transition-all duration-300 group-hover:gap-3"
            >
              <span>View all publications</span>
              <BarChart className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;