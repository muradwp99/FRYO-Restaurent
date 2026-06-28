"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, ClipboardList, Star, UserCog, FileText, Wallet, PenTool, Trash2, type LucideIcon } from "lucide-react";
import type { ActivityEntry, ActivityKind } from "@/server/activity";
import { clearActivityAction } from "@/server/actions/activity";

const ICONS: Record<ActivityKind, LucideIcon> = {
  menu: UtensilsCrossed,
  order: ClipboardList,
  review: Star,
  user: UserCog,
  content: FileText,
  finance: Wallet,
  blog: PenTool,
};

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const clear = () => {
    if (!confirm("Clear the entire activity log?")) return;
    startTransition(async () => {
      await clearActivityAction();
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{entries.length} recent actions across the admin.</p>
        {entries.length > 0 && (
          <button onClick={clear} disabled={pending} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-rose-400/20 text-rose-400 hover:bg-rose-400/10 transition-colors tracking-wide disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" /> Clear log
          </button>
        )}
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
        {entries.length === 0 ? (
          <p className="text-center text-slate-500 text-sm tracking-wide py-8">The activity log is empty.</p>
        ) : (
          <div className="space-y-1">
            {entries.map((e, i) => {
              const Icon = ICONS[e.kind] ?? FileText;
              const last = i === entries.length - 1;
              return (
                <div key={e.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-royal/40 border border-white/8 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    {!last && <div className="w-px flex-1 bg-white/8 my-1" />}
                  </div>
                  <div className={`min-w-0 ${last ? "" : "pb-4"}`}>
                    <p className="text-sm text-slate-200 tracking-wide">
                      <span className="font-semibold text-white">{e.actor}</span> {e.action}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 tracking-wide">{e.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
