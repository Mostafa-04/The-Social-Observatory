import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

/**
 * DataTable — composant générique et réutilisable pour toutes les pages.
 * (Props inchangées — voir version précédente pour le détail complet.)
 */

// Couleurs de statut : volontairement laissées génériques (vert/rouge/ambre/bleu)
// car elles portent un sens universel (succès/erreur/attention) indépendant
// de l'identité visuelle de la marque — on ne les rebrande pas.
export function Badge({ status, map }) {
  const defaultMap = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    inactive: "bg-gray-50 text-gray-600 ring-gray-500/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/20",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-red-600/20",
    default: "bg-[#F7F8F6] text-[#324949] ring-[#324949]/15",
  };
  const styles = map || defaultMap;
  const classes = styles[status] || styles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {status}
    </span>
  );
}

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown className="w-3.5 h-3.5 text-[#C6CBC8]" />;
  return direction === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 text-[#1f2d2d]" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-[#1f2d2d]" />
  );
}

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchKeys,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  actions,
  customActions,
  rowKey = "id",
  emptyMessage = "Aucune donnée à afficher",
  title,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const keysToSearch = searchKeys || columns.map((c) => c.key);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      keysToSearch.some((key) => {
        const value = row[key];
        return value !== null && value !== undefined
          ? String(value).toLowerCase().includes(q)
          : false;
      })
    );
  }, [data, search, keysToSearch]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === valB) return 0;
      const result = valA > valB ? 1 : -1;
      return sortConfig.direction === "asc" ? result : -result;
    });
    return arr;
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const hasActions = actions?.onView || actions?.onEdit || actions?.onDelete || customActions;

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: "asc" };
    });
  };

  const toggleSelectAll = () => {
    let next;
    if (selected.length === paginated.length) {
      next = [];
    } else {
      next = paginated.map((row) => row[rowKey]);
    }
    setSelected(next);
    onSelectionChange?.(data.filter((row) => next.includes(row[rowKey])));
  };

  const toggleSelectRow = (id) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      onSelectionChange?.(data.filter((row) => next.includes(row[rowKey])));
      return next;
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-[#D6D9D8] shadow-sm overflow-hidden">
      {/* Header */}
      {(title || searchable) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#EAECE9]">
          {title && <h2 className="font-display text-[17px] text-[#1f2d2d]">{title}</h2>}

          {searchable && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9290]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#D6D9D8] bg-[#F7F8F6] focus:bg-white focus:outline-none focus:border-[#324949]/40 transition"
              />
            </div>
          )}
        </div>
      )}

      {/* Table (scrollable horizontally whenever available width shrinks — e.g. next to a sidebar) */}
      <div className="overflow-x-auto">
        {/*
          "min-w-full" (et non "w-full") : le tableau garde AU MOINS la largeur
          de son conteneur mais peut devenir plus large si le contenu l'exige.
          Il déborde alors, et "overflow-x-auto" transforme ce débordement en
          scroll horizontal — aucune colonne n'est jamais cachée.
        */}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8F6] border-b border-[#D6D9D8]">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selected.length === paginated.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[10.5px] font-semibold text-[#5B6462] uppercase tracking-wide whitespace-nowrap ${
                    col.width || ""
                  } ${col.sortable ? "cursor-pointer select-none hover:text-[#1f2d2d]" : ""}`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        active={sortConfig.key === col.key}
                        direction={sortConfig.direction}
                      />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right text-[10.5px] font-semibold text-[#5B6462] uppercase tracking-wide whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAECE9]">
            {/* Loading */}
            {loading && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-[#8A9290]">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Chargement en cours...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && paginated.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-[#8A9290]">
                    <Inbox className="w-8 h-8" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading &&
              paginated.map((row) => (
                <tr
                  key={row[rowKey]}
                  className="hover:bg-[#BF5429]/[0.04] transition-colors"
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(row[rowKey])}
                        onChange={() => toggleSelectRow(row[rowKey])}
                        className="w-4 h-4 rounded border-[#D6D9D8] text-[#BF5429] focus:ring-[#BF5429]/30 cursor-pointer"
                      />
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[#1f2d2d] whitespace-nowrap ${col.className || ""}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actions?.onView && (
                          <button
                            onClick={() => actions.onView(row)}
                            className="p-1.5 rounded-md text-[#8A9290] hover:text-[#324949] hover:bg-[#F7F8F6] transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {actions?.onEdit && (
                          <button
                            onClick={() => actions.onEdit(row)}
                            className="p-1.5 rounded-md text-[#8A9290] hover:text-[#BF5429] hover:bg-[#BF5429]/10 transition-colors"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {actions?.onDelete && (
                          <button
                            onClick={() => actions.onDelete(row)}
                            className="p-1.5 rounded-md text-[#8A9290] hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {customActions?.(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-t border-[#EAECE9] text-sm text-[#5B6462]">
          <span>
            Affichage {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sorted.length)} sur {sorted.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F8F6] transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F8F6] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-[#1f2d2d] font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F8F6] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F8F6] transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}