"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Check, LogOut, Package, Wallet, BadgeCheck, Clock } from "lucide-react";
import { updateProfileAction, logoutAccountAction } from "@/server/actions/account";

type OrderRow = { id: string; items: string; amount: string; status: string; date: string };
type Props = {
  profile: { name: string; email: string; joined: string; phone?: string };
  stats: { orders: number; spent: string; status: string };
  orders: OrderRow[];
};

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  Preparing: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Ready: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  Delivered: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Cancelled: "bg-white/5 text-cream/50 ring-white/10",
};

const field = "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-cream outline-none transition-all placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/10";
const label = "mb-1.5 block text-xs font-medium uppercase tracking-widest text-cream/50";

export function AccountDashboard({ profile, stats, orders }: Props) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [loggingOut, startLogout] = useTransition();

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateProfileAction({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const statCards = [
    { icon: <Package className="h-5 w-5" />, label: "Orders", value: String(stats.orders) },
    { icon: <Wallet className="h-5 w-5" />, label: "Total Spent", value: stats.spent },
    { icon: <BadgeCheck className="h-5 w-5" />, label: "Tier", value: stats.status },
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10">
      {/* header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-display text-base tracking-[0.4em] text-gold">Your Account</span>
          <h1 className="mt-2 font-display text-5xl leading-none text-cream md:text-7xl">
            Hey, <span className="text-gold-grad">{profile.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-cream/50">
            <Clock className="h-4 w-4" /> Member since {profile.joined} · {profile.email}
          </p>
        </div>
        <form action={() => startLogout(() => void logoutAccountAction())}>
          <button
            type="submit"
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm tracking-wide text-cream/80 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-60"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sign out
          </button>
        </form>
      </div>

      {/* stats */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold/12 text-gold">{s.icon}</div>
            <p className="mt-4 text-xs uppercase tracking-widest text-cream/50">{s.label}</p>
            <p className="mt-1 font-display text-4xl text-cream">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* orders */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-2xl tracking-wide text-cream">Order History</h2>
          <div className="mt-5 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-ink/40 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream">{o.items}</p>
                  <p className="mt-0.5 font-mono text-xs text-cream/40">{o.id} · {o.date}</p>
                </div>
                <span className="font-display text-xl text-gold">{o.amount}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyle[o.status] ?? "bg-white/5 text-cream/50 ring-white/10"}`}>
                  {o.status}
                </span>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-cream/50">No orders yet.</p>
                <Link href="/menu" className="mt-3 inline-block font-display text-lg tracking-widest text-gold hover:text-gold-light">
                  Start your first order →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* profile */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-2xl tracking-wide text-cream">Profile</h2>
          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <div>
              <label className={label}>Name</label>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input className={`${field} opacity-60`} value={profile.email} disabled />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 …" />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 font-display text-lg tracking-widest text-navy transition-all hover:bg-gold-light disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
