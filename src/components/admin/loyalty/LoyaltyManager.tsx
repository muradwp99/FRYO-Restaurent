"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Check, Gift, Pause, Play } from "lucide-react";
import type { LoyaltyProgram, LoyaltyRule, RuleInput, RuleType, RuleStatus } from "@/server/loyalty";
import { saveLoyaltyProgramAction, saveRuleAction, setRuleStatusAction, deleteRuleAction } from "@/server/actions/loyalty";

const RULE_TYPES: RuleType[] = ["Multiplier", "Bonus Points", "Earn Rate"];
const statusStyle: Record<RuleStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Paused: "bg-white/5 text-slate-400 ring-white/10",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const emptyRule: RuleInput = { name: "", type: "Multiplier", value: 2, schedule: "Always", status: "Active" };

const ruleValueLabel = (r: { type: RuleType; value: number }) =>
  r.type === "Multiplier" ? `${r.value}× points` : r.type === "Bonus Points" ? `+${r.value} pts` : `${r.value} pt / £1`;

export function LoyaltyManager({ program, rules }: { program: LoyaltyProgram; rules: LoyaltyRule[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [prog, setProg] = useState<LoyaltyProgram>(program);
  const [progSaved, setProgSaved] = useState(false);
  const [editing, setEditing] = useState<RuleInput | null>(null);

  const saveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveLoyaltyProgramAction({
        pointsPerPound: Number(prog.pointsPerPound) || 0,
        rewardThreshold: Number(prog.rewardThreshold) || 0,
        rewardLabel: prog.rewardLabel,
      });
      setProgSaved(true);
      setTimeout(() => setProgSaved(false), 2000);
      router.refresh();
    });
  };

  const saveRuleForm = (r: RuleInput) =>
    startTransition(async () => {
      await saveRuleAction({ ...r, value: Number(r.value) || 0 });
      setEditing(null);
      router.refresh();
    });

  const toggle = (r: LoyaltyRule) => {
    setBusyId(r.id);
    startTransition(async () => {
      await setRuleStatusAction(r.id, r.status === "Active" ? "Paused" : "Active");
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete rule “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteRuleAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      {/* Program settings */}
      <form onSubmit={saveProgram} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center"><Gift className="w-4.5 h-4.5 text-gold" /></div>
          <h3 className="font-semibold text-white text-sm tracking-wide">Program Settings</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Points per £1</label>
            <input type="number" step="1" min="0" className={inputCls} value={prog.pointsPerPound} onChange={(e) => setProg((p) => ({ ...p, pointsPerPound: Number(e.target.value) }))} />
          </div>
          <div>
            <label className={labelCls}>Reward threshold (pts)</label>
            <input type="number" step="1" min="0" className={inputCls} value={prog.rewardThreshold} onChange={(e) => setProg((p) => ({ ...p, rewardThreshold: Number(e.target.value) }))} />
          </div>
          <div>
            <label className={labelCls}>Reward</label>
            <input className={inputCls} value={prog.rewardLabel} onChange={(e) => setProg((p) => ({ ...p, rewardLabel: e.target.value }))} />
          </div>
        </div>
        <button type="submit" disabled={pending} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : progSaved ? <Check className="w-4 h-4" /> : null}
          {progSaved ? "Saved" : "Save Program"}
        </button>
      </form>

      {/* Rules */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-white text-sm tracking-wide">Earning Rules</h3>
        <button onClick={() => setEditing({ ...emptyRule })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((r) => {
          const busy = pending && busyId === r.id;
          return (
            <div key={r.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white text-sm tracking-wide">{r.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 tracking-wide">{r.schedule}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 tracking-wide shrink-0 ${statusStyle[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-lg font-bold text-gold mt-3 tracking-tight">{ruleValueLabel(r)}</p>
              <p className="text-xs text-slate-600 tracking-widest uppercase mt-0.5">{r.type}</p>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/8">
                <button onClick={() => toggle(r)} disabled={busy} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide disabled:opacity-50">
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : r.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {r.status === "Active" ? "Pause" : "Activate"}
                </button>
                <button onClick={() => setEditing({ id: r.id, name: r.name, type: r.type, value: r.value, schedule: r.schedule, status: r.status })} className="ml-auto inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => remove(r.id, r.name)} disabled={busy} className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; saveRuleForm(editing); }}
            className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Rule" : "Add Rule"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Double Points Thursday" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as RuleType })}>
                    {RULE_TYPES.map((t) => <option key={t} value={t} className="bg-navy">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Value</label>
                  <input type="number" step="0.5" min="0" className={inputCls} value={editing.value} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Schedule</label>
                <input className={inputCls} value={editing.schedule} onChange={(e) => setEditing({ ...editing, schedule: e.target.value })} placeholder="Every Thursday" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
