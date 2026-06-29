import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";
import { getAnalyticsData } from "@/server/analytics";
import type { SeriesPoint, CategorySlice } from "@/server/dashboard";

export const dynamic = "force-dynamic";

const KPI_ICONS = [DollarSign, ShoppingBag, Users, TrendingUp];
const DONUT_COLORS = ["#f5c400", "#102a71", "#ffdc5f", "#3b82f6", "#475569", "#1e3a8a"];

function MoneyBars({ data }: { data: SeriesPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium tracking-wide">£{(d.value / 1000).toFixed(1)}k</span>
          <div className="w-full rounded-t-md transition-all opacity-90 hover:opacity-100" style={{ height: `${(d.value / max) * 100}%`, background: "#f5c400" }} />
          <span className="text-xs text-slate-600 tracking-wide">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function CountBars({ data, color = "#102a71" }: { data: SeriesPoint[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium tracking-wide">{d.value}</span>
          <div className="w-full rounded-t-md transition-all opacity-90 hover:opacity-100" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          <span className="text-xs text-slate-600 tracking-wide">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: CategorySlice[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
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
            <circle key={seg.label} cx={cx} cy={cy} r={R} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth={strokeW}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-2.5">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-xs text-slate-400 tracking-wide">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-200 ml-auto pl-4 tracking-wide">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
        {segments.length === 0 && <p className="text-xs text-slate-500 tracking-wide">No matched sales yet.</p>}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-5 max-w-350">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {data.kpis.map((s, i) => {
          const Icon = KPI_ICONS[i] ?? DollarSign;
          return (
            <div key={s.label} className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1.5 tracking-wide">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Revenue by Month</h3>
          <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">From order history</p>
          {data.monthlyRevenue.length ? <MoneyBars data={data.monthlyRevenue} /> : <p className="text-sm text-slate-500 py-10 text-center">No revenue yet.</p>}
        </div>
        <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
          <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Sales by Category</h3>
          <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">By matched item revenue</p>
          <DonutChart segments={data.categorySales} />
        </div>
      </div>

      {/* Orders by weekday */}
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] p-5">
        <h3 className="font-semibold text-white text-sm tracking-wide mb-1">Orders by Weekday</h3>
        <p className="text-xs text-slate-500 tracking-widest uppercase mb-5">Order volume across the week</p>
        <CountBars data={data.ordersByWeekday} />
      </div>

      {/* Top items table */}
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h3 className="font-semibold text-white text-sm tracking-wide">Top Performing Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-royal/20 border-b border-white/8">
                {["Rank", "Item", "Orders", "Revenue", "Avg. Price", "Share"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.topItems.map((item, i) => (
                <tr key={item.name} className="hover:bg-royal/10 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-600 tracking-wide">#{i + 1}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-200 tracking-wide">{item.name}</td>
                  <td className="px-5 py-3.5 text-slate-400 tracking-wide">{item.orders}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-200 tracking-wide">{item.revenue}</td>
                  <td className="px-5 py-3.5 text-slate-500 tracking-wide">{item.avgPrice}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-royal/40 rounded-full flex-1 max-w-20">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${item.sharePct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 tracking-wide">{item.sharePct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {data.topItems.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">No item sales matched yet — orders placed from the live menu will appear here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
