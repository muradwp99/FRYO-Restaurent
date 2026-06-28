import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2, Circle } from "lucide-react";

const order = {
  id: "ORD-1042",
  date: "28 Jun 2026, 11:32 AM",
  status: "Preparing",
  customer: { name: "Alex Johnson", email: "alex@example.com", phone: "+1 (555) 012-3456" },
  address: "42 Maple Street, New York, NY 10001",
  items: [
    { name: "Classic Smash Burger", qty: 2, price: "$12.40", total: "$24.80" },
    { name: "FRYO Fries (Large)", qty: 1, price: "$5.80", total: "$5.80" },
    { name: "Cola", qty: 2, price: "$2.40", total: "$4.80" },
  ],
  subtotal: "$35.40",
  tax: "$2.97",
  delivery: "$0.00",
  total: "$38.37",
};

const timeline = [
  { label: "Order Placed", time: "11:32 AM", done: true },
  { label: "Confirmed", time: "11:33 AM", done: true },
  { label: "Preparing", time: "11:35 AM", done: true },
  { label: "Ready for Pickup", time: "", done: false },
  { label: "Delivered", time: "", done: false },
];

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Preparing: "bg-blue-50 text-blue-700 ring-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Delivered: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function OrderDetailPage() {
  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back */}
      <Link
        href="/fryo-kanji/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-mono">{order.id}</h2>
          <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {order.date}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ring-1 ${statusStyle[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col — items + summary */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Order Items</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <div key={item.name} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-lg flex-shrink-0">
                      🍔
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {item.qty} × {item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">{item.total}</span>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="bg-slate-50 px-5 py-4 space-y-2 border-t border-slate-100">
              {[
                ["Subtotal", order.subtotal],
                ["Tax (8.4%)", order.tax],
                ["Delivery", order.delivery],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm text-slate-500">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              Mark as Ready
            </button>
            <button className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg transition-colors">
              Print Receipt
            </button>
            <button className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors">
              Cancel Order
            </button>
          </div>
        </div>

        {/* Right col — customer + timeline */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm">Customer</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {order.customer.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{order.customer.name}</p>
                <p className="text-xs text-slate-400">{order.customer.email}</p>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                {order.customer.phone}
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                {order.address}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Order Timeline</h3>
            <div className="relative space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
                  {i < timeline.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-6 w-px h-full -translate-x-1/2 ${step.done ? "bg-emerald-200" : "bg-slate-100"}`}
                    />
                  )}
                  <div className="flex-shrink-0 mt-0.5">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-200" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.done ? "text-slate-800" : "text-slate-300"}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-xs text-slate-400 mt-0.5">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
