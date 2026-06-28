"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Tags } from "lucide-react";
import type { Category, CategoryInput } from "@/server/categories";
import { saveCategoryAction, deleteCategoryAction } from "@/server/actions/categories";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CategoryInput | null>(null);

  const save = (c: CategoryInput) =>
    startTransition(async () => {
      await saveCategoryAction(c);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete category “${name}”? Items keep their category label.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteCategoryAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Drives the menu-item dropdown &amp; the public menu filter tabs.</p>
        <button onClick={() => setEditing({ name: "", order: categories.length + 1 })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="divide-y divide-white/5">
          {categories.map((c) => {
            const busy = pending && busyId === c.id;
            return (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-royal/10 transition-colors">
                <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><Tags className="w-4 h-4 text-gold" /></span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 tracking-wide">{c.name}</p>
                  <p className="text-xs text-slate-600 font-mono tracking-wide">/{c.slug} · order {c.order}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <button onClick={() => setEditing({ id: c.id, name: c.name, order: c.order })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(c.id, c.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[16vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save({ ...editing, order: Number(editing.order) || 1 }); }}
            className="relative w-full max-w-sm bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Category" : "Add Category"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Sides" required />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" min="1" className={inputCls} value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
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
