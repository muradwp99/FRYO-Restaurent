"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Banknote, CheckCircle2, Clock } from "lucide-react";
import type { Payout, PayoutStatus } from "@/server/finance";
import { setPayoutStatusAction } from "@/server/actions/finance";

const statusStyle: Record<PayoutStatus, string> = {
  Paid: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Pending: "bg-orange-400/10 text-orange-300 ring-orange-400/20",
};

export function PaymentsView({ payouts }: { payouts: Payout[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const paidTotal = payouts.filter((p) => p.status === "Paid").length;
  const pendingTotal = payouts.filter((p) => p.status === "Pending").length;

  const markPaid = (id: string) => {
    setBusyId(id);
    startTransition(async () => {
      await setPayoutStatusAction(id, "Paid");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Connected", value: "Stripe", icon: Banknote },
          { label: "Paid Out", value: String(paidTotal), icon: CheckCircle2 },
          { label: "Pending", value: String(pendingTotal), icon: Clock },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="w-4 h-4" />
                <span className="text-xs tracking-widest uppercase">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-white mt-2 tracking-tight">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="font-semibold text-white text-sm tracking-wide">Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Payout #", "Date", "Method", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map((p) => {
                const busy = pending && busyId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300 tracking-wide">{p.id}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs tracking-wide whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs tracking-wide">{p.method}</td>
                    <td className="px-5 py-3.5 font-semibold text-white tracking-wide">{p.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.status === "Pending" && (
                        <button onClick={() => markPaid(p.id)} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors tracking-wide disabled:opacity-50">
                          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Mark paid
                        </button>
                      )}
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
