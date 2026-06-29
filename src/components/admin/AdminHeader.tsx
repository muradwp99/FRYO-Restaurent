"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Settings, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { findNavByHref } from "./navConfig";
import { logoutAction } from "@/server/actions/auth";

function openPalette() {
  window.dispatchEvent(new Event("fryo:open-command-palette"));
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "FR";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  manager: "Manager",
  editor: "Editor",
  staff: "Staff",
};

type AdminUser = { name: string; role: string };

function resolveMeta(pathname: string): { title: string; subtitle?: string; crumb?: string } {
  if (pathname === "/fryo-kanji") return { title: "Dashboard", subtitle: "Hello Admin, welcome back!" };
  const entry = findNavByHref(pathname);
  if (entry) {
    const label = entry.label.includes(" · ") ? entry.label.split(" · ").pop()! : entry.label;
    return { title: label, crumb: entry.group };
  }
  if (/^\/fryo-kanji\/orders\/\w+/.test(pathname)) return { title: "Order Detail", crumb: "Main" };
  if (/^\/fryo-kanji\/customers\/\w+/.test(pathname)) return { title: "Customer Detail", crumb: "People" };
  if (/^\/fryo-kanji\/foods\/\w+/.test(pathname)) return { title: "Menu Item", crumb: "Catalog" };
  return { title: "Admin" };
}

export function AdminHeader({ user }: { user: AdminUser }) {
  const pathname = usePathname() ?? "";
  const meta = resolveMeta(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const initials = initialsOf(user.name);
  const roleLabel = ROLE_LABEL[user.role] ?? user.role;

  function logout() {
    startTransition(() => {
      void logoutAction();
    });
  }

  return (
    <header className="bg-navy/60 backdrop-blur-md border-b border-white/8 pl-16 pr-4 lg:px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Title / breadcrumb */}
      <div className="min-w-0">
        {meta.crumb ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 tracking-wide">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300 truncate">{meta.crumb}</span>
          </div>
        ) : (
          meta.subtitle && <p className="text-xs text-slate-400 mb-1 tracking-wide">{meta.subtitle}</p>
        )}
        <h1 className="text-xl font-bold text-white leading-none tracking-wide truncate">{meta.title}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search → command palette */}
        <button
          onClick={openPalette}
          className="hidden md:flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-72 text-left hover:bg-white/8 hover:border-white/15 transition-all"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-sm text-slate-500 tracking-wide">Search anything</span>
          <kbd className="ml-auto text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        {/* Search icon (mobile) */}
        <button
          onClick={openPalette}
          className="md:hidden p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Bell */}
        <button className="relative p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full ring-2 ring-navy" />
        </button>

        {/* Settings */}
        <button className="hidden sm:block p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors" aria-label="Settings">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile */}
        <div className="relative flex items-center gap-3 pl-1">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight tracking-wide">{user.name}</p>
            <p className="text-xs text-slate-400 tracking-wide">{roleLabel}</p>
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy text-sm font-bold hover:bg-gold-light transition-colors shadow-md shadow-gold/20 shrink-0"
          >
            {initials}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-40 w-52 bg-ink-2 border border-white/10 rounded-xl shadow-2xl p-2">
                <div className="px-3 py-2 border-b border-white/8 mb-1">
                  <p className="text-sm font-semibold text-white truncate tracking-wide">{user.name}</p>
                  <p className="text-xs text-slate-400 tracking-wide">{roleLabel}</p>
                </div>
                <button
                  onClick={logout}
                  disabled={pending}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors tracking-wide disabled:opacity-60"
                >
                  {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
