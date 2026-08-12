import React from "react";
import {
  LayoutGrid,
  BookOpen,
  FileText,
  Briefcase,
  Calendar,
  PenLine,
  Tag,
  User,
  Globe,
  Handshake,
  Mail,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

// ============================================================
// Navigation model — uses route names
// ============================================================
const NAV = [
  {
    group: null,
    items: [{ label: "Tableau de bord", icon: LayoutGrid, route: "dashboard" }],
  },
  {
    group: "Contenu",
    items: [
      { label: "Recherches", icon: BookOpen, route: "researches.index" },
      { label: "Publications", icon: FileText, route: "publications.index" },
      { label: "Projets", icon: Briefcase, route: "projects.index"},
      { label: "Événements", icon: Calendar, route: "events.index" },
      { label: "Insights", icon: PenLine, route: "insights.index" },
    ],
  },
  {
    group: "Répertoires",
    items: [
      { label: "Catégories", icon: Tag, route: "categories.index" },
      { label: "Auteurs", icon: User, route: "authors.index" },
      { label: "Pays", icon: Globe, route: "countries.index" },
      { label: "Partenaires", icon: Handshake, route: "partners.index" },
    ],
  },
  {
    group: "Engagement",
    items: [
      { label: "Messages", icon: Mail, route: "contacts.index" },
      { label: "Newsletter", icon: Bell, route: "newsletter-subscribers.index" },
    ],
  },
  {
    group: "Système",
    items: [
      // { label: "Statistiques du site", icon: BarChart3, route: "statistics.index" },
      // { label: "Utilisateurs", icon: User, route: "users.index" },
      { label: "Paramètres", icon: Settings, route: "settings.index" },
    ],
  },
];

// ============================================================
// Sidebar
// ============================================================
export default function Sidebar() {
    const { auth } = usePage().props;

        const currentUser = auth.user;
        

  // Check if route is active
  const isRouteActive = (routeName) => {
    return route().current(routeName);
  };

  return (
    <>
      {/* Scrollbar Custom Styles */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
          transition: background 0.2s;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <aside className="w-64 shrink-0 bg-gradient-to-b from-[#1f2d2d] to-[#192121] text-white flex flex-col h-screen border-r border-white/5">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/8 shrink-0 bg-white/[0.02]">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          <div className="leading-tight flex-1">
            <p className="font-serif text-[13px] font-medium text-white">Social Observatory</p>
            <p className="text-[9.5px] text-white/30 tracking-widest mt-0.5">ESPACE ADMIN</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-5 space-y-6 text-[13.5px]">
          {NAV.map((section, si) => (
            <div key={si}>
              {section.group && (
                <p className="px-4 mb-2.5 text-[10px] font-semibold tracking-widest text-white/25 uppercase">
                  {section.group}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isRouteActive(item.route);

                  return (
                    <Link
                      key={item.route}
                      href={route(item.route)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left relative group",
                        isActive
                          ? "bg-[#BF5429]/15 text-white shadow-sm shadow-[#BF5429]/10"
                          : "text-white/65 hover:text-white/90 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      {/* Dot indicator */}
                      <span
                        className={[
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200",
                          isActive ? "bg-[#BF5429]" : "bg-white/0 group-hover:bg-white/15",
                        ].join(" ")}
                      />

                      {/* Icon */}
                      <Icon
                        size={16}
                        strokeWidth={1.6}
                        className={[
                          "shrink-0 transition-colors duration-200",
                          isActive ? "text-[#BF5429]" : "text-white/50",
                        ].join(" ")}
                      />

                      {/* Label */}
                      <span className="flex-1 truncate font-medium">{item.label}</span>

                      {/* Count */}
                      {item.count != null && (
                        <span
                          className={[
                            "text-[10px] font-mono shrink-0 transition-colors duration-200",
                            isActive ? "text-[#BF5429]/80" : "text-white/30",
                          ].join(" ")}
                        >
                          {item.count}
                        </span>
                      )}

                      {/* Badge */}
                      {item.badge != null && (
                        <span
                          className={[
                            "text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 transition-all duration-200",
                            isActive
                              ? "bg-[#BF5429] text-white shadow-md shadow-[#BF5429]/30"
                              : "bg-[#BF5429]/80 text-white",
                          ].join(" ")}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-white/8 bg-white/[0.02]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition-colors duration-200 group">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#BF5429]/30 to-[#BF5429]/10 border border-[#BF5429]/40 flex items-center justify-center font-serif text-xs font-semibold text-[#BF5429] shrink-0 group-hover:border-[#BF5429]/60 transition-colors duration-200">
              {currentUser.initials}
            </div>

            {/* User Info */}
            <div className="leading-tight flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">{currentUser.role}</p>
            </div>

            {/* Logout Button */}
            <Link
              href={route("logout")}
              method="post"
              as="button"
              type="button"
              title="Se déconnecter"
              className="text-white/40 hover:text-[#BF5429] hover:bg-white/[0.06] p-1.5 rounded transition-all duration-200 shrink-0"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}