import React from 'react';
import { useForm } from '@inertiajs/react';
import {
  Send,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
} from 'lucide-react';
import {
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';

// خريطة الشبكات الاجتماعية: كل شبكة تُعرض فقط إذا كان الرابط موجوداً في settings
const SOCIAL_NETWORKS = [
  { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn' },
  { key: 'twitter', icon: FaTwitter, label: 'Twitter' },
  { key: 'youtube', icon: FaYoutube, label: 'YouTube' },
  { key: 'facebook', icon: FaFacebookF, label: 'Facebook' },
  { key: 'instagram', icon: FaInstagram, label: 'Instagram' },
  { key: 'github', icon: FaGithub, label: 'GitHub' },
];

const Footer = ({ settings = {} }) => {
  const { data, setData, post, processing, recentlySuccessful, errors, reset } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('newsletter.subscribe'), {
      preserveScroll: true,
      onSuccess: () => reset('email'),
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const activeSocials = SOCIAL_NETWORKS.filter((network) => settings[network.key]);

  return (
    <footer className="relative bg-[#1f2d2d] text-white/70 pt-20 pb-10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(191,84,41,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(191,84,41,0.2) 0%, transparent 50%)
            `,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a href="#top" className="flex items-center gap-3 mb-6 group" onClick={scrollToTop}>
              <span className="relative w-16 h-16 flex items-center justify-center">
                <img src="/logo.png" alt="Social Observatory Logo" className="object-contain" />
              </span>
              <span className="font-display text-lg text-white group-hover:text-[#bf5429] transition-colors duration-300">
                The Social <span className="text-[#bf5429]">Observatory</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              Independent research on the social forces shaping tomorrow's policy decisions.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              {settings.address && (
                <div className="flex items-center gap-3 text-sm text-white/40 hover:text-white/60 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-[#bf5429]" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-sm text-white/40 hover:text-white/60 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-[#bf5429]" />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-sm text-white/40 hover:text-white/60 transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-[#bf5429]" />
                  <span>{settings.phone}</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {activeSocials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {activeSocials.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#bf5429] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Institute Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">
              Institute
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Research
                </a>
              </li>
              <li>
                <a href="#publications" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Publications
                </a>
              </li>
              <li>
                <a href="#focus" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">
              Resources
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#insights" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Insights
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-5">
              Stay Informed
            </p>
            <p className="text-sm text-white/60 mb-4">
              Monthly briefings on our latest research, delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    placeholder="you@organization.org"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-white placeholder-white/40 text-sm focus:bg-white/10 focus:border-[#bf5429]/50 transition-all duration-300 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="group relative px-5 py-2.5 rounded-full bg-[#bf5429] hover:bg-[#a84823] text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {recentlySuccessful ? (
                      <>
                        <span>✓</span>
                        Subscribed
                      </>
                    ) : processing ? (
                      'Sending...'
                    ) : (
                      <>
                        Join
                        <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-[#f7b18f]">{errors.email}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} The Social Observatory. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/70 transition-colors duration-300 hover:scale-105 inline-block">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/70 transition-colors duration-300 hover:scale-105 inline-block">
              Terms
            </a>
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors duration-300 hover:scale-105 inline-block"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 w-12 h-12 rounded-full bg-[#bf5429] hover:bg-[#a84823] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-[#bf5429]/30 group z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-y-1" />
      </button>
    </footer>
  );
};

export default Footer;