import "server-only";
import { listOrders, type OrderStatus } from "./orders";
import { listMenu } from "./menu";
import { listCustomers } from "./customers";
import { parseAmount, formatGBP, type SeriesPoint, type CategorySlice } from "./dashboard";

export type AnalyticsKpi = { label: string; value: string; sub: string };
export type TopItem = { name: string; orders: number; revenue: string; avgPrice: string; sharePct: number };

export type AnalyticsData = {
  kpis: AnalyticsKpi[];
  monthlyRevenue: SeriesPoint[];
  ordersByWeekday: SeriesPoint[];
  categorySales: CategorySlice[];
  topItems: TopItem[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseDate(s: string): Date | null {
  const m = /(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/.exec(s || "");
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].slice(0, 3));
  if (month < 0) return null;
  return new Date(Number(m[3]), month, Number(m[1]));
}

/** "Classic Burger ×2" → { name: "Classic Burger", qty: 2 } */
function parseLine(line: string): { name: string; qty: number } {
  const m = /^(.*?)\s*[×x*]\s*(\d+)$/.exec(line.trim());
  if (m) return { name: m[1].trim(), qty: Number(m[2]) };
  return { name: line.trim(), qty: 1 };
}

const isRevenue = (status: OrderStatus) => status !== "Cancelled";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const [orders, menu, customers] = await Promise.all([listOrders(), listMenu(), listCustomers()]);

  // Index menu by lowercased name for best-effort matching of order line items.
  const byName = new Map(menu.map((m) => [m.name.toLowerCase(), m]));
  const matchMenu = (name: string) => {
    const n = name.toLowerCase();
    if (byName.has(n)) return byName.get(n)!;
    return menu.find((m) => {
      const mn = m.name.toLowerCase();
      return mn.includes(n) || n.includes(mn);
    });
  };

  const revenue = orders.filter((o) => isRevenue(o.status)).reduce((s, o) => s + parseAmount(o.amount), 0);
  const orderCount = orders.length || 0;

  /* Monthly revenue */
  const monthMap = new Map<string, { key: number; label: string; value: number }>();
  for (const o of orders) {
    if (!isRevenue(o.status)) continue;
    const d = parseDate(o.date);
    if (!d) continue;
    const label = MONTHS[d.getMonth()];
    const cur = monthMap.get(label) ?? { key: d.getFullYear() * 12 + d.getMonth(), label, value: 0 };
    cur.value += parseAmount(o.amount);
    monthMap.set(label, cur);
  }
  const monthlyRevenue: SeriesPoint[] = [...monthMap.values()]
    .sort((a, b) => a.key - b.key)
    .map((m) => ({ label: m.label, value: Math.round(m.value) }));

  /* Orders per weekday */
  const wk = new Array(7).fill(0);
  for (const o of orders) {
    const d = parseDate(o.date);
    if (d) wk[(d.getDay() + 6) % 7] += 1;
  }
  const ordersByWeekday: SeriesPoint[] = WEEKDAYS.map((label, i) => ({ label, value: wk[i] }));

  /* Item + category aggregation from line items matched to the menu */
  const itemAgg = new Map<string, { name: string; qty: number; revenue: number; price: number }>();
  const catAgg = new Map<string, number>();
  for (const o of orders) {
    if (!isRevenue(o.status)) continue;
    for (const raw of o.items.split(",")) {
      if (!raw.trim()) continue;
      const { name, qty } = parseLine(raw);
      const item = matchMenu(name);
      if (!item) continue;
      const rev = qty * item.price;
      const cur = itemAgg.get(item.id) ?? { name: item.name, qty: 0, revenue: 0, price: item.price };
      cur.qty += qty;
      cur.revenue += rev;
      itemAgg.set(item.id, cur);
      catAgg.set(item.category, (catAgg.get(item.category) ?? 0) + rev);
    }
  }

  const categorySales: CategorySlice[] = [...catAgg.entries()]
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  const aggList = [...itemAgg.values()].sort((a, b) => b.revenue - a.revenue);
  const topRevenue = aggList[0]?.revenue || 1;
  const topItems: TopItem[] = aggList.slice(0, 6).map((it) => ({
    name: it.name,
    orders: it.qty,
    revenue: formatGBP(it.revenue),
    avgPrice: formatGBP(it.price),
    sharePct: Math.round((it.revenue / topRevenue) * 100),
  }));

  const kpis: AnalyticsKpi[] = [
    { label: "Total Revenue", value: formatGBP(revenue), sub: `${orderCount} orders` },
    { label: "Total Orders", value: orderCount.toLocaleString("en-GB"), sub: "all time" },
    { label: "Customers", value: customers.length.toLocaleString("en-GB"), sub: "registered" },
    { label: "Avg. Order Value", value: formatGBP(orderCount ? revenue / orderCount : 0), sub: "per order" },
  ];

  return { kpis, monthlyRevenue, ordersByWeekday, categorySales, topItems };
}
