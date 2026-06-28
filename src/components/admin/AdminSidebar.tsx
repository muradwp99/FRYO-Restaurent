"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu as MenuIcon,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  navGroups,
  badgeCounts,
  filterByRole,
  type NavGroup,
  type NavItem,
  type Role,
} from "./navConfig";
import { CommandPalette } from "./CommandPalette";

function Badge({ value, dot = false }: { value: number; dot?: boolean }) {
  if (dot) return <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />;
  return (
    <span className="ml-auto text-[10px] font-bold min-w-5 h-5 px-1.5 rounded-full bg-gold text-navy flex items-center justify-center shrink-0">
      {value}
    </span>
  );
}

function NavTree({
  groups,
  collapsed,
  pathname,
  openGroups,
  toggleGroup,
  openItems,
  toggleItem,
  onNavigate,
}: {
  groups: NavGroup[];
  collapsed: boolean;
  pathname: string;
  openGroups: (key: string) => boolean;
  toggleGroup: (key: string) => void;
  openItems: (item: NavItem) => boolean;
  toggleItem: (item: NavItem) => void;
  onNavigate?: () => void;
}) {
  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/fryo-kanji") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };
  const hasActiveChild = (it: NavItem) => it.children?.some((c) => isActive(c.href)) ?? false;

  const itemRow = (it: NavItem) => {
    const Icon = it.icon;
    const active = isActive(it.href) || hasActiveChild(it);
    const count = it.badgeKey ? badgeCounts[it.badgeKey] : 0;

    // Parent with children
    if (it.children?.length) {
      const expanded = openItems(it);
      if (collapsed) {
        // icon + hover flyout
        return (
          <div key={it.label} className="relative group/par">
            <button
              className={`relative w-full flex items-center justify-center h-10 rounded-xl transition-colors ${
                active ? "bg-gold text-navy" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              aria-label={it.label}
            >
              <Icon className="w-4.5 h-4.5" />
              {count > 0 && <Badge value={count} dot />}
            </button>
            <div className="absolute left-full top-0 ml-2 hidden group-hover/par:block z-50 min-w-48 bg-ink-2 border border-white/10 rounded-xl shadow-2xl p-2">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">{it.label}</p>
              {it.children.map((c) => {
                const CIcon = c.icon;
                const cActive = isActive(c.href);
                return (
                  <Link
                    key={c.href}
                    href={(c.href ?? "#") as never}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm tracking-wide ${
                      cActive ? "bg-gold/10 text-gold" : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <CIcon className="w-4 h-4 shrink-0" /> {c.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      }
      return (
        <div key={it.label}>
          <button
            onClick={() => toggleItem(it)}
            aria-expanded={expanded}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active ? "text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-gold" : "text-slate-500"}`} />
            <span className="tracking-wide">{it.label}</span>
            <ChevronDown className={`ml-auto w-4 h-4 text-slate-500 transition-transform ${expanded ? "" : "-rotate-90"}`} />
          </button>
          {expanded && (
            <div className="mt-0.5 ml-5 pl-3 border-l border-white/8 space-y-0.5">
              {it.children.map((c) => {
                const cActive = isActive(c.href);
                return (
                  <Link
                    key={c.href}
                    href={(c.href ?? "#") as never}
                    onClick={onNavigate}
                    aria-current={cActive ? "page" : undefined}
                    className={`block px-3 py-2 rounded-lg text-sm tracking-wide transition-colors ${
                      cActive ? "text-gold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Leaf item
    const link = (
      <Link
        key={it.href}
        href={(it.href ?? "#") as never}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={collapsed ? it.label : undefined}
        className={`relative flex items-center rounded-xl text-sm font-medium transition-colors ${
          collapsed ? "justify-center h-10" : "gap-3 px-3.5 py-2.5"
        } ${
          active
            ? "bg-gold text-navy shadow-md shadow-gold/20"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-navy" : "text-slate-500"}`} />
        {!collapsed && <span className="tracking-wide">{it.label}</span>}
        {count > 0 && <Badge value={count} dot={collapsed} />}
      </Link>
    );
    return link;
  };

  return (
    <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scroll-thin">
      {groups.map((g) => (
        <div key={g.key} className={collapsed ? "pb-2 mb-2 border-b border-white/5 last:border-0" : ""}>
          {!collapsed && (
            <button
              onClick={() => toggleGroup(g.key)}
              className="w-full flex items-center gap-1.5 px-3.5 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
            >
              {g.heading}
              <ChevronRight className={`w-3 h-3 transition-transform ${openGroups(g.key) ? "rotate-90" : ""}`} />
            </button>
          )}
          {(collapsed || openGroups(g.key)) && (
            <div className="space-y-0.5">{g.items.map(itemRow)}</div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar({ role = "owner" }: { role?: Role }) {
  const pathname = usePathname() ?? "";
  const groups = useMemo(() => filterByRole(navGroups, role), [role]);

  const [collapsed, setCollapsed] = useState(false);
  const [openGroupsMap, setOpenGroupsMap] = useState<Record<string, boolean>>({});
  const [openItemsMap, setOpenItemsMap] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Hydrate persisted state
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("fryo-sb-collapsed") === "1");
      const g = localStorage.getItem("fryo-sb-groups");
      if (g) setOpenGroupsMap(JSON.parse(g));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("fryo-sb-collapsed", collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    try {
      localStorage.setItem("fryo-sb-groups", JSON.stringify(openGroupsMap));
    } catch {
      /* ignore */
    }
  }, [openGroupsMap]);

  // ⌘K / Ctrl+K + external trigger (header search)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    const onOpen = () => setPaletteOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("fryo:open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("fryo:open-command-palette", onOpen);
    };
  }, []);

  // Close drawer on navigation
  useEffect(() => setMobileOpen(false), [pathname]);

  const groupOpen = (key: string) => openGroupsMap[key] !== false; // default open
  const toggleGroup = (key: string) => setOpenGroupsMap((m) => ({ ...m, [key]: m[key] === false ? true : false }));

  const childActive = (it: NavItem) =>
    it.children?.some((c) => c.href && (pathname === c.href || pathname.startsWith(c.href + "/"))) ?? false;
  const itemOpen = (it: NavItem) => openItemsMap[it.label] ?? childActive(it);
  const toggleItem = (it: NavItem) => setOpenItemsMap((m) => ({ ...m, [it.label]: !itemOpen(it) }));

  const tree = (onNavigate?: () => void) => (
    <NavTree
      groups={groups}
      collapsed={collapsed && !onNavigate /* drawer is always expanded */}
      pathname={pathname}
      openGroups={groupOpen}
      toggleGroup={toggleGroup}
      openItems={itemOpen}
      toggleItem={toggleItem}
      onNavigate={onNavigate}
    />
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-linear-to-b from-navy to-royal border-r border-white/8 h-screen sticky top-0 shrink-0 transition-[width] duration-200 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {/* Logo + collapse */}
        <div className={`flex items-center h-16 shrink-0 ${collapsed ? "justify-center" : "gap-3 px-5"}`}>
          <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/25 shrink-0">
            <span className="text-navy font-black text-lg tracking-tight">F</span>
          </div>
          {!collapsed && <span className="font-black text-white text-xl tracking-widest leading-none">FRYO</span>}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Search trigger */}
        <div className={`shrink-0 ${collapsed ? "px-3" : "px-3"}`}>
          <button
            onClick={() => setPaletteOpen(true)}
            title={collapsed ? "Search (⌘K)" : undefined}
            className={`w-full flex items-center rounded-xl border border-white/8 bg-white/5 hover:bg-white/8 text-slate-400 hover:text-white transition-colors ${
              collapsed ? "justify-center h-10" : "gap-2.5 px-3 py-2.5"
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="text-sm tracking-wide">Search…</span>
                <kbd className="ml-auto text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </>
            )}
          </button>
        </div>

        {tree()}

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="p-3 shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center h-10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3.5 left-4 z-30 w-10 h-10 bg-ink-2 border border-white/10 text-slate-200 rounded-xl flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-navy to-royal shadow-2xl flex flex-col border-r border-white/8">
            <div className="flex items-center gap-3 px-5 h-16 shrink-0">
              <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shrink-0">
                <span className="text-navy font-black text-lg tracking-tight">F</span>
              </div>
              <span className="font-black text-white text-xl tracking-widest leading-none">FRYO</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="ml-auto p-1.5 text-slate-400 hover:text-white rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-3 shrink-0">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setPaletteOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/8 bg-white/5 text-slate-400"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm tracking-wide">Search…</span>
              </button>
            </div>
            {tree(() => setMobileOpen(false))}
          </aside>
        </>
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
