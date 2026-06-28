import {
  MessageSquareText,
  Users,
  DollarSign,
  ArrowUpRight,
  Star,
  ShoppingBag,
  Soup,
  Utensils,
  Monitor,
  Package,
  ClipboardCheck,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────  Total Revenue — dual-line area chart  ───────────────────────── */
function RevenueChart() {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const income = [8000, 10200, 9100, 12000, 16580, 13800, 15200, 14600];
  const expense = [4800, 6000, 5400, 7000, 8200, 6800, 7400, 6600];

  const W = 720, H = 300;
  const padL = 44, padR = 16, padT = 24, padB = 34;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const max = 20000;

  const xy = (arr: number[]) =>
    arr.map((v, i) => ({
      x: padL + (i / (arr.length - 1)) * chartW,
      y: padT + chartH - (v / max) * chartH,
    }));

  const smooth = (pts: { x: number; y: number }[]) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], c = pts[i], dx = (c.x - p.x) / 3;
      d += ` C ${p.x + dx} ${p.y} ${c.x - dx} ${c.y} ${c.x} ${c.y}`;
    }
    return d;
  };

  const incPts = xy(income);
  const expPts = xy(expense);
  const incLine = smooth(incPts);
  const incArea = incLine + ` L ${incPts[incPts.length - 1].x} ${H - padB} L ${incPts[0].x} ${H - padB} Z`;
  const peak = incPts[4]; // Jul
  const yTicks = [0, 5000, 10000, 15000, 20000];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c400" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f5c400" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {yTicks.map((t, i) => {
          const y = padT + chartH - (t / max) * chartH;
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e293b" strokeWidth="1" />
              <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                {t === 0 ? "0" : `${t / 1000}K`}
              </text>
            </g>
          );
        })}

        {/* income area + line */}
        <path d={incArea} fill="url(#incGrad)" />
        <path d={incLine} fill="none" stroke="#f5c400" strokeWidth="3" strokeLinecap="round" />
        {/* expense line */}
        <path d={smooth(expPts)} fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0" />

        {/* peak marker */}
        <line x1={peak.x} y1={padT} x2={peak.x} y2={H - padB} stroke="#f5c400" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx={peak.x} cy={peak.y} r="6" fill="#f5c400" stroke="#001a40" strokeWidth="3" />

        {/* x labels */}
        {incPts.map((p, i) => (
          <text key={i} x={p.x} y={H - 10} textAnchor="middle" fontSize="10.5" fill="#64748b">
            {months[i]}
          </text>
        ))}
      </svg>

      {/* tooltip on peak */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full bg-navy border border-white/10 rounded-lg px-3 py-1.5 shadow-xl pointer-events-none"
        style={{ left: `${(peak.x / W) * 100}%`, top: `${(peak.y / H) * 100}%` }}
      >
        <p className="text-[10px] text-slate-400 leading-none tracking-wide">July 2035</p>
        <p className="text-sm font-bold text-white leading-tight mt-0.5 tracking-tight">$16,580</p>
      </div>
    </div>
  );
}

/* ─────────────────────────  Top Categories — donut  ───────────────────────── */
function TopCategories() {
  const segs = [
    { label: "Seafood", value: 30, color: "#f5c400" },
    { label: "Beverages", value: 25, color: "#ffdc5f" },
    { label: "Dessert", value: 25, color: "#102a71" },
    { label: "Pasta", value: 20, color: "#475569" },
  ];
  const R = 54, cx = 70, cy = 70, sw = 22, circ = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#102a71" strokeOpacity="0.4" strokeWidth={sw} />
        {segs.map((s, i) => {
          const dash = (s.value / 100) * circ;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="grid grid-cols-1 gap-2.5 flex-1">
        {segs.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-300 tracking-wide">{s.label}</span>
            <span className="text-xs font-semibold text-white ml-auto tracking-wide">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  Orders Overview — bar chart  ───────────────────────── */
function OrdersOverview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const vals = [120, 95, 140, 185, 150, 130, 145];
  const max = 200;
  const peak = 3;

  return (
    <div className="relative flex items-end gap-3 h-48 pt-8">
      {vals.map((v, i) => {
        const active = i === peak;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative">
            {active && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-navy border border-white/10 rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap">
                <p className="text-[10px] text-slate-400 leading-none tracking-wide">Thursday</p>
                <p className="text-xs font-bold text-white leading-tight mt-0.5">
                  185 <span className="font-normal text-slate-400">orders</span>
                </p>
              </div>
            )}
            <div
              className={`w-full max-w-[42px] rounded-t-lg transition-all ${active ? "bg-gold shadow-lg shadow-gold/20" : "bg-white/10"}`}
              style={{ height: `${(v / max) * 100}%` }}
            />
            <span className={`text-xs tracking-wide ${active ? "text-white font-semibold" : "text-slate-500"}`}>
              {days[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  Order Types — horizontal bars  ───────────────────────── */
const orderTypes = [
  { label: "Dine-In", pct: 45, count: 900, icon: Soup },
  { label: "Takeaway", pct: 30, count: 600, icon: Package },
  { label: "Online", pct: 25, count: 500, icon: Monitor },
];

/* ─────────────────────────  Data  ───────────────────────── */
const stats = [
  { label: "Total Orders", value: "48,652", change: 1.58, icon: MessageSquareText },
  { label: "Total Customer", value: "1,248", change: 0.42, icon: Users },
  { label: "Total Revenue", value: "$215,860", change: 2.36, icon: DollarSign },
];

const recentOrders = [
  { id: "ORD1025", menu: "Salmon Sushi Roll", cat: "Seafood", emoji: "🍣", qty: 3, amount: "$30.00", customer: "Dana White", status: "On Process" },
  { id: "ORD1026", menu: "Spaghetti Carbonara", cat: "Pasta", emoji: "🍝", qty: 1, amount: "$15.00", customer: "Eve Carter", status: "Cancelled" },
  { id: "ORD1027", menu: "Classic Cheeseburger", cat: "Burger", emoji: "🍔", qty: 1, amount: "$10.00", customer: "Charlie Brown", status: "Completed" },
  { id: "ORD1028", menu: "Fiery Shrimp Salad", cat: "Seafood", emoji: "🥗", qty: 2, amount: "$24.00", customer: "Frank Miller", status: "Completed" },
];

const statusStyle: Record<string, string> = {
  "On Process": "bg-blue-400/10 text-blue-300 ring-blue-400/20",
  Completed: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Cancelled: "bg-white/5 text-slate-400 ring-white/10",
};

const trendingMenus = [
  { name: "Grilled Chicken Delight", cat: "Chicken", emoji: "🍗", rating: 4.9, orders: 350, price: "$18.00" },
  { name: "Sunny Citrus Cake", cat: "Dessert", emoji: "🍰", rating: 4.8, orders: 400, price: "$8.50" },
  { name: "Fiery Shrimp Salad", cat: "Seafood", emoji: "🥗", rating: 4.7, orders: 270, price: "$12.00" },
];

const recentActivity = [
  { name: "Sylvester Quilt", role: "Inventory Manager", text: "updated inventory — 10 units of “Organic Chicken Breast”", time: "11:20 AM", icon: Package },
  { name: "Maria Kings", role: "Kitchen Admin", text: "marked order #ORD1028 as completed", time: "11:00 AM", icon: ClipboardCheck },
  { name: "William Smith", role: "Floor Manager", text: "restocked 12 units of “Brioche Buns”", time: "10:30 AM", icon: Package },
];

/* ─────────────────────────  Page  ───────────────────────── */
export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-5 max-w-[1600px]">
      {/* ===== Main column ===== */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => {
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
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-3 tracking-wide">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {s.change}%
                  <span className="text-slate-500 font-normal ml-1">vs last week</span>
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
                <p className="text-2xl font-bold text-white tracking-tight">$184,839</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <span className="text-xs text-slate-400 tracking-wide">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-xs text-slate-400 tracking-wide">Expense</span>
                </div>
              </div>
            </div>
            <RevenueChart />
          </div>

          <div className="lg:col-span-2 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white text-sm tracking-wide">Top Categories</h3>
              <span className="text-xs text-slate-500 tracking-wide">This Month</span>
            </div>
            <TopCategories />
          </div>
        </div>

        {/* Orders Overview + Order Types */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm tracking-wide">Orders Overview</h3>
              <span className="text-xs text-slate-500 tracking-wide">This Week</span>
            </div>
            <OrdersOverview />
          </div>

          <div className="lg:col-span-2 bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-sm tracking-wide">Order Types</h3>
              <span className="text-xs text-slate-500 tracking-wide">This Month</span>
            </div>
            <div className="space-y-5">
              {orderTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.label}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-slate-300" />
                      </div>
                      <span className="text-sm text-slate-200 font-medium tracking-wide">{t.label}</span>
                      <span className="text-xs text-slate-500 tracking-wide">{t.pct}%</span>
                      <span className="text-sm font-semibold text-white ml-auto tracking-wide">{t.count}</span>
                    </div>
                    <div className="h-2 bg-royal/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${t.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-ink-2 rounded-2xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white text-sm tracking-wide">Recent Orders</h3>
            <Link
              href="/fryo-kanji/orders"
              className="text-xs font-semibold text-navy bg-gold hover:bg-gold-light px-3.5 py-2 rounded-lg transition-colors tracking-wide"
            >
              See All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-royal/20 border-b border-white/8">
                  {["Order ID", "Menu", "Qty", "Amount", "Customer", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-royal/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300 tracking-wide">{o.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-navy to-royal border border-white/8 flex items-center justify-center text-lg shrink-0">
                          {o.emoji}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-100 font-medium tracking-wide truncate">{o.menu}</p>
                          <p className="text-xs text-slate-500 tracking-wide">{o.cat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 tracking-wide">{o.qty}</td>
                    <td className="px-5 py-3.5 font-semibold text-white tracking-wide">{o.amount}</td>
                    <td className="px-5 py-3.5 text-slate-200 tracking-wide whitespace-nowrap">{o.customer}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 tracking-wide whitespace-nowrap ${statusStyle[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <h3 className="font-semibold text-white text-sm tracking-wide">Trending Menus</h3>
            <span className="text-xs text-slate-500 tracking-wide">This Week</span>
          </div>
          <div className="space-y-4">
            {trendingMenus.map((m) => (
              <div key={m.name} className="group">
                <div className="h-32 rounded-xl bg-linear-to-br from-navy to-royal border border-white/8 flex items-center justify-center text-5xl mb-2.5">
                  {m.emoji}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 text-sm tracking-wide truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 tracking-wide">{m.cat}</p>
                  </div>
                  <span className="font-bold text-white text-sm shrink-0 tracking-wide">{m.price}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-300 tracking-wide">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" /> {m.rating}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 tracking-wide">
                    <ShoppingBag className="w-3.5 h-3.5" /> {m.orders}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-ink-2 rounded-2xl border border-white/8 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm tracking-wide">Recent Activity</h3>
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-1">
            {recentActivity.map((a, i) => {
              const Icon = a.icon;
              const last = i === recentActivity.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-royal/40 border border-white/8 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-300" />
                    </div>
                    {!last && <div className="w-px flex-1 bg-white/8 my-1" />}
                  </div>
                  <div className={`min-w-0 ${last ? "" : "pb-4"}`}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100 tracking-wide">{a.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-slate-300 tracking-wide">{a.role}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed tracking-wide">{a.text}</p>
                    <p className="text-[11px] text-slate-600 mt-1 tracking-wide">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
