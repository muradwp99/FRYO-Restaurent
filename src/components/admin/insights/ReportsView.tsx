"use client";

import { DollarSign, ShoppingBag, TrendingUp, UtensilsCrossed, Download } from "lucide-react";
import type { AdminOrder } from "@/server/orders";
import type { AdminMenuItem } from "@/server/menu";

const money = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
const gbp = (n: number) => `£${n.toFixed(2)}`;

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const ORDER_STATUSES = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"] as const;
const statusColor: Record<string, string> = {
  Pending: "#a78bfa", Preparing: "#60a5fa", Ready: "#34d399", Delivered: "#64748b", Cancelled: "#fb7185",
};

export function ReportsView({ orders, menu }: { orders: AdminOrder[]; menu: AdminMenuItem[] }) {
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + money(o.amount), 0);
  const completed = orders.filter((o) => o.status === "Delivered").length;
  const aov = orders.length ? revenue / orders.filter((o) => o.status !== "Cancelled").length || 0 : 0;

  const byStatus = ORDER_STATUSES.map((st) => ({ st, n: orders.filter((o) => o.status === st).length }));
  const maxStatus = Math.max(1, ...byStatus.map((s) => s.n));

  const cats = Array.from(new Set(menu.map((m) => m.category)));
  const byCat = cats.map((c) => ({ c, n: menu.filter((m) => m.category === c).length }));

  const kpis = [
    { label: "Revenue (excl. cancelled)", value: gbp(revenue), icon: DollarSign },
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag },
    { label: "Delivered", value: String(completed), icon: TrendingUp },
    { label: "Menu Items", value: String(menu.length), icon: UtensilsCrossed },
  ];

  const exportOrders = () =>
    downloadCsv("fryo-orders.csv", [
      ["Order #", "Customer", "Items", "Amount", "Status", "Date", "Time"],
      ...orders.map((o) => [o.id, o.customer, o.items, o.amount, o.status, o.date, o.time]),
    ]);

  const exportMenu = () =>
    downloadCsv("fryo-menu.csv", [
      ["ID", "Name", "Category", "Price", "Rating", "Calories", "Status", "Featured"],
      ...menu.map((m) => [m.id, m.name, m.category, m.price, m.rating, m.calories, m.status, m.featured ? "Yes" : "No"]),
    ]);

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-end gap-2">
        <button onClick={exportOrders} className="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Download className="w-4 h-4" /> Orders CSV
        </button>
        <button onClick={exportMenu} className="inline-flex items-center gap-2 px-4 py-2 border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white rounded-lg text-sm font-medium transition-colors tracking-wide">
          <Download className="w-4 h-4" /> Menu CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="w-9 h-9 rounded-lg bg-gold/12 flex items-center justify-center mb-3"><Icon className="w-4.5 h-4.5 text-gold" /></div>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">{k.label}</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Orders by status */}
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Orders by Status</h3>
          <p className="text-xs text-slate-500 tracking-wide mb-5">Avg. order value {gbp(aov)}</p>
          <div className="space-y-3">
            {byStatus.map((s) => (
              <div key={s.st}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 tracking-wide">{s.st}</span>
                  <span className="text-xs text-slate-500 tracking-wide">{s.n}</span>
                </div>
                <div className="h-2 bg-royal/30 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(s.n / maxStatus) * 100}%`, background: statusColor[s.st] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu by category */}
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-5">Menu by Category</h3>
          <div className="space-y-3">
            {byCat.map((c) => (
              <div key={c.c}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 tracking-wide">{c.c}</span>
                  <span className="text-xs text-slate-500 tracking-wide">{c.n} items</span>
                </div>
                <div className="h-2 bg-royal/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(c.n / Math.max(1, menu.length)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
