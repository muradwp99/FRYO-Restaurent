"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Tag, Copy, Check } from "lucide-react";
import type { AdminDeal, DealInput, DealStatus } from "@/server/deals";
import { saveDealAction, deleteDealAction, setDealStatusAction } from "@/server/actions/deals";

const STATUSES: DealStatus[] = ["Active", "Hidden"];
const statusStyle: Record<DealStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Hidden: "bg-white/5 text-slate-400 ring-white/10",
};

const empty: DealInput = {
  title: "",
  blurb: "",
  code: "",
  badge: "",
  tone: "gold",
  cta: "Claim Deal",
  href: "/#menu",
  status: "Active",
};

const inputCls =
  "w-full px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function DealsManager({ deals }: { deals: AdminDeal[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<DealInput | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const save = (data: DealInput) =>
    startTransition(async () => {
      await saveDealAction(data);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, title: string) => {
    if (!confirm(`Delete “${title}”? It will be removed from the site.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteDealAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const changeStatus = (id: string, status: DealStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await setDealStatusAction(id, status);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{deals.length} promo codes · edits reflect on the homepage &amp; /deals</p>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide"
        >
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((d) => (
          <div key={d.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-lg shrink-0 ${d.tone === "gold" ? "bg-gold/15 text-gold" : "bg-royal/40 text-slate-200"}`}>
                  <Tag className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm tracking-wide">{d.title}</h3>
                  <p className="text-xs text-slate-500 tracking-wide mt-0.5">{d.badge}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 tracking-wide shrink-0 ${statusStyle[d.status]}`}>{d.status}</span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed tracking-wide line-clamp-2">{d.blurb}</p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(d.code).catch(() => {});
                  setCopied(d.id);
                  setTimeout(() => setCopied(null), 1200);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-2.5 py-1 font-mono text-xs tracking-widest text-slate-300 hover:border-gold/50 hover:text-gold transition-colors"
              >
                {copied === d.id ? <Check className="w-3 h-3 text-gold" /> : <Copy className="w-3 h-3" />}
                {d.code}
              </button>
              <span className="text-xs text-slate-600 tracking-wide">→ {d.cta}</span>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/8">
              <select
                value={d.status}
                disabled={pending && busyId === d.id}
                onChange={(e) => changeStatus(d.id, e.target.value as DealStatus)}
                className="text-xs bg-royal/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-300 outline-none focus:border-gold/40 tracking-wide"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-navy">{s}</option>
                ))}
              </select>
              <button
                onClick={() => setEditing({ id: d.id, title: d.title, blurb: d.blurb, code: d.code, badge: d.badge, tone: d.tone, cta: d.cta, href: d.href, status: d.status })}
                className="ml-auto flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => remove(d.id, d.title)}
                disabled={pending && busyId === d.id}
                className="flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
              >
                {pending && busyId === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && <DealModal initial={editing} pending={pending} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function DealModal({ initial, pending, onClose, onSave }: { initial: DealInput; pending: boolean; onClose: () => void; onSave: (d: DealInput) => void }) {
  const [form, setForm] = useState<DealInput>(initial);
  const set = <K extends keyof DealInput>(k: K, v: DealInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim() || !form.code.trim()) return;
          onSave(form);
        }}
        className="relative w-full max-w-lg bg-ink-2 border border-white/10 rounded-2xl shadow-2xl max-h-[84vh] overflow-y-auto scroll-thin"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 sticky top-0 bg-ink-2">
          <h3 className="font-bold text-white tracking-wide">{form.id ? "Edit Deal" : "Add Deal"}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="10% Off Your First Order" required />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={2} className={inputCls} value={form.blurb} onChange={(e) => set("blurb", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Promo code</label>
              <input className={`${inputCls} font-mono`} value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="WELCOME10" required />
            </div>
            <div>
              <label className={labelCls}>Badge / schedule</label>
              <input className={inputCls} value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Save up to £2.50" />
            </div>
            <div>
              <label className={labelCls}>Tone</label>
              <select className={inputCls} value={form.tone} onChange={(e) => set("tone", e.target.value as "gold" | "royal")}>
                <option className="bg-navy" value="gold">Gold</option>
                <option className="bg-navy" value="royal">Royal</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as DealStatus)}>
                {STATUSES.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>CTA label</label>
              <input className={inputCls} value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="Claim Deal" />
            </div>
            <div>
              <label className={labelCls}>CTA link</label>
              <input className={inputCls} value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="/#menu" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8 sticky bottom-0 bg-ink-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {form.id ? "Save Changes" : "Create Deal"}
          </button>
        </div>
      </form>
    </div>
  );
}
