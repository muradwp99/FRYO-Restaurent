"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import type { StaffUser, UserInput, UserRole, UserStatus } from "@/server/users";
import { saveUserAction, deleteUserAction } from "@/server/actions/users";

const ROLES: UserRole[] = ["owner", "manager", "editor", "staff"];
const STATUSES: UserStatus[] = ["Active", "Invited", "Suspended"];

const roleStyle: Record<UserRole, string> = {
  owner: "bg-gold/10 text-gold ring-gold/20",
  manager: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  editor: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  staff: "bg-white/5 text-slate-300 ring-white/10",
};
const statusStyle: Record<UserStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Invited: "bg-orange-400/10 text-orange-300 ring-orange-400/20",
  Suspended: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

const emptyUser: UserInput = { name: "", email: "", role: "staff", status: "Invited" };

export function UsersManager({ users }: { users: StaffUser[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserInput | null>(null);

  const save = (u: UserInput) =>
    startTransition(async () => {
      await saveUserAction(u);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Remove ${name}'s access?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteUserAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400 tracking-wide">{users.length} team members · roles control what each can access</p>
        <button onClick={() => setEditing({ ...emptyUser })} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide">
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["User", "Email", "Role", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const busy = pending && busyId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">{u.name[0]}</div>
                        <span className="font-medium text-slate-200 tracking-wide">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs tracking-wide">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide capitalize ${roleStyle[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditing({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status })} className="text-slate-600 hover:text-gold transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(u.id, u.name)} disabled={busy || u.role === "owner"} title={u.role === "owner" ? "Can't remove the owner" : ""} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-30">
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
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-[14vh] px-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => { e.preventDefault(); if (!editing.name.trim()) return; save(editing); }}
            className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white tracking-wide">{editing.id ? "Edit User" : "Invite User"}</h3>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Role</label>
                  <select className={`${inputCls} capitalize`} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as UserRole })}>
                    {ROLES.map((r) => <option key={r} value={r} className="bg-navy capitalize">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as UserStatus })}>
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? "Save" : "Send Invite"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
