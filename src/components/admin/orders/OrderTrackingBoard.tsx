"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChevronRight, X, Loader2, RotateCcw } from "lucide-react";
import type { AdminOrder, OrderStatus } from "@/server/orders";
import { setOrderStatusAction } from "@/server/actions/orders";

const COLUMNS: { status: OrderStatus; accent: string; dot: string }[] = [
  { status: "Pending", accent: "border-t-violet-400/60", dot: "bg-violet-400" },
  { status: "Preparing", accent: "border-t-blue-400/60", dot: "bg-blue-400" },
  { status: "Ready", accent: "border-t-emerald-400/60", dot: "bg-emerald-400" },
  { status: "Delivered", accent: "border-t-slate-500/60", dot: "bg-slate-500" },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Delivered",
};

export function OrderTrackingBoard({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const move = (id: string, status: OrderStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await setOrderStatusAction(id, status);
      setBusyId(null);
      router.refresh();
    });
  };

  const cancelled = orders.filter((o) => o.status === "Cancelled");

  return (
    <div className="space-y-5 max-w-[1600px]">
      <p className="text-sm text-slate-400 tracking-wide">
        Live kitchen pipeline — advance each order as it moves from order to doorstep.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const items = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className={`bg-ink-2 rounded-xl border border-white/8 border-t-2 ${col.accent} shadow-[0_1px_4px_rgba(0,0,0,0.5)] flex flex-col`}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-sm font-semibold text-white tracking-wide">{col.status}</h3>
                <span className="ml-auto text-xs text-slate-500 bg-white/5 rounded-full px-2 py-0.5 tracking-wide">{items.length}</span>
              </div>

              <div className="p-3 space-y-3 min-h-24">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-6 tracking-wide">No orders</p>
                ) : (
                  items.map((o) => {
                    const busy = pending && busyId === o.id;
                    const next = NEXT[o.status];
                    return (
                      <div key={o.id} className="bg-royal/20 rounded-lg border border-white/8 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-300 tracking-wide">{o.id}</span>
                          <span className="text-xs font-semibold text-white tracking-wide">{o.amount}</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium mt-1.5 tracking-wide">{o.customer}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 tracking-wide">{o.items}</p>
                        <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1 tracking-wide">
                          <Clock className="w-3 h-3" /> {o.time}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          {next && (
                            <button
                              onClick={() => move(o.id, next)}
                              disabled={busy}
                              className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold bg-gold hover:bg-gold-light text-navy py-1.5 rounded-lg transition-colors tracking-wide disabled:opacity-50"
                            >
                              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>{next} <ChevronRight className="w-3.5 h-3.5" /></>}
                            </button>
                          )}
                          {o.status === "Delivered" ? (
                            <button
                              onClick={() => move(o.id, "Pending")}
                              disabled={busy}
                              title="Reopen"
                              className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-white/8 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => move(o.id, "Cancelled")}
                              disabled={busy}
                              title="Cancel order"
                              className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cancelled.length > 0 && (
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-4">
          <h3 className="text-sm font-semibold text-slate-400 tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Cancelled ({cancelled.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {cancelled.map((o) => (
              <button
                key={o.id}
                onClick={() => move(o.id, "Pending")}
                disabled={pending && busyId === o.id}
                title="Reopen"
                className="inline-flex items-center gap-2 text-xs bg-royal/20 border border-white/8 rounded-lg px-3 py-1.5 text-slate-400 hover:text-white transition-colors tracking-wide disabled:opacity-50"
              >
                <span className="font-mono text-slate-500">{o.id}</span> {o.customer}
                <RotateCcw className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
