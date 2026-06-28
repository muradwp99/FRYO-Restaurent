import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, DollarSign, Star } from "lucide-react";

const customer = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 (555) 012-3456",
  address: "42 Maple Street, New York, NY 10001",
  joined: "January 2025",
  status: "Active",
  stats: { orders: 24, spent: "$742.80", avgOrder: "$30.95", rating: 4.8 },
  orders: [
    { id: "ORD-1042", date: "28 Jun 2026", items: "Classic Burger ×2, Fries ×1", amount: "$32.40", status: "Preparing" },
    { id: "ORD-1019", date: "14 Jun 2026", items: "Super Wrap ×2", amount: "$28.40", status: "Delivered" },
    { id: "ORD-0998", date: "01 Jun 2026", items: "BBQ Stack ×1, Cola ×2", amount: "$19.00", status: "Delivered" },
    { id: "ORD-0965", date: "18 May 2026", items: "Classic Burger ×3, Fries ×2", amount: "$48.60", status: "Delivered" },
  ],
};

const statusStyle: Record<string, string> = {
  Preparing: "bg-blue-50 text-blue-700 ring-blue-200",
  Delivered: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function CustomerDetailPage() {
  return (
    <div className="space-y-5 max-w-5xl">
      <Link
        href="/fryo-kanji/customers"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {customer.name[0]}
            </div>
            <h2 className="font-bold text-slate-900 text-lg">{customer.name}</h2>
            <span className="mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 rounded-full text-xs font-medium">
              {customer.status}
            </span>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            {[
              { icon: Mail, label: customer.email },
              { icon: Phone, label: customer.phone },
              { icon: MapPin, label: customer.address },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-2.5 text-xs text-slate-500">
                <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">Member since {customer.joined}</p>
          </div>
        </div>

        {/* Stats + orders */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: ShoppingBag, label: "Total Orders", value: customer.stats.orders, color: "text-blue-600 bg-blue-50" },
              { icon: DollarSign, label: "Total Spent", value: customer.stats.spent, color: "text-emerald-600 bg-emerald-50" },
              { icon: DollarSign, label: "Avg. Order", value: customer.stats.avgOrder, color: "text-violet-600 bg-violet-50" },
              { icon: Star, label: "Avg. Rating", value: customer.stats.rating, color: "text-amber-600 bg-amber-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Order history */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Order History</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {customer.orders.map((o) => (
                <div key={o.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div>
                    <p className="font-mono text-xs font-semibold text-emerald-700">{o.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{o.items}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{o.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-slate-800 text-sm">{o.amount}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 mt-1 ${statusStyle[o.status]}`}>
                      {o.status}
                    </span>
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
