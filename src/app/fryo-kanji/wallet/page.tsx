import { DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight } from "lucide-react";

const transactions = [
  { id: "TXN-9821", desc: "Order ORD-1042 payment", type: "credit", amount: "+$32.40", date: "28 Jun 2026, 11:32 AM" },
  { id: "TXN-9820", desc: "Order ORD-1041 payment", type: "credit", amount: "+$18.70", date: "28 Jun 2026, 11:24 AM" },
  { id: "TXN-9819", desc: "Supplier invoice – Beef supplies", type: "debit", amount: "-$1,240.00", date: "27 Jun 2026, 09:00 AM" },
  { id: "TXN-9818", desc: "Order ORD-1040 payment", type: "credit", amount: "+$14.20", date: "27 Jun 2026, 08:48 AM" },
  { id: "TXN-9817", desc: "Staff payroll – Week 26", type: "debit", amount: "-$3,200.00", date: "27 Jun 2026, 08:00 AM" },
  { id: "TXN-9816", desc: "Order ORD-1039 payment", type: "credit", amount: "+$24.60", date: "26 Jun 2026, 20:12 PM" },
  { id: "TXN-9815", desc: "Utility bill – June", type: "debit", amount: "-$480.00", date: "26 Jun 2026, 08:00 AM" },
  { id: "TXN-9814", desc: "Order ORD-1038 payment", type: "credit", amount: "+$31.50", date: "25 Jun 2026, 19:35 PM" },
];

const expenses = [
  { label: "Food Supplies", amount: "$8,240", pct: 42, color: "#f5c400" },
  { label: "Staff & Payroll", amount: "$6,400", pct: 33, color: "#102a71" },
  { label: "Utilities", amount: "$1,920", pct: 10, color: "#ffdc5f" },
  { label: "Marketing", amount: "$1,400", pct: 7, color: "#3b82f6" },
  { label: "Other", amount: "$1,560", pct: 8, color: "#1e3a5f" },
];

export default function WalletPage() {
  return (
    <div className="space-y-5 max-w-300">
      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main balance — brand gold */}
        <div className="sm:col-span-1 bg-linear-to-br from-navy to-royal rounded-xl p-6 border border-gold/30 shadow-lg shadow-gold/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-gold" />
            </div>
            <span className="text-sm font-medium text-slate-300 tracking-wide">Current Balance</span>
          </div>
          <p className="text-4xl font-black text-white mb-1.5 tracking-tight">$18,320</p>
          <p className="text-slate-400 text-sm flex items-center gap-1 tracking-wide">
            <ArrowUpRight className="w-3.5 h-3.5 text-gold" /> +$2,840 this week
          </p>
        </div>

        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-400/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-400 tracking-wide">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">$32,840</p>
          <p className="text-xs text-slate-600 mt-0.5 tracking-wide">This month</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-0.5 mt-2 tracking-wide">
            <ArrowUpRight className="w-3 h-3" /> +18.2% vs last month
          </p>
        </div>

        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-400/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm font-medium text-slate-400 tracking-wide">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">$19,520</p>
          <p className="text-xs text-slate-600 mt-0.5 tracking-wide">This month</p>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-0.5 mt-2 tracking-wide">
            <ArrowUpRight className="w-3 h-3" /> Net: $13,320 profit
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Transactions */}
        <div className="lg:col-span-2 bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white text-sm tracking-wide">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((t) => (
              <div key={t.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-royal/10 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                  <DollarSign className={`w-4 h-4 ${t.type === "credit" ? "text-emerald-400" : "text-red-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate tracking-wide">{t.desc}</p>
                  <p className="text-xs text-slate-600 mt-0.5 tracking-wide">{t.date}</p>
                </div>
                <span className={`font-semibold text-sm shrink-0 tracking-wide ${t.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {expenses.map((e) => (
              <div key={e.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 font-medium tracking-wide">{e.label}</span>
                  <span className="text-xs text-slate-500 tracking-wide">{e.amount}</span>
                </div>
                <div className="h-2 bg-royal/30 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: e.color }} />
                </div>
                <p className="text-xs text-slate-600 mt-1 tracking-wide">{e.pct}% of expenses</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/8">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300 tracking-wide">Net Profit</span>
              <span className="font-bold text-emerald-400 tracking-wide">$13,320</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 tracking-wide">40.5% profit margin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
