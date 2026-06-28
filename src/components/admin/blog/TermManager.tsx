"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Check, X, Tag, Folder } from "lucide-react";
import type { BlogTerm } from "@/server/blog-taxonomy";
import { saveBlogCategoryAction, deleteBlogCategoryAction, saveBlogTagAction, deleteBlogTagAction } from "@/server/actions/blog-taxonomy";

export function TermManager({ kind, terms }: { kind: "category" | "tag"; terms: BlogTerm[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [newName, setNewName] = useState("");

  const saveAction = kind === "category" ? saveBlogCategoryAction : saveBlogTagAction;
  const deleteAction = kind === "category" ? deleteBlogCategoryAction : deleteBlogTagAction;
  const Icon = kind === "category" ? Folder : Tag;
  const label = kind === "category" ? "Category" : "Tag";

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    startTransition(async () => {
      await saveAction({ name: newName.trim() });
      setNewName("");
      router.refresh();
    });
  };

  const saveEdit = (id: string) => {
    if (!draft.trim()) return;
    setBusyId(id);
    startTransition(async () => {
      await saveAction({ id, name: draft.trim() });
      setBusyId(null);
      setEditingId(null);
      router.refresh();
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete ${label.toLowerCase()} “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const inputCls = "px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";

  return (
    <div className="space-y-5 max-w-xl">
      <form onSubmit={add} className="flex gap-2">
        <input className={`${inputCls} flex-1`} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={`New ${label.toLowerCase()}…`} />
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] divide-y divide-white/5">
        {terms.map((t) => {
          const busy = pending && busyId === t.id;
          const editing = editingId === t.id;
          return (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3">
              <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-gold" /></span>
              {editing ? (
                <input autoFocus className={`${inputCls} flex-1`} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(t.id)} />
              ) : (
                <span className="flex-1 text-sm text-slate-200 tracking-wide">{t.name}</span>
              )}
              <div className="flex items-center gap-1.5">
                {editing ? (
                  <button onClick={() => saveEdit(t.id)} disabled={busy} className="text-emerald-300 hover:text-emerald-200 p-1 disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}</button>
                ) : (
                  <button onClick={() => { setEditingId(t.id); setDraft(t.name); }} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                )}
                {editing ? (
                  <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
                ) : (
                  <button onClick={() => remove(t.id, t.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
