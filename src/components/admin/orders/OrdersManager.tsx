"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Clock, Trash2, Loader2, ChevronRight } from "lucide-react";
import type { AdminOrder, OrderStatus } from "@/server/orders";
import { setOrderStatusAction, deleteOrderAction } from "@/server/actions/orders";

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

const statusStyle: Record<OrderStatus, string> = {
  Pending: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  Preparing: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Ready: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Delivered: "bg-white/5 text-slate-400 ring-white/10",
  Cancelled: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

const TABS = ["All", ...ORDER_STATUSES] as const;

export function OrdersManager({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchTab = tab === "All" || o.status === tab;
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "All" ? orders.length : orders.filter((o) => o.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  const changeStatus = (id: string, status: OrderStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await setOrderStatusAction(id, status);
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!confirm(`Delete order ${id}?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteOrderAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search orders or customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-royal/20 border border-white/8 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
          />
        </div>
      </div>

      <div className="flex gap-1 bg-royal/20 p-1 rounded-lg border border-white/8 w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all tracking-wide ${
              tab === t ? "bg-gold text-navy shadow-sm shadow-gold/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t}
            <span className={`ml-1.5 text-xs ${tab === t ? "text-navy/60" : "text-slate-600"}`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Order #", "Customer", "Items", "Time", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-600 text-sm tracking-wide">No orders found.</td></tr>
              ) : (
                filtered.map((o) => {
                  const busy = pending && busyId === o.id;
                  return (
                    <tr key={o.id} className="hover:bg-royal/10 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300 tracking-wide">{o.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">
                            {o.customer[0]}
                          </div>
                          <span className="text-slate-200 font-medium tracking-wide whitespace-nowrap">{o.customer}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs max-w-50 truncate tracking-wide">{o.items}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-600 text-xs flex items-center gap-1 tracking-wide whitespace-nowrap"><Clock className="w-3 h-3" />{o.time}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white tracking-wide">{o.amount}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={o.status}
                          disabled={busy}
                          onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                          className={`text-xs rounded-full px-2.5 py-1 font-medium ring-1 tracking-wide outline-none cursor-pointer ${statusStyle[o.status]}`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-navy text-slate-200">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/fryo-kanji/orders/${o.id}`} className="text-slate-600 hover:text-gold transition-colors p-1"><ChevronRight className="w-4 h-4" /></Link>
                          <button
                            onClick={() => remove(o.id)}
                            disabled={busy}
                            className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-white/8">
          <p className="text-xs text-slate-600 tracking-wide">Showing {filtered.length} of {orders.length} orders</p>
        </div>
      </div>
    </div>
  );
}
