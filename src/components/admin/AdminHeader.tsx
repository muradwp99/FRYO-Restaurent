"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/fryo-kanji": "Dashboard",
  "/fryo-kanji/orders": "Order List",
  "/fryo-kanji/customers": "Customers",
  "/fryo-kanji/analytics": "Analytics",
  "/fryo-kanji/reviews": "Reviews",
  "/fryo-kanji/foods": "Foods",
  "/fryo-kanji/calendar": "Calendar",
  "/fryo-kanji/chat": "Chat",
  "/fryo-kanji/wallet": "Wallet",
};

function resolveTitle(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (/^\/fryo-kanji\/orders\/\w+/.test(pathname)) return "Order Detail";
  if (/^\/fryo-kanji\/customers\/\w+/.test(pathname)) return "Customer Detail";
  if (/^\/fryo-kanji\/foods\/\w+/.test(pathname)) return "Food Detail";
  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname ?? "");

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
          <span>FRYO</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">{title}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-56 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity">
          A
        </button>
      </div>
    </header>
  );
}
