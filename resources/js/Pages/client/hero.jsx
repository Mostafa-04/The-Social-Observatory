import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { TypeAnimation } from 'react-type-animation';

function useCounter(end, startAnimation) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startAnimation) return;

        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function animate(time) {
            const progress = Math.min((time - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [end, startAnimation]);

    return count;
}

const Stat = ({ end, suffix = "", label }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.4,
    });

    const count = useCounter(end, inView);

    return (
        <div ref={ref} className="group text-center lg:text-left">
            <h3 className="font-display text-3xl font-semibold text-white">
                {count}
                {suffix}
            </h3>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                {label}
            </p>
        </div>
    );
};

const Hero = ({countParteners, countPublications, countCountries}) => {
  const nodeFieldRef = useRef(null);
  const svgRef = useRef(null);
  const visualRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Respect the user's OS-level reduced-motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Node network — built with percentage-based SVG coordinates so it
  // never needs to be recalculated on resize (previous version baked
  // pixel offsets from offsetWidth/offsetHeight at mount time only).
  useEffect(() => {
    const container = nodeFieldRef.current;
    if (!container || prefersReducedMotion) return;

    container.innerHTML = '';

    const numNodes = 30;
    const nodes = [];
    const centerX = 50;
    const centerY = 50;

    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      const x = centerX + Math.cos(angle + Math.random() * 0.5) * radius;
      const y = centerY + Math.sin(angle + Math.random() * 0.5) * radius;
      const size = 2 + Math.random() * 4;
      const opacity = 0.2 + Math.random() * 0.4;
      const delay = Math.random() * 3;

      const node = document.createElement('div');
      node.className = 'absolute rounded-full';
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      node.style.opacity = opacity;
      node.style.animation = `pulse${i % 3} ${2 + Math.random() * 2}s ease-in-out ${delay}s infinite`;
      node.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.1)';

      container.appendChild(node);
      nodes.push({ x, y });
    }

    // Connections drawn in a 0-100 viewBox so they scale with the
    // container instead of drifting on resize.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');
    svg.style.opacity = '0.15';

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 25) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', nodes[i].x);
          line.setAttribute('y1', nodes[i].y);
          line.setAttribute('x2', nodes[j].x);
          line.setAttribute('y2', nodes[j].y);
          line.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
          line.setAttribute('stroke-width', '0.15');
          line.style.opacity = 0.2 + (1 - distance / 25) * 0.3;
          svg.appendChild(line);
        }
      }
    }

    container.appendChild(svg);
    svgRef.current = svg;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse0 { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.8); opacity: 0.6; } }
      @keyframes pulse1 { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(2.2); opacity: 0.7; } }
      @keyframes pulse2 { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(2); opacity: 0.5; } }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, [prefersReducedMotion]);

  // Subtle pointer-parallax tilt on the circular visual — desktop,
  // fine-pointer devices only, and skipped for reduced-motion users.
  useEffect(() => {
    const el = visualRef.current;
    if (!el || prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${relX * 8}deg) rotateX(${-relY * 8}deg)`;
    };
    const handleLeave = () => {
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [prefersReducedMotion]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted((m) => !m);
  }, [isMuted]);

  return (
    <section id="top" className="relative min-h-screen py-8 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full bg-[#1f2d2d]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>

          {/* Fallback shown until the video reports it has loaded */}
          {!videoLoaded && (
            <img
              src="/cover.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2d2d]/90 via-[#1f2d2d]/70 to-[#1f2d2d]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d2d]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#bf5429]/20 via-transparent to-[#bf5429]/10 animate-[pulse_8s_ease-in-out_infinite]" />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E')]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full py-10 lg:py-22">
          <div className="grid lg:grid-cols-12 gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-7 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
                <span className="w-8 h-[1px] bg-[#bf5429]" />
                <span className="text-sm tracking-widest uppercase text-[#bf5429] font-medium">
                  Independent Research Institute · Est. 2025
                </span>
              </div>

              <h1 className="font-display text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-[4.6rem] lg:leading-[1.04] text-white font-medium tracking-tight">
                {prefersReducedMotion ? (
                  'Think. Observe. Anticipate. Act.'
                ) : (
                  <TypeAnimation
                    sequence={[
                      'Think.',
                      700,
                      'Think. Observe.',
                      700,
                      'Think. Observe. Anticipate.',
                      700,
                      'Think. Observe. Anticipate. Act.',
                    ]}
                    wrapper="span"
                    speed={45}
                    repeat={0}
                    cursor={true}
                  />
                )}
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 font-light opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
                The Social Observatory turns emerging social signals into rigorous evidence —
                helping governments, institutions, and communities anticipate change before it
                arrives, and act on it with confidence.
              </p>

              <div className="mt-11 flex flex-col sm:flex-row gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards]">
                <a
                  href="#research"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] bg-[#bf5429] text-white hover:bg-[#a84823] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#bf5429]/30 active:scale-95"
                >
                  Explore Research
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] text-white border-2 border-white/30 hover:border-[#bf5429] hover:bg-[#bf5429]/10 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                >
                  Partner With Us
                </a>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-10 text-white/60 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
                <Stat end={countCountries} suffix="+" label="Countries studied" />
                <div className="w-px h-9 bg-white/10" />
                <Stat end={countPublications} suffix="+" label="Publications" />
                <div className="w-px h-9 bg-white/10" />
                <Stat end={countParteners} suffix="+" label="Strategic partners" />
              </div>
            </div>

            {/* Right Content — image with node-network overlay + parallax tilt */}
            <div className="lg:col-span-5 relative">
              <div
                ref={visualRef}
                className="relative aspect-square max-w-md mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_1.2s_forwards] transition-transform duration-300 ease-out will-change-transform"
              >
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-[#bf5429]/20 animate-[spin_30s_linear_infinite]" />

                <div className="absolute -inset-4 rounded-full bg-[#bf5429]/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />

                <div
                  className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#bf5429]/20"
                  style={{ clipPath: 'circle(46% at 50% 50%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1f2d2d]/30 via-transparent to-[#bf5429]/20 z-10" />
                  <img
                    src="/logo.png"
                    alt="Social Observatory network visualization"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                    loading="lazy"
                  />
                  <div ref={nodeFieldRef} className="absolute inset-0 z-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-10" />
                </div>

                <div className="absolute bottom-10 left-4 w-3 h-3 rounded-full bg-[#bf5429] shadow-[0_0_20px_rgba(191,84,41,0.4)] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute top-10 right-4 w-2 h-2 rounded-full bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse-delay" />
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator — now actually rendered (ChevronDown was imported but unused) */}
        <a
          href="#about"
          aria-label="Scroll to next section"
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors z-10"
        >
          <span className="text-[11px] uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown size={18} className={prefersReducedMotion ? '' : 'animate-bounce'} />
        </a>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 0.4; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce { animation: bounce 2s ease-in-out infinite; }
        .animate-pulse-delay { animation: pulse 3s ease-in-out 1.5s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-bounce, .animate-pulse-delay,
          [class*="animate-[fadeInUp"], [class*="animate-[fadeIn"],
          [class*="animate-[spin"], [class*="animate-[pulse"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;