"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Clock, ChevronRight } from "lucide-react";

const allOrders = [
  { id: "ORD-1042", customer: "Alex Johnson", items: "Classic Burger ×2, Fries ×1", amount: "$32.40", status: "Preparing", time: "2m ago", date: "28 Jun 2026" },
  { id: "ORD-1041", customer: "Maria Garcia", items: "Super Wrap ×1, Lemonade ×2", amount: "$18.70", status: "Ready", time: "8m ago", date: "28 Jun 2026" },
  { id: "ORD-1040", customer: "James Lee", items: "BBQ Stack ×1", amount: "$14.20", status: "Delivered", time: "14m ago", date: "28 Jun 2026" },
  { id: "ORD-1039", customer: "Priya Patel", items: "Classic Burger ×1, Fries ×2", amount: "$24.60", status: "Pending", time: "21m ago", date: "28 Jun 2026" },
  { id: "ORD-1038", customer: "Tom Wilson", items: "Super Wrap ×2, FRYO Fries ×1", amount: "$31.50", status: "Delivered", time: "35m ago", date: "28 Jun 2026" },
  { id: "ORD-1037", customer: "Zoe Martinez", items: "BBQ Stack ×2, Cola ×2", amount: "$38.20", status: "Delivered", time: "1h ago", date: "28 Jun 2026" },
  { id: "ORD-1036", customer: "Ryan Chen", items: "Classic Burger ×3", amount: "$37.20", status: "Delivered", time: "1h 20m ago", date: "28 Jun 2026" },
  { id: "ORD-1035", customer: "Sara Kim", items: "Super Wrap ×1, Fries ×1", amount: "$20.40", status: "Delivered", time: "2h ago", date: "28 Jun 2026" },
  { id: "ORD-1034", customer: "Daniel Brown", items: "FRYO Fries ×3, Lemonade ×1", amount: "$19.10", status: "Delivered", time: "2h 30m ago", date: "28 Jun 2026" },
  { id: "ORD-1033", customer: "Lily Thompson", items: "BBQ Stack ×1, Classic Burger ×1", amount: "$27.80", status: "Delivered", time: "3h ago", date: "28 Jun 2026" },
];

const tabs = ["All", "Pending", "Preparing", "Ready", "Delivered"] as const;

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Preparing: "bg-blue-50 text-blue-700 ring-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Delivered: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function OrdersPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = allOrders.filter((o) => {
    const matchesTab = tab === "All" || o.status === tab;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = tabs.reduce(
    (acc, t) => {
      acc[t] = t === "All" ? allOrders.length : allOrders.filter((o) => o.status === t).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders or customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Tab filters */}
      <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === t
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t}
            <span
              className={`ml-1.5 text-xs ${tab === t ? "text-emerald-200" : "text-slate-400"}`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Order #", "Customer", "Items", "Date", "Amount", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-emerald-700">
                      {o.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                          {o.customer[0]}
                        </div>
                        <span className="text-slate-800 font-medium">{o.customer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[200px] truncate">
                      {o.items}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-400 text-xs flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {o.time}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{o.amount}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusStyle[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href="/fryo-kanji/orders/1"
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {filtered.length} of {allOrders.length} orders
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  n === 1
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
