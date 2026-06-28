"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { Ingredient, IngredientInput } from "@/server/ingredients";
import { saveIngredientAction, deleteIngredientAction } from "@/server/actions/catalog";

const ALLERGENS = ["Gluten", "Dairy", "Egg", "Soy", "Sesame", "Nuts", "Mustard"];

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const empty: IngredientInput = { name: "", allergens: [], calories: 0, inStock: true };

export function IngredientsManager({ ingredients }: { ingredients: Ingredient[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<IngredientInput | null>(null);

  const save = (i: IngredientInput) =>
    startTransition(async () => {
      await saveIngredientAction({ ...i, calories: Number(i.calories) || 0 });
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteIngredientAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const toggleAllergen = (a: string) =>
    setEditing((e) => e && ({ ...e, allergens: e.allergens.includes(a) ? e.allergens.filter((x) => x !== a) : [...e.allergens, a] }));

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{ingredients.length} ingredients · allergen &amp; kcal reference</p>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Ingredient", "Allergens", "Calories", "Stock", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ingredients.map((i) => {
                const busy = pending && busyId === i.id;
                return (
                  <tr key={i.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-200 tracking-wide">{i.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {i.allergens.length === 0 ? <span className="text-xs text-slate-600 tracking-wide">—</span> : i.allergens.map((a) => (
                          <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300 tracking-wide">{a}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 tracking-wide">{i.calories} kcal</td>
                    <td className="px-5 py-3.5">
                      {i.inStock ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-300 tracking-wide"><CheckCircle2 className="w-3.5 h-3.5" /> In stock</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-300 tracking-wide"><XCircle className="w-3.5 h-3.5" /> Out</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditing({ id: i.id, name: i.name, allergens: i.allergens, calories: i.calories, inStock: i.inStock })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(i.id, i.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">
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
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save(editing); }}
            className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Ingredient" : "Add Ingredient"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div>
                  <label className={labelCls}>Calories (kcal)</label>
                  <input type="number" min="0" className={inputCls} value={editing.calories} onChange={(e) => setEditing({ ...editing, calories: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Allergens</label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((a) => {
                    const on = editing.allergens.includes(a);
                    return (
                      <button type="button" key={a} onClick={() => toggleAllergen(a)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors tracking-wide ${on ? "border-orange-400/40 bg-orange-400/10 text-orange-300" : "border-white/8 text-slate-400 hover:text-white"}`}>
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer tracking-wide">
                <input type="checkbox" checked={editing.inStock} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} className="w-4 h-4 rounded accent-gold" />
                In stock
              </label>
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
