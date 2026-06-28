import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight } from "lucide-react";

/* ── Bar chart (CSS) ── */
function BarChart({ data, labels, color = "#10b981" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">${(v / 1000).toFixed(1)}k</span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${(v / max) * 100}%`, background: color }}
          />
          <span className="text-xs text-slate-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut chart (SVG) ── */
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const R = 50, cx = 60, cy = 60, strokeW = 18;
  const circ = 2 * Math.PI * R;

  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 flex-shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-600">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-800 ml-auto pl-4">
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
  { label: "Burgers", value: 48, color: "#10b981" },
  { label: "Wraps", value: 28, color: "#f59e0b" },
  { label: "Sides & Fries", value: 16, color: "#3b82f6" },
  { label: "Drinks", value: 8, color: "#8b5cf6" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "$32,840", change: 18.2, icon: DollarSign, c: "text-emerald-600 bg-emerald-50" },
          { label: "Monthly Orders", value: "847", change: 12.4, icon: ShoppingBag, c: "text-blue-600 bg-blue-50" },
          { label: "New Customers", value: "142", change: 8.7, icon: Users, c: "text-violet-600 bg-violet-50" },
          { label: "Revenue / Order", value: "$38.77", change: 5.3, icon: TrendingUp, c: "text-amber-600 bg-amber-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className={`w-8 h-8 rounded-lg ${s.c} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.value}</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> {s.change}% this month
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly revenue bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-1">Monthly Revenue</h3>
          <p className="text-xs text-slate-400 mb-5">Jan – Jun 2026</p>
          <BarChart data={monthlyRevenue} labels={monthLabels} color="#10b981" />
        </div>

        {/* Category breakdown donut */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-1">Sales by Category</h3>
          <p className="text-xs text-slate-400 mb-5">Based on this month's orders</p>
          <DonutChart segments={categorySegments} />
        </div>
      </div>

      {/* Peak hours */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-1">Peak Order Hours</h3>
        <p className="text-xs text-slate-400 mb-5">Order volume by hour (average, last 30 days)</p>
        <BarChart data={peakHours} labels={hourLabels} color="#f59e0b" />
      </div>

      {/* Top items table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Top Performing Items</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Rank", "Item", "Orders", "Revenue", "Avg. Price", "Share"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { rank: 1, name: "Classic Smash Burger", orders: 342, revenue: "$4,240.80", avg: "$12.40", share: 40 },
              { rank: 2, name: "FRYO Fries (Large)", orders: 287, revenue: "$1,664.60", avg: "$5.80", share: 34 },
              { rank: 3, name: "Super Charger Wrap", orders: 218, revenue: "$2,836.40", avg: "$13.01", share: 26 },
              { rank: 4, name: "BBQ Stack Burger", orders: 195, revenue: "$2,769.00", avg: "$14.20", share: 23 },
              { rank: 5, name: "Lemonade", orders: 164, revenue: "$656.00", avg: "$4.00", share: 19 },
            ].map((item) => (
              <tr key={item.rank} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-400">#{item.rank}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{item.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{item.orders}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{item.revenue}</td>
                <td className="px-5 py-3.5 text-slate-500">{item.avg}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-slate-100 rounded-full flex-1 max-w-[80px]">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.share}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{item.share}%</span>
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
