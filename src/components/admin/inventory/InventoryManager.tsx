"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2, CheckCircle2, XCircle, EyeOff } from "lucide-react";
import { formatGBP } from "@/lib/utils";
import type { AdminMenuItem, MenuStatus } from "@/server/menu";
import { setMenuStatusAction } from "@/server/actions/menu";

const STATUS_META: Record<MenuStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  Active: { label: "In stock", cls: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20", icon: CheckCircle2 },
  "Sold out": { label: "Sold out", cls: "bg-orange-400/10 text-orange-300 ring-orange-400/20", icon: XCircle },
  Hidden: { label: "Hidden", cls: "bg-white/5 text-slate-400 ring-white/10", icon: EyeOff },
};

export function InventoryManager({ items }: { items: AdminMenuItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const counts = {
    active: items.filter((i) => i.status === "Active").length,
    sold: items.filter((i) => i.status === "Sold out").length,
    hidden: items.filter((i) => i.status === "Hidden").length,
  };

  const setStatus = (id: string, status: MenuStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await setMenuStatusAction(id, status);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "In stock", value: counts.active, cls: "text-emerald-300" },
          { label: "Sold out", value: counts.sold, cls: "text-orange-300" },
          { label: "Hidden", value: counts.hidden, cls: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-4">
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 tracking-tight ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-royal/20 border border-white/8 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
        />
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Item", "Category", "Price", "Status", "Set stock"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((i) => {
                const busy = pending && busyId === i.id;
                const meta = STATUS_META[i.status];
                const Icon = meta.icon;
                return (
                  <tr key={i.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/8 shrink-0">
                          <Image src={i.image} alt={i.name} fill sizes="36px" className="object-cover" />
                        </div>
                        <span className="text-slate-200 font-medium tracking-wide">{i.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs tracking-widest uppercase">{i.category}</td>
                    <td className="px-5 py-3 font-semibold text-white tracking-wide">{formatGBP(i.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 tracking-wide ${meta.cls}`}>
                        <Icon className="w-3.5 h-3.5" /> {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      ) : (
                        <div className="flex gap-1.5">
                          {(["Active", "Sold out", "Hidden"] as MenuStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(i.id, s)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors tracking-wide ${
                                i.status === s
                                  ? "border-gold/40 bg-gold/10 text-gold"
                                  : "border-white/8 text-slate-400 hover:bg-royal/30 hover:text-white"
                              }`}
                            >
                              {STATUS_META[s].label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
