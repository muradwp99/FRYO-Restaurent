"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, CreditCard, Wallet, Banknote, Store, CircleCheck, CircleAlert } from "lucide-react";
import type { PaymentSettings } from "@/server/finance";
import { savePaymentSettingsAction } from "@/server/actions/finance";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

function Method({ icon, title, desc, checked, onChange, status }: {
  icon: React.ReactNode; title: string; desc: string; checked: boolean;
  onChange: (v: boolean) => void; status?: { ok: boolean; text: string };
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-royal/20 border border-white/8 p-3.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 w-4 h-4 accent-gold" />
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-100 tracking-wide">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5 tracking-wide">{desc}</p>
        {status && (
          <p className={`mt-1 inline-flex items-center gap-1 text-[11px] ${status.ok ? "text-emerald-400" : "text-amber-400"}`}>
            {status.ok ? <CircleCheck className="w-3 h-3" /> : <CircleAlert className="w-3 h-3" />} {status.text}
          </p>
        )}
      </div>
    </label>
  );
}

export function PaymentMethodsEditor({
  initial,
  stripeConfigured,
  paypalConfigured,
}: {
  initial: PaymentSettings;
  stripeConfigured: boolean;
  paypalConfigured: boolean;
}) {
  const [form, setForm] = useState<PaymentSettings>(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof PaymentSettings>(k: K, v: PaymentSettings[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await savePaymentSettingsAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <form onSubmit={submit} className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-white text-sm tracking-wide">Checkout payment methods</h3>
        <p className="text-xs text-slate-400 mt-1 tracking-wide">Choose what customers can pay with. Card &amp; PayPal need provider keys set in your environment.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Method icon={<CreditCard className="w-4.5 h-4.5" />} title="Card (Stripe)" desc="Secure card payment via Stripe Checkout."
          checked={form.card} onChange={(v) => set("card", v)}
          status={form.card ? (stripeConfigured ? { ok: true, text: "Stripe key detected" } : { ok: false, text: "Add STRIPE_SECRET_KEY to enable real charges" }) : undefined} />
        <Method icon={<Wallet className="w-4.5 h-4.5" />} title="PayPal" desc="Pay with a PayPal account."
          checked={form.paypal} onChange={(v) => set("paypal", v)}
          status={form.paypal ? (paypalConfigured ? { ok: true, text: "PayPal client ID detected" } : { ok: false, text: "Add PAYPAL_CLIENT_ID to enable" }) : undefined} />
        <Method icon={<Banknote className="w-4.5 h-4.5" />} title="Bank transfer" desc="Show bank details; mark paid on receipt."
          checked={form.bank} onChange={(v) => set("bank", v)} />
        <Method icon={<Store className="w-4.5 h-4.5" />} title="Pay on collection / cash" desc="Pay in person when collecting."
          checked={form.cash} onChange={(v) => set("cash", v)} />
      </div>

      {form.bank && (
        <div className="rounded-xl bg-royal/20 border border-white/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Bank transfer details</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={labelCls}>Bank</label><input className={inputCls} value={form.bankName} onChange={(e) => set("bankName", e.target.value)} /></div>
            <div><label className={labelCls}>Account name</label><input className={inputCls} value={form.accountName} onChange={(e) => set("accountName", e.target.value)} /></div>
            <div><label className={labelCls}>Sort code</label><input className={inputCls} value={form.sortCode} onChange={(e) => set("sortCode", e.target.value)} /></div>
            <div><label className={labelCls}>Account number</label><input className={inputCls} value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Payment reference instruction</label><input className={inputCls} value={form.reference} onChange={(e) => set("reference", e.target.value)} /></div>
          </div>
        </div>
      )}

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Save Payment Methods"}
      </button>
    </form>
  );
}
