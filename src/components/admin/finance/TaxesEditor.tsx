"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Truck } from "lucide-react";
import type { FinanceSettings } from "@/server/finance";
import { saveFinanceSettingsAction } from "@/server/actions/finance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function TaxesEditor({ initial }: { initial: FinanceSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FinanceSettings>(initial);
  const set = <K extends keyof FinanceSettings>(k: K, v: number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveFinanceSettingsAction({
        deliveryFee: Number(form.deliveryFee) || 0,
        freeDeliveryOver: Number(form.freeDeliveryOver) || 0,
        taxRatePct: Number(form.taxRatePct) || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <div className="bg-ink-2 rounded-xl border border-gold/30 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
          <Truck className="w-4.5 h-4.5 text-gold" />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed tracking-wide">
          These values drive the live <span className="text-white font-medium">cart</span> and{" "}
          <span className="text-white font-medium">checkout</span> — change the free-delivery threshold and customers see it instantly.
        </p>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <div>
          <label className={labelCls}>Delivery fee (£)</label>
          <input type="number" step="0.01" min="0" className={inputCls} value={form.deliveryFee} onChange={(e) => set("deliveryFee", Number(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}>Free delivery over (£)</label>
          <input type="number" step="1" min="0" className={inputCls} value={form.freeDeliveryOver} onChange={(e) => set("freeDeliveryOver", Number(e.target.value))} />
          <p className="text-xs text-slate-600 mt-1.5 tracking-wide">Orders at or above this subtotal ship free.</p>
        </div>
        <div>
          <label className={labelCls}>Tax rate (%)</label>
          <input type="number" step="0.1" min="0" className={inputCls} value={form.taxRatePct} onChange={(e) => set("taxRatePct", Number(e.target.value))} />
          <p className="text-xs text-slate-600 mt-1.5 tracking-wide">Stored for reporting; not yet applied at checkout.</p>
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Publish Changes"}
      </button>
    </form>
  );
}
