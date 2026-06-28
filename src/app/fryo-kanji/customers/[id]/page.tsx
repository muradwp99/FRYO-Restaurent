import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, ShoppingBag, Wallet } from "lucide-react";
import { getCustomer, type CustomerStatus } from "@/server/customers";

export const dynamic = "force-dynamic";

const statusStyle: Record<CustomerStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  VIP: "bg-gold/10 text-gold ring-gold/20",
  New: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/fryo-kanji/customers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-200 text-xl font-bold shrink-0">
            {customer.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">{customer.name}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ring-1 tracking-wide ${statusStyle[customer.status]}`}>{customer.status}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 tracking-wide"><Mail className="w-3.5 h-3.5" /> {customer.email}</p>
            <p className="text-xs text-slate-600 mt-1 tracking-wide">Joined {customer.joined}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-royal/20 rounded-lg border border-white/8 p-4">
            <div className="flex items-center gap-2 text-slate-500"><ShoppingBag className="w-4 h-4" /><span className="text-xs tracking-widest uppercase">Orders</span></div>
            <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{customer.orders}</p>
          </div>
          <div className="bg-royal/20 rounded-lg border border-white/8 p-4">
            <div className="flex items-center gap-2 text-slate-500"><Wallet className="w-4 h-4" /><span className="text-xs tracking-widest uppercase">Total Spent</span></div>
            <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{customer.spent}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-6 tracking-wide">
          Edit this customer from the <Link href="/fryo-kanji/customers" className="text-gold hover:text-gold-light">Customers list</Link>.
        </p>
      </div>
    </div>
  );
}
