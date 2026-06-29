import {
  MessageSquareText,
  Users,
  DollarSign,
  ArrowUpRight,
  Star,
  ShoppingBag,
  MoreHorizontal,
  Utensils,
  ClipboardCheck,
  FileText,
  PenTool,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  getDashboardData,
  type SeriesPoint,
  type CategorySlice,
  type StatusBar,
  type TrendingItem,
} from "@/server/dashboard";
import type { ActivityEntry, ActivityKind } from "@/server/activity";
import type { AdminOrder, OrderStatus } from "@/server/orders";

export const dynamic = "force-dynamic";

/* ─────────────────────────  Total Revenue — area chart  ───────────────────────── */
function RevenueChart({ series, peakLabel }: { series: SeriesPoint[]; peakLabel: string }) {
  const W = 720, H = 300;
  const padL = 48, padR = 16, padT = 24, padB = 34;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const rawMax = Math.max(...series.map((s) => s.value), 1);
  const max = Math.ceil(rawMax / 1000) * 1000 || 1000;

  const pts = series.map((s, i) => ({
    x: padL + (series.length === 1 ? 0 : (i / (series.length - 1)) * chartW),
    y: padT + chartH - (s.value / max) * chartH,
    ...s,
  }));

  const smooth = (p: typeof pts) => {
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1], c = p[i], dx = (c.x - a.x) / 3;
      d += ` C ${a.x + dx} ${a.y} ${c.x - dx} ${c.y} ${c.x} ${c.y}`;
    }
    return d;
  };

  const line = smooth(pts);
  const area = line + ` L ${pts[pts.length - 1].x} ${H - padB} L ${pts[0].x} ${H - padB} Z`;
  const peak = pts.reduce((a, b) => (b.value > a.value ? b : a), pts[0]);
  const yTicks = [0, max / 4, max / 2, (max * 3) / 4, max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c400" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f5c400" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => {
        const y = padT + chartH - (t / max) * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e293b" strokeWidth="1" />
            <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
              {t === 0 ? "0" : `${Math.round(t / 1000)}K`}
            </text>
          </g>
        );
      })}

      <path d={area} fill="url(#incGrad)" />
      <path d={line} fill="none" stroke="#f5c400" strokeWidth="3" strokeLinecap="round" />

      {peak.value > 0 && (
        <>
          <line x1={peak.x} y1={padT} x2={peak.x} y2={H - padB} stroke="#f5c400" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx={peak.x} cy={peak.y} r="6" fill="#f5c400" stroke="#001a40" strokeWidth="3" />
        </>
      )}

      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 10} textAnchor="middle" fontSize="10.5" fill={p.label === peakLabel ? "#cbd5e1" : "#64748b"}>
          {p.label}
        </text>
      ))}
    </svg>
  );
}

/* ─────────────────────────  Top Categories — donut  ───────────────────────── */
const CAT_COLORS = ["#f5c400", "#ffdc5f", "#102a71", "#475569", "#1e3a8a"];

function TopCategories({ segs }: { segs: CategorySlice[] }) {
  const total = segs.reduce((s, x) => s + x.value, 0) || 1;
  const data = segs.map((s, i) => ({ ...s, pct: Math.round((s.value / total) * 100), color: CAT_COLORS[i % CAT_COLORS.length] }));
  const R = 54, cx = 70, cy = 70, sw = 22, circ = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#102a71" strokeOpacity="0.4" strokeWidth={sw} />
        {data.map((s, i) => {
          const dash = (s.value / total) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="grid grid-cols-1 gap-2.5 flex-1">
        {data.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-300 tracking-wide truncate">{s.label}</span>
            <span className="text-xs font-semibold text-white ml-auto tracking-wide">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  Orders Overview — bar chart  ───────────────────────── */
function OrdersOverview({ data }: { data: SeriesPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const peak = data.reduce((a, b, i) => (b.value > data[a].value ? i : a), 0);

  return (
    <div className="relative flex items-end gap-3 h-48 pt-8">
      {data.map((d, i) => {
        const active = i === peak && d.value > 0;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative">
            {active && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-navy border border-white/10 rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap">
                <p className="text-[10px] text-slate-400 leading-none tracking-wide">{d.label}</p>
                <p className="text-xs font-bold text-white leading-tight mt-0.5">
                  {d.value} <span className="font-normal text-slate-400">orders</span>
                </p>
              </div>
            )}
            <div
              className={`w-full max-w-[42px] rounded-t-lg transition-all ${active ? "bg-gold shadow-lg shadow-gold/20" : "bg-white/10"}`}
              style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 6 : 2)}%` }}
            />
            <span className={`text-xs tracking-wide ${active ? "text-white font-semibold" : "text-slate-500"}`}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  styling maps  ───────────────────────── */
const statusStyle: Record<OrderStatus, string> = {
  Pending: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  Preparing: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Ready: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  Delivered: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Cancelled: "bg-white/5 text-slate-400 ring-white/10",
};

const activityIcon: Record<ActivityKind, LucideIcon> = {
  menu: Utensils,
  order: ClipboardCheck,
  review: Star,
  user: UserCog,
  content: FileText,
  finance: DollarSign,
  blog: PenTool,
};

/* ─────────────────────────  Page  ───────────────────────── */
export default async function DashboardPage() {
  const data = await getDashboardData();

  const statCards = [
    { label: "Total Orders", value: data.stats.orders, icon: MessageSquareText },
    { label: "Total Customers", value: data.stats.customers, icon: Users },
    { label: "Total Revenue", value: data.stats.revenue, icon: DollarSign },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-5 max-w-[1600px]">
      {/* ===== Main column ===== */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gold/12 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium tracking-wide">{s.label}</p>
                    <p className="text-2xl font-bold text-white leading-tight tracking-tight">{s.value}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-normal flex items-center gap-1 mt-3 tracking-wide">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Live
                  <span className="ml-1">from store</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Revenue + Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs text-slate-400 font-medium tracking-wide">Total Revenue</p>
                <p className="text-2xl font-bold text-white tracking-tight">{data.totalRevenue}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <span className="text-xs text-slate-400 tracking-wide">Revenue by month</span>
              </div>
            </div>
            <RevenueChart series={data.revenueSeries} peakLabel={data.revenuePeak.label} />
          </div>

          <div className="lg:col-span-2 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white text-sm tracking-wide">Top Categories</h3>
              <span className="text-xs text-slate-500 tracking-wide">Menu mix</span>
            </div>
            {data.categories.length ? (
              <TopCategories segs={data.categories} />
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">No menu items yet.</p>
            )}
          </div>
        </div>

        {/* Orders Overview + Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm tracking-wide">Orders Overview</h3>
              <span className="text-xs text-slate-500 tracking-wide">By weekday</span>
            </div>
            <OrdersOverview data={data.ordersByWeekday} />
          </div>

          <div className="lg:col-span-2 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-sm tracking-wide">Order Status</h3>
              <span className="text-xs text-slate-500 tracking-wide">All time</span>
            </div>
            <div className="space-y-5">
              {data.statusBreakdown.map((t: StatusBar) => (
                <div key={t.label}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-sm text-slate-200 font-medium tracking-wide">{t.label}</span>
                    <span className="text-xs text-slate-500 tracking-wide">{t.pct}%</span>
                    <span className="text-sm font-semibold text-white ml-auto tracking-wide">{t.count}</span>
                  </div>
                  <div className="h-2 bg-royal/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white text-sm tracking-wide">Recent Orders</h3>
            <Link href="/fryo-kanji/orders" className="text-xs font-semibold text-navy bg-gold hover:bg-gold-light px-3.5 py-2 rounded-lg transition-colors tracking-wide">
              See All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-royal/20 border-b border-white/8">
                  {["Order ID", "Items", "Amount", "Customer", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentOrders.map((o: AdminOrder) => (
                  <tr key={o.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300 tracking-wide whitespace-nowrap">
                      <Link href={`/fryo-kanji/orders/${o.id}`} className="hover:text-gold transition-colors">{o.id}</Link>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-slate-100 font-medium tracking-wide truncate">{o.items}</p>
                      <p className="text-xs text-slate-500 tracking-wide">{o.time}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white tracking-wide whitespace-nowrap">{o.amount}</td>
                    <td className="px-5 py-3.5 text-slate-200 tracking-wide whitespace-nowrap">{o.customer}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 tracking-wide whitespace-nowrap ${statusStyle[o.status]}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Right rail ===== */}
      <aside className="xl:w-80 shrink-0 space-y-5">
        {/* Trending Menus */}
        <div className="bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm tracking-wide">Top Rated Menus</h3>
            <span className="text-xs text-slate-500 tracking-wide">By rating</span>
          </div>
          <div className="space-y-4">
            {data.trending.map((m: TrendingItem) => (
              <Link key={m.id} href={`/fryo-kanji/foods/${m.id}`} className="block group">
                <div className="h-32 rounded-xl bg-linear-to-br from-navy to-royal border border-white/8 overflow-hidden mb-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 text-sm tracking-wide truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 tracking-wide">{m.category}</p>
                  </div>
                  <span className="font-bold text-white text-sm shrink-0 tracking-wide">{m.price}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-300 tracking-wide">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" /> {m.rating}
                  </span>
                </div>
              </Link>
            ))}
            {data.trending.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No menu items yet.</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm tracking-wide">Recent Activity</h3>
            <Link href="/fryo-kanji/system/activity" className="text-slate-500 hover:text-slate-300">
              <MoreHorizontal className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-1">
            {data.activity.map((a: ActivityEntry, i: number) => {
              const Icon = activityIcon[a.kind] ?? ClipboardCheck;
              const last = i === data.activity.length - 1;
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-royal/40 border border-white/8 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    {!last && <div className="w-px flex-1 bg-white/8 my-1" />}
                  </div>
                  <div className={`min-w-0 ${last ? "" : "pb-4"}`}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100 tracking-wide">{a.actor}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-slate-300 tracking-wide capitalize">{a.kind}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed tracking-wide">{a.action}</p>
                    <p className="text-[11px] text-slate-600 mt-1 tracking-wide">{a.time}</p>
                  </div>
                </div>
              );
            })}
            {data.activity.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No activity yet.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
