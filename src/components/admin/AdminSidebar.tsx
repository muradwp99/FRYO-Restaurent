"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  BarChart3,
  Star,
  UtensilsCrossed,
  Utensils,
  UserCheck,
  Calendar,
  MessageCircle,
  Wallet,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/fryo-kanji", icon: LayoutDashboard, exact: true },
  { label: "Order List", href: "/fryo-kanji/orders", icon: ClipboardList },
  { label: "Order Detail", href: "/fryo-kanji/orders/1", icon: FileText },
  { label: "Customer", href: "/fryo-kanji/customers", icon: Users },
  { label: "Analytics", href: "/fryo-kanji/analytics", icon: BarChart3 },
  { label: "Reviews", href: "/fryo-kanji/reviews", icon: Star },
  { label: "Foods", href: "/fryo-kanji/foods", icon: UtensilsCrossed },
  { label: "Food Detail", href: "/fryo-kanji/foods/1", icon: Utensils },
  { label: "Customer Detail", href: "/fryo-kanji/customers/1", icon: UserCheck },
  { label: "Calendar", href: "/fryo-kanji/calendar", icon: Calendar },
  { label: "Chat", href: "/fryo-kanji/chat", icon: MessageCircle },
  { label: "Wallet", href: "/fryo-kanji/wallet", icon: Wallet },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-slate-900 font-black text-base tracking-tight">F</span>
        </div>
        <div>
          <span className="font-black text-slate-900 text-base tracking-tight block leading-none">FRYO</span>
          <span className="text-xs text-slate-400 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-emerald-600" : "text-slate-400"}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@fryo.com</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed bottom-5 right-5 z-50 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-2xl flex flex-col">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
