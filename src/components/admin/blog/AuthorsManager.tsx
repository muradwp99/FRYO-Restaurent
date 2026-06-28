"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import type { BlogAuthor } from "@/server/blog-taxonomy";
import { saveBlogAuthorAction, deleteBlogAuthorAction } from "@/server/actions/blog-taxonomy";

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

type Draft = { id?: string; name: string; email: string; bio: string };
const empty: Draft = { name: "", email: "", bio: "" };

export function AuthorsManager({ authors }: { authors: BlogAuthor[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = (a: Draft) =>
    startTransition(async () => {
      await saveBlogAuthorAction(a);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete author “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteBlogAuthorAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{authors.length} authors</p>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Add Author
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {authors.map((a) => {
          const busy = pending && busyId === a.id;
          return (
            <div key={a.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold shrink-0">{a.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm tracking-wide">{a.name}</p>
                  <p className="text-xs text-slate-500 tracking-wide">{a.email}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setEditing({ id: a.id, name: a.name, email: a.email, bio: a.bio })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(a.id, a.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed tracking-wide">{a.bio}</p>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[14vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save(editing); }} className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit Author" : "Add Author"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea rows={3} className={inputCls} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
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
