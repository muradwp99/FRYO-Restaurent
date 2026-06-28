"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Trash2, Undo2 } from "lucide-react";
import type { Refund, RefundStatus } from "@/server/finance";
import { setRefundStatusAction, deleteRefundAction } from "@/server/actions/finance";

const statusStyle: Record<RefundStatus, string> = {
  Requested: "bg-orange-400/10 text-orange-300 ring-orange-400/20",
  Processed: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Declined: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

export function RefundsManager({ refunds }: { refunds: Refund[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      setBusyId(null);
      router.refresh();
    });
  };

  const requested = refunds.filter((r) => r.status === "Requested").length;

  return (
    <div className="space-y-5 max-w-350">
      <p className="text-sm text-slate-400 tracking-wide">
        {requested} awaiting review · {refunds.length} total
      </p>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Refund #", "Order", "Customer", "Amount", "Reason", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {refunds.map((r) => {
                const busy = pending && busyId === r.id;
                return (
                  <tr key={r.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300 tracking-wide">{r.id}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400 tracking-wide">{r.orderId}</td>
                    <td className="px-5 py-3.5 text-slate-200 tracking-wide whitespace-nowrap">{r.customer}</td>
                    <td className="px-5 py-3.5 font-semibold text-white tracking-wide">{r.amount}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs tracking-wide max-w-50 truncate">{r.reason}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {r.status === "Requested" && (
                          <>
                            <button onClick={() => run(r.id, () => setRefundStatusAction(r.id, "Processed"))} disabled={busy} title="Process refund" className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs rounded-lg bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors disabled:opacity-50">
                              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => run(r.id, () => setRefundStatusAction(r.id, "Declined"))} disabled={busy} title="Decline" className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:bg-royal/30 hover:text-white transition-colors disabled:opacity-50">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {r.status !== "Requested" && (
                          <button onClick={() => run(r.id, () => setRefundStatusAction(r.id, "Requested"))} disabled={busy} title="Reopen" className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:bg-royal/30 hover:text-white transition-colors disabled:opacity-50">
                            <Undo2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm(`Delete refund ${r.id}?`)) run(r.id, () => deleteRefundAction(r.id)); }} disabled={busy} className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
