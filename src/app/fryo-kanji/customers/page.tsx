"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, ArrowUpRight } from "lucide-react";

const customers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", orders: 24, spent: "$742.80", joined: "Jan 2025", status: "Active" },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", orders: 18, spent: "$536.40", joined: "Mar 2025", status: "Active" },
  { id: 3, name: "James Lee", email: "james@example.com", orders: 31, spent: "$1,024.20", joined: "Nov 2024", status: "Active" },
  { id: 4, name: "Priya Patel", email: "priya@example.com", orders: 7, spent: "$198.60", joined: "May 2026", status: "Active" },
  { id: 5, name: "Tom Wilson", email: "tom@example.com", orders: 12, spent: "$384.50", joined: "Feb 2025", status: "Active" },
  { id: 6, name: "Zoe Martinez", email: "zoe@example.com", orders: 45, spent: "$1,680.00", joined: "Aug 2024", status: "VIP" },
  { id: 7, name: "Ryan Chen", email: "ryan@example.com", orders: 3, spent: "$87.20", joined: "Jun 2026", status: "New" },
  { id: 8, name: "Sara Kim", email: "sara@example.com", orders: 19, spent: "$612.40", joined: "Dec 2024", status: "Active" },
  { id: 9, name: "Daniel Brown", email: "daniel@example.com", orders: 8, spent: "$224.80", joined: "Apr 2025", status: "Active" },
  { id: 10, name: "Lily Thompson", email: "lily@example.com", orders: 52, spent: "$1,924.60", joined: "Jun 2024", status: "VIP" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  VIP: "bg-amber-50 text-amber-700 ring-amber-200",
  New: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "2,341", change: "+8.7%" },
          { label: "New This Month", value: "142", change: "+12.4%" },
          { label: "VIP Members", value: "89", change: "+3.1%" },
          { label: "Avg. Lifetime Value", value: "$284", change: "+5.6%" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{s.value}</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <p className="text-sm text-slate-400">{filtered.length} customers</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Customer", "Email", "Orders", "Total Spent", "Joined", "Status", ""].map((h) => (
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
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{c.email}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{c.orders}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{c.spent}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{c.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/fryo-kanji/customers/${c.id}`}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
