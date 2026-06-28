"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, X, Loader2, ChevronRight } from "lucide-react";
import type { AdminCustomer, CustomerInput, CustomerStatus } from "@/server/customers";
import { saveCustomerAction, deleteCustomerAction } from "@/server/actions/customers";

const CUSTOMER_STATUSES: CustomerStatus[] = ["Active", "VIP", "New"];

const statusStyle: Record<CustomerStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  VIP: "bg-gold/10 text-gold ring-gold/20",
  New: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
};

const empty: CustomerInput = { name: "", email: "", orders: 0, spent: "£0.00", joined: "Jun 2026", status: "New" };

const inputCls =
  "w-full px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function CustomersManager({ customers }: { customers: AdminCustomer[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CustomerInput | null>(null);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const save = (data: CustomerInput) =>
    startTransition(async () => {
      await saveCustomerAction(data);
      setEditing(null);
      router.refresh();
    });

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete customer “${name}”?`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteCustomerAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const stats = [
    { label: "Total Customers", value: customers.length },
    { label: "VIP Members", value: customers.filter((c) => c.status === "VIP").length },
    { label: "New", value: customers.filter((c) => c.status === "New").length },
    { label: "Active", value: customers.filter((c) => c.status === "Active").length },
  ];

  return (
    <div className="space-y-5 max-w-350">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-4">
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">{s.label}</p>
            <p className="text-xl font-bold text-white mt-2 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-royal/20 border border-white/8 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
          />
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide ml-auto"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Customer", "Email", "Orders", "Total Spent", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => {
                const busy = pending && busyId === c.id;
                return (
                  <tr key={c.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">{c.name[0]}</div>
                        <span className="font-medium text-slate-200 tracking-wide">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs tracking-wide">{c.email}</td>
                    <td className="px-5 py-3.5 text-slate-300 tracking-wide">{c.orders}</td>
                    <td className="px-5 py-3.5 font-semibold text-white tracking-wide">{c.spent}</td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs tracking-wide">{c.joined}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 tracking-wide ${statusStyle[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditing({ id: c.id, name: c.name, email: c.email, orders: c.orders, spent: c.spent, joined: c.joined, status: c.status })}
                          className="text-slate-600 hover:text-gold transition-colors p-1"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <Link href={`/fryo-kanji/customers/${c.id}`} className="text-slate-600 hover:text-gold transition-colors p-1"><ChevronRight className="w-4 h-4" /></Link>
                        <button onClick={() => remove(c.id, c.name)} disabled={busy} className="text-slate-600 hover:text-rose-400 transition-colors p-1 disabled:opacity-50">
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

      {editing && <CustomerModal initial={editing} pending={pending} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function CustomerModal({ initial, pending, onClose, onSave }: { initial: CustomerInput; pending: boolean; onClose: () => void; onSave: (c: CustomerInput) => void }) {
  const [form, setForm] = useState<CustomerInput>(initial);
  const set = <K extends keyof CustomerInput>(k: K, v: CustomerInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) return;
          onSave({ ...form, orders: Number(form.orders) || 0 });
        }}
        className="relative w-full max-w-md bg-ink-2 border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="font-bold text-white tracking-wide">{form.id ? "Edit Customer" : "Add Customer"}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Orders</label>
              <input type="number" min="0" className={inputCls} value={form.orders} onChange={(e) => set("orders", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Total spent</label>
              <input className={inputCls} value={form.spent} onChange={(e) => set("spent", e.target.value)} placeholder="£0.00" />
            </div>
            <div>
              <label className={labelCls}>Joined</label>
              <input className={inputCls} value={form.joined} onChange={(e) => set("joined", e.target.value)} placeholder="Jun 2026" />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as CustomerStatus)}>
                {CUSTOMER_STATUSES.map((s) => <option key={s} value={s} className="bg-navy">{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">Cancel</button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60">
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {form.id ? "Save Changes" : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
