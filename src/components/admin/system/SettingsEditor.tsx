"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { GeneralSettings, DayHours } from "@/server/settings";
import { saveSettingsAction } from "@/server/actions/settings";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function SettingsEditor({ initial }: { initial: GeneralSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<GeneralSettings>(initial);
  const set = <K extends keyof GeneralSettings>(k: K, v: GeneralSettings[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setHour = (i: number, patch: Partial<DayHours>) =>
    setForm((f) => ({ ...f, hours: f.hours.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveSettingsAction(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6 space-y-4">
        <h3 className="font-semibold text-white text-sm tracking-wide">General</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Restaurant name</label>
            <input className={inputCls} value={form.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Tagline</label>
            <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Support email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <input className={inputCls} value={form.currency} onChange={(e) => set("currency", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Timezone</label>
            <input className={inputCls} value={form.timezone} onChange={(e) => set("timezone", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <h3 className="font-semibold text-white text-sm tracking-wide mb-4">Opening Hours</h3>
        <div className="space-y-2">
          {form.hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3">
              <span className="w-24 text-sm text-slate-300 tracking-wide shrink-0">{h.day}</span>
              {h.closed ? (
                <span className="flex-1 text-sm text-slate-600 tracking-wide">Closed</span>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={h.open} onChange={(e) => setHour(i, { open: e.target.value })} className={`${inputCls} w-32`} />
                  <span className="text-slate-600">–</span>
                  <input type="time" value={h.close} onChange={(e) => setHour(i, { close: e.target.value })} className={`${inputCls} w-32`} />
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer shrink-0 tracking-wide">
                <input type="checkbox" checked={h.closed} onChange={(e) => setHour(i, { closed: e.target.checked })} className="w-4 h-4 rounded accent-gold" />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved" : "Save Settings"}
      </button>
    </form>
  );
}
