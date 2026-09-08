import React, { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";

const TYPE_LABELS = {
  research: "Research",
  insight: "Insight",
  publication: "Publication",
  event: "Event",
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("top");

  // Recherche
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const searchWrapRef = useRef(null);

  // Handle scroll + active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

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
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus automatique sur le champ dès qu'il apparaît
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Fermer les suggestions si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live suggestions — déclenchées à partir de 3 caractères, avec un léger debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchValue.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/search/suggestions?q=${encodeURIComponent(q)}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        setSuggestions(data.results ?? []);
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const goToResult = (url) => {
    setShowSuggestions(false);
    setSearchOpen(false);
    setSearchValue("");
    closeMenu();
    router.visit(url);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;

    setShowSuggestions(false);
    router.get(route("search.index"), { q }, { preserveState: false });
    setSearchOpen(false);
    setSearchValue("");
    closeMenu();
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#focus", label: "Projects" },
    // { href: "#research", label: "Research" },
    { href: "#publications", label: "Publications" },
    // { href: "#insights", label: "Insights" },
    { href: "#events", label: "Events" },
    { href: "#contact", label: "Contact" },
  ];

  // Classe partagée pour retirer complètement le style focus par défaut du navigateur
  const noOutlineInput =
    "outline-none focus:outline-none border-0 focus:border-0 focus:ring-0 shadow-none appearance-none";

  const SuggestionsList = ({ className = "" }) => (
    <div
      className={`absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-[#d6d9d8]/50 shadow-xl overflow-hidden z-50 ${className}`}
    >
      {loadingSuggestions ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-[#5f6967]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching...
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <ul className="divide-y divide-[#d6d9d8]/30 max-h-80 overflow-y-auto">
            {suggestions.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <button
                  type="button"
                  onClick={() => goToResult(item.url)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f6f4] transition-colors duration-150"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#bf5429] w-20 flex-shrink-0">
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  <span className="text-sm text-[#1f2d2d] truncate flex-1">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={submitSearch}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#bf5429] bg-[#f5f6f4] hover:bg-[#eaece9] transition-colors duration-150"
          >
            See all results for "{searchValue}"
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <p className="px-4 py-6 text-sm text-[#5f6967] text-center">
          No matches for "{searchValue}"
        </p>
      )}
    </div>
  );

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
          <div className="flex h-20 sm:h-24 items-center justify-between">
            {/* Logo */}
            <a href="#top" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
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
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = activeLink === link.href.replace("#", "");
                return (
                  <a key={link.href} href={link.href} className="group relative py-2">
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
                  </a>
                );
              })}
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center relative" ref={searchWrapRef}>
              <form
                onSubmit={submitSearch}
                className={`relative flex items-center overflow-hidden rounded-full transition-all duration-300 ${
                  searchOpen
                    ? "w-72 bg-white border border-[#d6d9d8] shadow-sm"
                    : "w-10 bg-transparent border border-transparent"
                }`}
              >
                <button
                  type={searchOpen ? "submit" : "button"}
                  onClick={!searchOpen ? toggleSearch : undefined}
                  aria-label="Search"
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${noOutlineInput} ${
                    searchOpen
                      ? "text-[#bf5429]"
                      : scrolled
                      ? "text-[#1f2d2d] hover:bg-[#eaece9]/60"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>

                {searchOpen && (
                  <>
                    <input
                      ref={searchInputRef}
                      type="text"
                      autoComplete="off"
                      value={searchValue}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search research, insights..."
                      className={`flex-1 bg-transparent text-sm text-[#1f2d2d] placeholder:text-[#5f6967]/50 pr-2 ${noOutlineInput}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue("");
                        setShowSuggestions(false);
                      }}
                      aria-label="Close search"
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#5f6967] hover:text-[#1f2d2d] ${noOutlineInput}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </form>

              {searchOpen && showSuggestions && searchValue.trim().length >= 3 && (
                <SuggestionsList />
              )}
            </div>

            {/* Mobile buttons */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                aria-label="Search"
                onClick={() => {
                  setSearchOpen(true);
                  openMenu();
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 ${noOutlineInput}`}
              >
                <Search className={`h-5 w-5 ${scrolled ? "text-[#1f2d2d]" : "text-white"}`} />
              </button>

              <button
                aria-label="Open menu"
                onClick={openMenu}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 ${noOutlineInput}`}
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
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl" />

        <div className="relative flex h-screen flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
              <span className="text-base sm:text-lg font-semibold tracking-tight text-[#1f2d2d]">
                The Social <span className="text-[#bf5429]">Observatory</span>
              </span>
            </div>

            <button
              aria-label="Close menu"
              onClick={closeMenu}
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 active:scale-95 ${noOutlineInput}`}
            >
              <X className="h-6 w-6 text-[#1f2d2d]" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pt-6 relative">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 rounded-2xl border border-[#d6d9d8] bg-[#f5f6f4] px-4 py-3"
            >
              <Search className="h-4 w-4 text-[#5f6967] flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                autoComplete="off"
                value={searchValue}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search research, insights, events..."
                className={`flex-1 bg-transparent text-sm text-[#1f2d2d] placeholder:text-[#5f6967]/50 ${noOutlineInput}`}
              />
            </form>

            {showSuggestions && searchValue.trim().length >= 3 && (
              <SuggestionsList className="mx-6 left-0 right-0 w-auto" />
            )}
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-sm space-y-3">
              {navLinks.map((link, index) => {
                const active = activeLink === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block rounded-2xl px-6 py-4 text-center text-lg font-medium transition-all duration-300 ${
                      active
                        ? "bg-[#bf5429] text-white shadow-lg shadow-[#bf5429]/25"
                        : "text-[#1f2d2d] hover:bg-[#eceeea]"
                    }`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;