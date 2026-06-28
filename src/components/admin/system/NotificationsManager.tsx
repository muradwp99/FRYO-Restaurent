"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { NotificationPref, NotifChannel } from "@/server/notifications";
import { setNotificationAction } from "@/server/actions/system";

const CHANNELS: { key: NotifChannel; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "push", label: "Push" },
];

export function NotificationsManager({ prefs }: { prefs: NotificationPref[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = (id: string, channel: NotifChannel, value: boolean) => {
    setBusy(`${id}:${channel}`);
    startTransition(async () => {
      await setNotificationAction(id, channel, value);
      setBusy(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-275">
      <p className="text-sm text-slate-400 tracking-wide">Choose how the team is notified for each event.</p>
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-royal/20 border-b border-white/8">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Event</th>
              {CHANNELS.map((c) => (
                <th key={c.key} className="px-5 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-widest w-24">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prefs.map((p) => (
              <tr key={p.id} className="hover:bg-royal/10 transition-colors">
                <td className="px-5 py-3.5 text-slate-200 tracking-wide">{p.event}</td>
                {CHANNELS.map((c) => {
                  const on = p[c.key];
                  const isBusy = pending && busy === `${p.id}:${c.key}`;
                  return (
                    <td key={c.key} className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => toggle(p.id, c.key, !on)}
                        disabled={isBusy}
                        className={`w-9 h-5 rounded-full relative transition-colors mx-auto ${on ? "bg-gold" : "bg-white/10"} disabled:opacity-50`}
                        aria-pressed={on}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3 h-3 animate-spin text-navy absolute top-1 left-3" />
                        ) : (
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform flex items-center justify-center ${on ? "translate-x-4" : ""}`}>
                            {on && <Check className="w-2.5 h-2.5 text-gold" />}
                          </span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
