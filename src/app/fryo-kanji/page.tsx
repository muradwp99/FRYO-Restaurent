import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

/* ── helpers ── */
function statChange(pct: number) {
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}
    >
      <ArrowUpRight className={`w-3.5 h-3.5 ${up ? "" : "rotate-180"}`} />
      {Math.abs(pct)}% vs last month
    </span>
  );
}

/* ── Revenue chart (SVG) ── */
function RevenueChart() {
  const data = [3200, 4100, 3650, 5200, 6800, 7200, 5100];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const yLabels = ["$2k", "$4k", "$6k", "$8k"];

  const W = 500, H = 140;
  const padL = 36, padR = 10, padT = 10, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const max = 8000, min = 0;

  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - ((v - min) / (max - min)) * chartH,
  }));

  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i], dx = (c.x - p.x) / 3;
    linePath += ` C ${p.x + dx} ${p.y} ${c.x - dx} ${c.y} ${c.x} ${c.y}`;
  }
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1].x} ${H - padB} L ${pts[0].x} ${H - padB} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {yLabels.map((_, i) => {
          const y = padT + (i / (yLabels.length - 1)) * chartH;
          return (
            <line
              key={i}
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}
        {/* area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />
        {/* line */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />
        ))}
        {/* x labels */}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 4}
            textAnchor="middle"
            fontSize="9"
            fill="#94a3b8"
            fontFamily="ui-sans-serif,system-ui,sans-serif"
          >
            {labels[i]}
          </text>
        ))}
        {/* y labels */}
        {yLabels.map((label, i) => {
          const y = padT + chartH - (i / (yLabels.length - 1)) * chartH;
          return (
            <text
              key={i}
              x={padL - 4}
              y={y + 3.5}
              textAnchor="end"
              fontSize="8.5"
              fill="#94a3b8"
              fontFamily="ui-sans-serif,system-ui,sans-serif"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Popular dishes ── */
const popularDishes = [
  { name: "Classic Smash Burger", orders: 342, pct: 100, color: "#10b981" },
  { name: "FRYO Fries (Large)", orders: 287, pct: 84, color: "#f59e0b" },
  { name: "Super Charger Wrap", orders: 218, pct: 64, color: "#3b82f6" },
  { name: "BBQ Stack Burger", orders: 195, pct: 57, color: "#8b5cf6" },
];

/* ── Recent orders ── */
const recentOrders = [
  { id: "ORD-1042", customer: "Alex Johnson", items: "Classic Burger ×2, Fries ×1", amount: "$32.40", status: "Preparing", time: "2m ago" },
  { id: "ORD-1041", customer: "Maria Garcia", items: "Super Wrap ×1, Lemonade ×2", amount: "$18.70", status: "Ready", time: "8m ago" },
  { id: "ORD-1040", customer: "James Lee", items: "BBQ Stack ×1", amount: "$14.20", status: "Delivered", time: "14m ago" },
  { id: "ORD-1039", customer: "Priya Patel", items: "Classic Burger ×1, Fries ×2", amount: "$24.60", status: "Pending", time: "21m ago" },
  { id: "ORD-1038", customer: "Tom Wilson", items: "Super Wrap ×2, FRYO Fries ×1", amount: "$31.50", status: "Delivered", time: "35m ago" },
];

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Preparing: "bg-blue-50 text-blue-700 ring-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Delivered: "bg-slate-100 text-slate-500 ring-slate-200",
};

/* ── Page ── */
export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Saturday, 28 June 2026 — here's what's happening at FRYO today.
          </p>
        </div>
        <Link
          href="/fryo-kanji/orders"
          className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          View All Orders <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "$32,840",
            change: 18.2,
            icon: DollarSign,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
          {
            label: "Total Orders",
            value: "847",
            change: 12.4,
            icon: ShoppingBag,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },
          {
            label: "Customers",
            value: "2,341",
            change: 8.7,
            icon: Users,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
          },
          {
            label: "Avg. Order Value",
            value: "$38.77",
            change: 5.3,
            icon: TrendingUp,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${s.iconBg} p-2.5 rounded-lg flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 leading-none mb-1.5">{s.value}</p>
                {statChange(s.change)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Popular dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Revenue Overview</h3>
              <p className="text-xs text-slate-400">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs text-slate-500">Revenue</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Popular dishes */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-sm">Popular Dishes</h3>
            <Link
              href="/fryo-kanji/analytics"
              className="text-xs text-emerald-600 hover:underline font-medium"
            >
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {popularDishes.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-700 font-medium truncate pr-2">
                    {d.name}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{d.orders} orders</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Orders</h3>
          <Link
            href="/fryo-kanji/orders"
            className="text-xs text-emerald-600 hover:underline font-medium flex items-center gap-1"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Order #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Items
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/fryo-kanji/orders/1`}
                      className="font-mono text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                        {o.customer[0]}
                      </div>
                      <span className="text-slate-800 font-medium text-sm">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-slate-500 text-xs">{o.items}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">{o.amount}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${statusStyle[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {o.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
