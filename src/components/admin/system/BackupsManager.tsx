"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, DatabaseBackup, Download, Trash2, Plus } from "lucide-react";
import type { Backup } from "@/server/backups";
import { createBackupAction, deleteBackupAction } from "@/server/actions/system";

export function BackupsManager({ backups }: { backups: Backup[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const create = () => {
    setCreating(true);
    startTransition(async () => {
      await createBackupAction();
      setCreating(false);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this backup?")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteBackupAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">Automatic nightly backups · {backups.length} stored.</p>
        <button onClick={create} disabled={creating} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Back up now
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="divide-y divide-white/5">
          {backups.map((b) => {
            const busy = pending && busyId === b.id;
            return (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-royal/10 transition-colors">
                <span className="w-9 h-9 rounded-lg bg-royal/40 border border-white/8 flex items-center justify-center shrink-0"><DatabaseBackup className="w-4.5 h-4.5 text-gold" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200 tracking-wide">{b.date}</p>
                  <p className="text-xs text-slate-600 tracking-wide">{b.size} · {b.status}</p>
                </div>
                <button className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button onClick={() => remove(b.id)} disabled={busy} className="inline-flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50">
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
