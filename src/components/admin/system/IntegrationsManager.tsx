"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plug } from "lucide-react";
import type { Integration } from "@/server/integrations";
import { setIntegrationAction } from "@/server/actions/system";

export function IntegrationsManager({ integrations }: { integrations: Integration[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggle = (id: string, connected: boolean) => {
    setBusyId(id);
    startTransition(async () => {
      await setIntegrationAction(id, connected);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <p className="text-sm text-slate-400 tracking-wide">{integrations.filter((i) => i.connected).length} of {integrations.length} connected.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((i) => {
          const busy = pending && busyId === i.id;
          return (
            <div key={i.id} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-lg bg-royal/40 border border-white/8 flex items-center justify-center shrink-0">
                  <Plug className={`w-5 h-5 ${i.connected ? "text-gold" : "text-slate-500"}`} />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 tracking-wide ${i.connected ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20" : "bg-white/5 text-slate-400 ring-white/10"}`}>
                  {i.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm tracking-wide mt-3">{i.name}</h3>
              <p className="text-xs text-slate-500 tracking-widest uppercase mt-0.5">{i.category}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed tracking-wide">{i.description}</p>
              <button
                onClick={() => toggle(i.id, !i.connected)}
                disabled={busy}
                className={`mt-4 w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors tracking-wide disabled:opacity-50 ${
                  i.connected ? "border border-white/8 text-slate-300 hover:bg-royal/30 hover:text-white" : "bg-gold hover:bg-gold-light text-navy shadow-lg shadow-gold/20"
                }`}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : i.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
