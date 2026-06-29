import "server-only";
import { listOrders, type AdminOrder, type OrderStatus } from "./orders";
import { listCustomers } from "./customers";
import { listMenu, type AdminMenuItem } from "./menu";
import { listReviews } from "./reviews";
import { listActivity, type ActivityEntry } from "./activity";
import { listComments } from "./blog";
import { unreadMessageCount } from "./chat";
import type { BadgeKey } from "@/components/admin/navConfig";

/* ── currency / date helpers (store amounts are GBP strings like "£32.40") ── */

export function parseAmount(s: string): number {
  const n = parseFloat((s || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatGBP(n: number): string {
  return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parse the store's "DD Mon YYYY" date strings without relying on Date() string parsing. */
function parseDate(s: string): Date | null {
  const m = /(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/.exec(s || "");
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].slice(0, 3));
  if (month < 0) return null;
  return new Date(Number(m[3]), month, Number(m[1]));
}

/* ── derived shapes consumed by the dashboard view ── */

export type StatCard = { label: string; value: string };
export type SeriesPoint = { label: string; value: number };
export type CategorySlice = { label: string; value: number };
export type StatusBar = { label: string; count: number; pct: number };
export type TrendingItem = { id: string; name: string; category: string; price: string; rating: number; image: string };

export type DashboardData = {
  stats: { orders: string; customers: string; revenue: string };
  totalRevenue: string;
  revenueSeries: SeriesPoint[];
  revenuePeak: { label: string; value: string };
  ordersByWeekday: SeriesPoint[];
  categories: CategorySlice[];
  statusBreakdown: StatusBar[];
  recentOrders: AdminOrder[];
  trending: TrendingItem[];
  activity: ActivityEntry[];
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isRevenue(status: OrderStatus): boolean {
  return status !== "Cancelled";
}

export async function getDashboardData(): Promise<DashboardData> {
  const [orders, customers, menu, reviews, activity] = await Promise.all([
    listOrders(),
    listCustomers(),
    listMenu(),
    listReviews(),
    listActivity(),
  ]);

  const revenue = orders.filter((o) => isRevenue(o.status)).reduce((sum, o) => sum + parseAmount(o.amount), 0);

  /* Revenue by month (chronological). Pads to ≥2 points so the chart always draws a line. */
  const monthMap = new Map<string, { key: number; label: string; value: number }>();
  for (const o of orders) {
    if (!isRevenue(o.status)) continue;
    const d = parseDate(o.date);
    if (!d) continue;
    const key = d.getFullYear() * 12 + d.getMonth();
    const label = MONTHS[d.getMonth()];
    const cur = monthMap.get(label) ?? { key, label, value: 0 };
    cur.value += parseAmount(o.amount);
    monthMap.set(label, cur);
  }
  let revenueSeries: SeriesPoint[] = [...monthMap.values()]
    .sort((a, b) => a.key - b.key)
    .map((m) => ({ label: m.label, value: Math.round(m.value) }));
  if (revenueSeries.length === 1) {
    const only = revenueSeries[0];
    const prevIdx = (MONTHS.indexOf(only.label) + 11) % 12;
    revenueSeries = [{ label: MONTHS[prevIdx], value: 0 }, only];
  }
  if (revenueSeries.length === 0) revenueSeries = [{ label: "—", value: 0 }, { label: "Now", value: 0 }];
  const peak = revenueSeries.reduce((a, b) => (b.value > a.value ? b : a), revenueSeries[0]);

  /* Orders per weekday */
  const weekdayCounts = new Array(7).fill(0);
  for (const o of orders) {
    const d = parseDate(o.date);
    if (!d) continue;
    const idx = (d.getDay() + 6) % 7; // 0 = Mon
    weekdayCounts[idx] += 1;
  }
  const ordersByWeekday: SeriesPoint[] = WEEKDAYS.map((label, i) => ({ label, value: weekdayCounts[i] }));

  /* Menu category distribution */
  const catMap = new Map<string, number>();
  for (const m of menu) catMap.set(m.category, (catMap.get(m.category) ?? 0) + 1);
  const categories: CategorySlice[] = [...catMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  /* Order status breakdown */
  const statusOrder: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
  const total = orders.length || 1;
  const statusBreakdown: StatusBar[] = statusOrder
    .map((label) => {
      const count = orders.filter((o) => o.status === label).length;
      return { label, count, pct: Math.round((count / total) * 100) };
    })
    .filter((s) => s.count > 0);

  /* Trending: highest-rated active menu items */
  const trending: TrendingItem[] = [...menu]
    .filter((m: AdminMenuItem) => m.status !== "Hidden")
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3)
    .map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      price: formatGBP(m.price),
      rating: m.rating ?? 0,
      image: m.image,
    }));

  void reviews; // (reserved for a future rating card)

  return {
    stats: {
      orders: orders.length.toLocaleString("en-GB"),
      customers: customers.length.toLocaleString("en-GB"),
      revenue: formatGBP(revenue),
    },
    totalRevenue: formatGBP(revenue),
    revenueSeries,
    revenuePeak: { label: peak.label, value: formatGBP(peak.value) },
    ordersByWeekday,
    categories,
    statusBreakdown,
    recentOrders: orders.slice(0, 5),
    trending,
    activity: activity.slice(0, 4),
  };
}

/* ── Live sidebar badge counts ── */

export async function getAdminBadges(): Promise<Record<BadgeKey, number>> {
  const [orders, reviews, comments, messages] = await Promise.all([
    listOrders(),
    listReviews(),
    listComments(),
    unreadMessageCount(),
  ]);
  return {
    orders: orders.filter((o) => o.status === "Pending" || o.status === "Preparing").length,
    reviews: reviews.filter((r) => r.status === "Pending").length,
    comments: comments.filter((c) => c.status === "Pending").length,
    messages,
  };
}
