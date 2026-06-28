"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, ArrowRight } from "lucide-react";
import type { Redirect, RedirectInput, RedirectType, RedirectStatus } from "@/server/redirects";
import { saveRedirectAction, deleteRedirectAction } from "@/server/actions/redirects";

const TYPES: RedirectType[] = ["301", "302"];
const STATUSES: RedirectStatus[] = ["Active", "Disabled"];
const statusStyle: Record<RedirectStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Disabled: "bg-white/5 text-slate-400 ring-white/10",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide font-mono";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const empty: RedirectInput = { from: "", to: "", type: "301", status: "Active" };

export function RedirectsManager({ redirects }: { redirects: Redirect[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<RedirectInput | null>(null);

  const save = (r: RedirectInput) =>
    startTransition(async () => {
      await saveRedirectAction(r);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, from: string) => {
    if (!confirm(`Delete redirect from “${from}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteRedirectAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{redirects.length} rules</p>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Redirect
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["From", "", "To", "Type", "Status", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {redirects.map((r) => {
                const busy = pending && busyId === r.id;
                return (
                  <tr key={r.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300 tracking-wide">{r.from}</td>
                    <td className="px-2 py-3.5 text-slate-600"><ArrowRight className="w-3.5 h-3.5" /></td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-300 tracking-wide">{r.to}</td>
                    <td className="px-5 py-3.5"><span className="text-xs font-mono text-slate-400">{r.type}</span></td>
                    <td className="px-5 py-3.5"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[r.status]}`}>{r.status}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditing({ id: r.id, from: r.from, to: r.to, type: r.type, status: r.status })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(r.id, r.from)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[14vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.from.trim() || !editing.to.trim()) return; save(editing); }}
            className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Redirect" : "Add Redirect"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>From (path)</label>
                <input className={inputCls} value={editing.from} onChange={(e) => setEditing({ ...editing, from: e.target.value })} placeholder="/old-path" required />
              </div>
              <div>
                <label className={labelCls}>To (path or URL)</label>
                <input className={inputCls} value={editing.to} onChange={(e) => setEditing({ ...editing, to: e.target.value })} placeholder="/new-path" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as RedirectType })}>
                    {TYPES.map((t) => <option key={t} value={t} className="bg-navy">{t} {t === "301" ? "Permanent" : "Temporary"}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as RedirectStatus })}>
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
