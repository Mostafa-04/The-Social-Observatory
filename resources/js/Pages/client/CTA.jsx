import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Send,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Globe,
  CheckCircle,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { useForm } from "@inertiajs/react";

const CTA = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {
              data,
              setData,
              post,
              processing,
              errors,
              reset,
          } = useForm({
              email: "",
          });

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
    if (formRef.current) observer.observe(formRef.current);

    return () => observer.disconnect();
  }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("newsletter.subscribe"), {
            preserveScroll: true,

            onSuccess: () => {
                setIsSubmitted(true);

                reset();

                setTimeout(() => {
                    setIsSubmitted(false);
                }, 4000);
            },
        });
    };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1f2d2d 0%, #324949 50%, #1f2d2d 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(191,84,41,0.5) 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(191,84,41,0.3) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(191,84,41,0.1) 0%, transparent 60%)
          `,
        }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 opacity-10 animate-[float_8s_ease-in-out_infinite]">
        <Sparkles className="w-16 h-16 text-[#bf5429]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 animate-[float_6s_ease-in-out_infinite_delay]">
        <Target className="w-16 h-16 text-[#bf5429]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-[#bf5429]/30 animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#bf5429]/20 animate-[pulse_4s_ease-in-out_infinite_delay]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-[#bf5429]/30 animate-[pulse_5s_ease-in-out_infinite]"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-[#bf5429]/20 animate-[pulse_3.5s_ease-in-out_infinite_delay]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-[#bf5429]"></span>
            <span className="text-sm tracking-widest uppercase text-[#bf5429] font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collaborate With Us
            </span>
            <span className="w-12 h-[2px] bg-[#bf5429]"></span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-medium leading-tight">
            Governments, universities, and NGOs
            <br className="hidden sm:block" />
            <span className="relative">
              <span className="relative z-10 text-[#bf5429]">shape the future</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-[#bf5429]/20 -z-10"></span>
            </span>
            <br className="hidden sm:block" />
            with us.
          </h2>

          <p className="mt-6 text-white/70 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Whether you're designing policy, funding research, or building programs on the ground —
            we'd welcome the conversation.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/50">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#bf5429]" />
            <span className="text-xs font-medium">ISO Certified</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#bf5429]" />
            <span className="text-xs font-medium">42 Countries</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#bf5429]" />
            <span className="text-xs font-medium">65+ Partners</span>
          </div>
        </div>

        {/* Form */}
        <div
          ref={formRef}
          className="mt-12 max-w-lg mx-auto opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
        >
          <form
            onSubmit={handleSubmit}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 hover:border-[#bf5429]/30 transition-all duration-300 shadow-2xl shadow-[#bf5429]/5">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Email input */}
                <div className="flex-1 relative">
                  <label htmlFor="cta-email" className="sr-only">
                    Work email
                  </label>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="cta-email"
                    type="email"
                    required
                    placeholder="Your work email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none rounded-xl"
                  />
                  {errors.email && (
                      <p className="mt-2 text-sm text-red-400">
                          {errors.email}
                      </p>
                  )}
                </div>

                {/* Submit button */}
                  <button
                      type="submit"
                      disabled={processing}
                      className="group relative px-6 py-3.5 bg-[#bf5429] hover:bg-[#a84823] text-white font-semibold text-sm rounded-xl disabled:opacity-50"
                  >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Thank you — we'll be in touch
                      </>
                    ) : (
                      <>
                        Start a Conversation
                        <Send className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
                      </>
                    )}
                  </span>
                  {/* Button shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </button>
              </div>
            </div>

            {/* Form hint */}
            <p className="mt-3 text-xs text-white/30 flex items-center justify-center gap-1">
              <span>We respect your privacy. No spam, ever.</span>
            </p>
          </form>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 opacity-0 translate-y-8 transition-all duration-700 delay-400 ease-out">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 group text-sm"
          >
            <span>Learn more about our work</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#bf5429]/30 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bf5429] to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, 10px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 9s ease-in-out infinite 1s;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-pulse-delay {
          animation: pulse 4s ease-in-out infinite 0.5s;
        }
      `}</style>
    </section>
  );
};

export default CTA;