"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Package } from "lucide-react";
import type { Combo, ComboInput, ComboStatus } from "@/server/combos";
import { saveComboAction, deleteComboAction } from "@/server/actions/catalog";

const STATUSES: ComboStatus[] = ["Active", "Hidden"];
const statusStyle: Record<ComboStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Hidden: "bg-white/5 text-slate-400 ring-white/10",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const empty: ComboInput = { name: "", description: "", items: "", price: "", status: "Active" };

export function CombosManager({ combos }: { combos: Combo[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ComboInput | null>(null);

  const save = (c: ComboInput) =>
    startTransition(async () => {
      await saveComboAction(c);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete combo “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteComboAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{combos.length} bundles</p>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Combo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combos.map((c) => {
          const busy = pending && busyId === c.id;
          return (
            <div key={c.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-gold" /></span>
                  <div>
                    <h3 className="font-semibold text-white text-sm tracking-wide">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 tracking-wide">{c.items}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 tracking-wide shrink-0 ${statusStyle[c.status]}`}>{c.status}</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed tracking-wide">{c.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
                <span className="text-lg font-bold text-white tracking-tight">{c.price}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setEditing({ id: c.id, name: c.name, description: c.description, items: c.items, price: c.price, status: c.status })} className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => remove(c.id, c.name)} disabled={busy} className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[10vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save(editing); }}
            className="relative w-full max-w-lg bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Combo" : "Add Combo"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={2} className={inputCls} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Includes</label>
                <input className={inputCls} value={editing.items} onChange={(e) => setEditing({ ...editing, items: e.target.value })} placeholder="Burger · Fries · Drink" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Price</label>
                  <input className={inputCls} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="£10.99" />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ComboStatus })}>
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}{editing.id ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
