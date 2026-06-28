import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle2, Circle, XCircle } from "lucide-react";
import { getOrder, type OrderStatus } from "@/server/orders";

export const dynamic = "force-dynamic";

const statusStyle: Record<OrderStatus, string> = {
  Pending: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  Preparing: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Ready: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Delivered: "bg-white/5 text-slate-400 ring-white/10",
  Cancelled: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

const FLOW: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const cancelled = order.status === "Cancelled";
  const currentIdx = FLOW.indexOf(order.status);

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/fryo-kanji/orders" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide font-mono">{order.id}</h1>
            <p className="text-sm text-slate-500 mt-1 tracking-wide">{order.date} · {order.time}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ring-1 tracking-wide ${statusStyle[order.status]}`}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-royal/20 rounded-lg border border-white/8 p-4">
            <p className="text-xs text-slate-500 tracking-widest uppercase">Customer</p>
            <p className="text-sm font-semibold text-white mt-1 tracking-wide">{order.customer}</p>
          </div>
          <div className="bg-royal/20 rounded-lg border border-white/8 p-4">
            <p className="text-xs text-slate-500 tracking-widest uppercase">Total</p>
            <p className="text-sm font-semibold text-white mt-1 tracking-wide">{order.amount}</p>
          </div>
          <div className="sm:col-span-2 bg-royal/20 rounded-lg border border-white/8 p-4">
            <p className="text-xs text-slate-500 tracking-widest uppercase">Items</p>
            <p className="text-sm text-slate-200 mt-1 tracking-wide">{order.items}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <p className="text-xs text-slate-500 tracking-widest uppercase mb-3">Progress</p>
          {cancelled ? (
            <div className="flex items-center gap-2 text-rose-300 text-sm tracking-wide">
              <XCircle className="w-5 h-5" /> Order cancelled
            </div>
          ) : (
            <div className="space-y-3">
              {FLOW.map((stage, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={stage} className="flex items-center gap-3">
                    {done ? <CheckCircle2 className="w-5 h-5 text-gold" /> : <Circle className="w-5 h-5 text-slate-600" />}
                    <span className={`text-sm tracking-wide ${done ? "text-slate-200 font-medium" : "text-slate-600"}`}>{stage}</span>
                    {i === currentIdx && <Clock className="w-3.5 h-3.5 text-gold ml-1" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-6 tracking-wide">
          Update status from the <Link href="/fryo-kanji/orders" className="text-gold hover:text-gold-light">Orders list</Link>.
        </p>
      </div>
    </div>
  );
}
