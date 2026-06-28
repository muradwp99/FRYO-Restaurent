"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Send } from "lucide-react";
import type { Campaign, CampaignInput, CampaignStatus } from "@/server/campaigns";
import { saveCampaignAction, deleteCampaignAction } from "@/server/actions/campaigns";

const STATUSES: CampaignStatus[] = ["Draft", "Scheduled", "Sent"];
const statusStyle: Record<CampaignStatus, string> = {
  Draft: "bg-white/5 text-slate-400 ring-white/10",
  Scheduled: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Sent: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const empty: CampaignInput = { name: "", subject: "", audience: "All customers", status: "Draft" };

export function CampaignsManager({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CampaignInput | null>(null);

  const save = (c: CampaignInput) =>
    startTransition(async () => {
      await saveCampaignAction(c);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete campaign “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteCampaignAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{campaigns.length} campaigns</p>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Campaign", "Audience", "Recipients", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map((c) => {
                const busy = pending && busyId === c.id;
                return (
                  <tr key={c.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-100 tracking-wide">{c.name}</p>
                      <p className="text-xs text-slate-500 tracking-wide mt-0.5">{c.subject}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs tracking-wide whitespace-nowrap">{c.audience}</td>
                    <td className="px-5 py-3.5 text-slate-300 tracking-wide">{c.recipients.toLocaleString()}</td>
                    <td className="px-5 py-3.5"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[c.status]}`}>{c.status}</span></td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs tracking-wide whitespace-nowrap">{c.date}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditing({ id: c.id, name: c.name, subject: c.subject, audience: c.audience, status: c.status, recipients: c.recipients, date: c.date })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(c.id, c.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</button>
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
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save(editing); }} className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Campaign" : "New Campaign"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Subject line</label>
                <input className={inputCls} value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Audience</label>
                  <input className={inputCls} value={editing.audience} onChange={(e) => setEditing({ ...editing, audience: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as CampaignStatus })}>
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{editing.id ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
