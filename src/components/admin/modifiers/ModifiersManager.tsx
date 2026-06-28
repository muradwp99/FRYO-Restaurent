"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, GripVertical } from "lucide-react";
import type { ModifierGroup, ModifierGroupInput, ModifierOption, SelectionType } from "@/server/modifiers";
import { saveModifierGroupAction, deleteModifierGroupAction } from "@/server/actions/modifiers";

const inputCls =
  "w-full px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const emptyGroup: ModifierGroupInput = {
  name: "",
  selectionType: "single",
  required: true,
  min: 1,
  max: 1,
  options: [{ id: "", label: "", priceDelta: 0 }],
};

const fmt = (n: number) => (n > 0 ? `+£${n.toFixed(2)}` : "£0");

export function ModifiersManager({ groups }: { groups: ModifierGroup[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ModifierGroupInput | null>(null);

  const save = (g: ModifierGroupInput) =>
    startTransition(async () => {
      await saveModifierGroupAction(g);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete group “${name}”? It will be removed from the customize flow.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteModifierGroupAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{groups.length} groups · power the build-your-own flow on every food page</p>
        <button
          onClick={() => setEditing({ ...emptyGroup, options: [{ id: "", label: "", priceDelta: 0 }] })}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide"
        >
          <Plus className="w-4 h-4" /> Add Group
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {groups.map((g) => {
          const busy = pending && busyId === g.id;
          return (
            <div key={g.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white text-sm tracking-wide">{g.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 tracking-wide">
                    <span className="bg-white/5 rounded px-1.5 py-0.5">{g.selectionType === "single" ? "Single-select" : "Multi-select"}</span>
                    <span className={g.required ? "text-gold" : ""}>{g.required ? "Required" : "Optional"}</span>
                    <span>· {g.options.length} options</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditing({ id: g.id, name: g.name, selectionType: g.selectionType, required: g.required, min: g.min, max: g.max, options: g.options.map((o) => ({ ...o })) })}
                    className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(g.id, g.name)}
                    disabled={busy}
                    className="flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {g.options.map((o) => (
                  <span key={o.id} className="inline-flex items-center gap-1.5 text-xs bg-royal/20 border border-white/8 rounded-lg px-2.5 py-1 text-slate-300 tracking-wide">
                    {o.label}
                    {o.priceDelta > 0 && <span className="text-gold font-medium">{fmt(o.priceDelta)}</span>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing && <GroupModal initial={editing} pending={pending} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function GroupModal({ initial, pending, onClose, onSave }: { initial: ModifierGroupInput; pending: boolean; onClose: () => void; onSave: (g: ModifierGroupInput) => void }) {
  const [form, setForm] = useState<ModifierGroupInput>(initial);
  const set = <K extends keyof ModifierGroupInput>(k: K, v: ModifierGroupInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const setOpt = (i: number, patch: Partial<ModifierOption>) =>
    setForm((f) => ({ ...f, options: f.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)) }));
  const addOpt = () => setForm((f) => ({ ...f, options: [...f.options, { id: "", label: "", priceDelta: 0 }] }));
  const removeOpt = (i: number) => setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center pt-[8vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) return;
          onSave({ ...form, options: form.options.filter((o) => o.label.trim()) });
        }}
        className="relative w-full max-w-xl bg-ink-2 border border-white/10 rounded-2xl shadow-2xl max-h-[84vh] overflow-y-auto scroll-thin"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 sticky top-0 bg-ink-2 z-10">
          <h3 className="font-bold text-white tracking-wide">{form.id ? "Edit Modifier Group" : "Add Modifier Group"}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Group name</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Choose Your Bun" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Selection</label>
              <select className={inputCls} value={form.selectionType} onChange={(e) => set("selectionType", e.target.value as SelectionType)}>
                <option className="bg-navy" value="single">Single-select</option>
                <option className="bg-navy" value="multi">Multi-select</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer tracking-wide">
                <input type="checkbox" checked={form.required} onChange={(e) => set("required", e.target.checked)} className="w-4 h-4 rounded accent-gold" />
                Required
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Options</label>
              <button type="button" onClick={addOpt} className="text-xs text-gold hover:text-gold-light font-medium tracking-wide inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add option
              </button>
            </div>
            <div className="space-y-2">
              {form.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    className={`${inputCls} flex-1`}
                    value={o.label}
                    onChange={(e) => setOpt(i, { label: e.target.value })}
                    placeholder="Option name"
                  />
                  <div className="relative w-28 shrink-0">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">+£</span>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      className={`${inputCls} pl-7`}
                      value={o.priceDelta}
                      onChange={(e) => setOpt(i, { priceDelta: Number(e.target.value) })}
                    />
                  </div>
                  <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8 sticky bottom-0 bg-ink-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {form.id ? "Save Changes" : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}
