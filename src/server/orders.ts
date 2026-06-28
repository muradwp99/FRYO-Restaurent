import "server-only";
import { readCollection, writeCollection } from "./store";

export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered" | "Cancelled";

export type AdminOrder = {
  id: string;
  customer: string;
  items: string;
  amount: string;
  status: OrderStatus;
  time: string;
  date: string;
};

export const ORDER_STATUSES: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

const COLLECTION = "orders";

const seed: AdminOrder[] = [
  { id: "ORD-1042", customer: "Alex Johnson", items: "Classic Burger ×2, Fries ×1", amount: "£32.40", status: "Preparing", time: "2m ago", date: "28 Jun 2026" },
  { id: "ORD-1041", customer: "Maria Garcia", items: "Super Wrap ×1, Lemonade ×2", amount: "£18.70", status: "Ready", time: "8m ago", date: "28 Jun 2026" },
  { id: "ORD-1040", customer: "James Lee", items: "BBQ Stack ×1", amount: "£14.20", status: "Delivered", time: "14m ago", date: "28 Jun 2026" },
  { id: "ORD-1039", customer: "Priya Patel", items: "Classic Burger ×1, Fries ×2", amount: "£24.60", status: "Pending", time: "21m ago", date: "28 Jun 2026" },
  { id: "ORD-1038", customer: "Tom Wilson", items: "Super Wrap ×2, FRYO Fries ×1", amount: "£31.50", status: "Delivered", time: "35m ago", date: "28 Jun 2026" },
  { id: "ORD-1037", customer: "Zoe Martinez", items: "BBQ Stack ×2, Cola ×2", amount: "£38.20", status: "Delivered", time: "1h ago", date: "28 Jun 2026" },
  { id: "ORD-1036", customer: "Ryan Chen", items: "Classic Burger ×3", amount: "£37.20", status: "Delivered", time: "1h 20m ago", date: "28 Jun 2026" },
  { id: "ORD-1035", customer: "Sara Kim", items: "Super Wrap ×1, Fries ×1", amount: "£20.40", status: "Delivered", time: "2h ago", date: "28 Jun 2026" },
  { id: "ORD-1034", customer: "Daniel Brown", items: "FRYO Fries ×3, Lemonade ×1", amount: "£19.10", status: "Delivered", time: "2h 30m ago", date: "28 Jun 2026" },
  { id: "ORD-1033", customer: "Lily Thompson", items: "BBQ Stack ×1, Classic Burger ×1", amount: "£27.80", status: "Delivered", time: "3h ago", date: "28 Jun 2026" },
];

export async function listOrders(): Promise<AdminOrder[]> {
  return readCollection<AdminOrder>(COLLECTION, seed);
}

/** Persist a freshly-placed customer order (from checkout) into the admin pipeline. */
export async function createOrder(input: { id: string; customer: string; items: string; amount: string }): Promise<AdminOrder> {
  const rows = await listOrders();
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const order: AdminOrder = { ...input, status: "Pending", time: "just now", date };
  await writeCollection(COLLECTION, [order, ...rows.filter((r) => r.id !== input.id)]);
  return order;
}

export async function getOrder(id: string): Promise<AdminOrder | null> {
  return (await listOrders()).find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const rows = await listOrders();
  await writeCollection(COLLECTION, rows.map((o) => (o.id === id ? { ...o, status } : o)));
}

export async function deleteOrder(id: string): Promise<void> {
  const rows = await listOrders();
  await writeCollection(COLLECTION, rows.filter((o) => o.id !== id));
}
