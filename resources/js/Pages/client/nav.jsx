import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const Nav = () => {
  const { url } = usePage();
  const isHome = url === "/" || url.split("?")[0] === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("top");
  // Le nav est toujours affiché avec le style "scrolled" (fond blanc),
  // qu'on soit tout en haut de la page ou non.
  const scrolled = true;

  // Handle active section (uniquement pertinent sur la home)
  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) return;

      const sections = document.querySelectorAll("section[id]");
      let current = "top";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          current = section.getAttribute("id") || "top";
        }
      });

      setActiveLink(current);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Si on arrive sur la home avec un hash dans l'URL (ex: venant d'une autre page),
  // on scrolle en douceur vers la section une fois le contenu monté.
  useEffect(() => {
    if (!isHome) return;

    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // petit délai pour laisser le temps au contenu de la page de se rendre
        const timeout = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timeout);
      }
    }
  }, [isHome, url]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#focus", label: "Projects" },
    { href: "#research", label: "Research" },
    { href: "#publications", label: "Publications" },
    { href: "#insights", label: "Insights" },
    { href: "#events", label: "Events" },
    { href: "#contact", label: "Contact" },
  ];

  // Construit le href final: ancre simple sur la home, sinon retour à la home + ancre
  const resolveHref = (hash) => (isHome ? hash : `/${hash}`);

  // Petit composant interne pour ne pas dupliquer la logique <a> vs <Link>
  const NavItem = ({ hash, className, style, onClick, children }) => {
    if (isHome) {
      return (
        <a href={hash} className={className} style={style} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={resolveHref(hash)} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/85 backdrop-blur-2xl shadow-xl border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <NavItem hash="#top" className="flex items-center gap-3 group">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
              />

              <span
                className={`text-base sm:text-lg font-semibold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-[#1f2d2d]" : "text-white"
                }`}
              >
                The Social{" "}
                <span
                  className={`transition-colors duration-300 ${
                    scrolled ? "text-[#bf5429]" : "text-[#f7b18f]"
                  }`}
                >
                  Observatory
                </span>
              </span>
            </NavItem>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isHome && activeLink === link.href.replace("#", "");

                return (
                  <NavItem key={link.href} hash={link.href} className="group relative py-2">
                    <span
                      className={`text-[14px] font-medium transition-colors duration-300 ${
                        active
                          ? "text-[#bf5429]"
                          : scrolled
                          ? "text-[#5f6967] hover:text-[#1f2d2d]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </span>

                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-[#bf5429] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </NavItem>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <NavItem
                hash="#contact"
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  scrolled
                    ? "bg-[#bf5429] text-white hover:bg-[#a54824] shadow-lg"
                    : "border border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-[#1f2d2d]"
                }`}
              >
                Partner With Us
              </NavItem>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              onClick={openMenu}
              className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-1.5">
                {[1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                      scrolled ? "bg-[#1f2d2d]" : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-[999] lg:hidden transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl" />

        {/* Content */}
        <div className="relative flex h-screen flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
              />

              <span className="text-base sm:text-lg font-semibold tracking-tight text-[#1f2d2d]">
                The Social{" "}
                <span className="text-[#bf5429]">Observatory</span>
              </span>
            </div>

            {/* Close Button */}
            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-[#1f2d2d]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-sm space-y-3">
              {navLinks.map((link, index) => {
                const active = isHome && activeLink === link.href.replace("#", "");

                return (
                  <NavItem
                    key={link.href}
                    hash={link.href}
                    onClick={closeMenu}
                    className={`block rounded-2xl px-6 py-4 text-center text-lg font-medium transition-all duration-300 ${
                      active
                        ? "bg-[#bf5429] text-white shadow-lg shadow-[#bf5429]/25"
                        : "text-[#1f2d2d] hover:bg-[#eceeea]"
                    }`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    {link.label}
                  </NavItem>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-gray-200 p-6">
            <NavItem
              hash="#contact"
              onClick={closeMenu}
              className="block w-full rounded-2xl bg-[#bf5429] px-6 py-4 text-center font-semibold text-white transition-all duration-300 hover:bg-[#a54824] active:scale-[0.98]"
            >
              Partner With Us
            </NavItem>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;