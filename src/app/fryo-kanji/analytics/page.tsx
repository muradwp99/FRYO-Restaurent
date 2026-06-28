import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight } from "lucide-react";

function BarChart({ data, labels, color = "#f5c400" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium tracking-wide">${(v / 1000).toFixed(1)}k</span>
          <div className="w-full rounded-t-md transition-all opacity-90 hover:opacity-100" style={{ height: `${(v / max) * 100}%`, background: color }} />
          <span className="text-xs text-slate-600 tracking-wide">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function BarChartRaw({ data, labels, color = "#f5c400" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-t-md transition-all opacity-90 hover:opacity-100" style={{ height: `${(v / max) * 100}%`, background: color }} />
          <span className="text-xs text-slate-600 tracking-wide">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const R = 50, cx = 60, cy = 60, strokeW = 18;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#102a71" strokeWidth={strokeW} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={seg.color} strokeWidth={strokeW}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-2.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-400 tracking-wide">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-200 ml-auto pl-4 tracking-wide">
              {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const monthlyRevenue = [18200, 21400, 19800, 24600, 28100, 32840];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const peakHours = [12, 28, 45, 62, 88, 100, 72, 40, 18, 8, 5, 10];
const hourLabels = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const categorySegments = [
  { label: "Burgers", value: 48, color: "#f5c400" },
  { label: "Wraps", value: 28, color: "#102a71" },
  { label: "Sides & Fries", value: 16, color: "#ffdc5f" },
  { label: "Drinks", value: 8, color: "#3b82f6" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-5 max-w-350">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "$32,840", change: 18.2, icon: DollarSign, iconBg: "bg-gold/10", iconColor: "text-gold" },
          { label: "Monthly Orders", value: "847", change: 12.4, icon: ShoppingBag, iconBg: "bg-blue-400/10", iconColor: "text-blue-400" },
          { label: "New Customers", value: "142", change: 8.7, icon: Users, iconBg: "bg-royal/50", iconColor: "text-slate-300" },
          { label: "Revenue / Order", value: "$38.77", change: 5.3, icon: TrendingUp, iconBg: "bg-gold/10", iconColor: "text-gold" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{s.value}</p>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-0.5 mt-1.5 tracking-wide">
                <ArrowUpRight className="w-3 h-3" /> {s.change}% this month
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Monthly Revenue</h3>
          <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">Jan – Jun 2026</p>
          <BarChart data={monthlyRevenue} labels={monthLabels} color="#f5c400" />
        </div>
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Sales by Category</h3>
          <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">Based on this month&apos;s orders</p>
          <DonutChart segments={categorySegments} />
        </div>
      </div>

      {/* Peak hours */}
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
        <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Peak Order Hours</h3>
        <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">Order volume by hour (average, last 30 days)</p>
        <BarChartRaw data={peakHours} labels={hourLabels} color="#102a71" />
      </div>

      {/* Top items table */}
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="font-semibold text-white text-sm tracking-wide">Top Performing Items</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-royal/20 border-b border-white/8">
              {["Rank", "Item", "Orders", "Revenue", "Avg. Price", "Share"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { rank: 1, name: "Classic Smash Burger", orders: 342, revenue: "$4,240.80", avg: "$12.40", share: 40 },
              { rank: 2, name: "FRYO Fries (Large)", orders: 287, revenue: "$1,664.60", avg: "$5.80", share: 34 },
              { rank: 3, name: "Super Charger Wrap", orders: 218, revenue: "$2,836.40", avg: "$13.01", share: 26 },
              { rank: 4, name: "BBQ Stack Burger", orders: 195, revenue: "$2,769.00", avg: "$14.20", share: 23 },
              { rank: 5, name: "Lemonade", orders: 164, revenue: "$656.00", avg: "$4.00", share: 19 },
            ].map((item) => (
              <tr key={item.rank} className="hover:bg-royal/10 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-600 tracking-wide">#{item.rank}</td>
                <td className="px-5 py-3.5 font-medium text-slate-200 tracking-wide">{item.name}</td>
                <td className="px-5 py-3.5 text-slate-400 tracking-wide">{item.orders}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-200 tracking-wide">{item.revenue}</td>
                <td className="px-5 py-3.5 text-slate-500 tracking-wide">{item.avg}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-royal/40 rounded-full flex-1 max-w-20">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${item.share}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 tracking-wide">{item.share}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
