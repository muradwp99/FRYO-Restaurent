import "server-only";
import { readObject, writeObject, readCollection, writeCollection } from "./store";

/* ── Settings (delivery + tax) ── */
export type FinanceSettings = {
  deliveryFee: number;
  freeDeliveryOver: number;
  taxRatePct: number;
};

const SETTINGS_FILE = "finance-settings";
const SETTINGS_DEFAULT: FinanceSettings = { deliveryFee: 2.49, freeDeliveryOver: 20, taxRatePct: 0 };

export async function getFinanceSettings(): Promise<FinanceSettings> {
  const s = await readObject<Partial<FinanceSettings>>(SETTINGS_FILE, SETTINGS_DEFAULT);
  return { ...SETTINGS_DEFAULT, ...s };
}

export async function getDeliveryConfig(): Promise<{ deliveryFee: number; freeDeliveryOver: number }> {
  const s = await getFinanceSettings();
  return { deliveryFee: s.deliveryFee, freeDeliveryOver: s.freeDeliveryOver };
}

export async function updateFinanceSettings(data: FinanceSettings): Promise<void> {
  await writeObject(SETTINGS_FILE, data);
}

/* ── Payouts ── */
export type PayoutStatus = "Paid" | "Pending";
export type Payout = { id: string; date: string; amount: string; method: string; status: PayoutStatus };

const PAYOUTS = "payouts";
const payoutSeed: Payout[] = [
  { id: "PO-2041", date: "27 Jun 2026", amount: "£3,820.40", method: "Stripe → Barclays ••4471", status: "Paid" },
  { id: "PO-2040", date: "20 Jun 2026", amount: "£4,110.90", method: "Stripe → Barclays ••4471", status: "Paid" },
  { id: "PO-2039", date: "13 Jun 2026", amount: "£3,540.10", method: "Stripe → Barclays ••4471", status: "Paid" },
  { id: "PO-2042", date: "Pending", amount: "£2,980.75", method: "Stripe → Barclays ••4471", status: "Pending" },
];

export async function listPayouts(): Promise<Payout[]> {
  return readCollection<Payout>(PAYOUTS, payoutSeed);
}

export async function setPayoutStatus(id: string, status: PayoutStatus): Promise<void> {
  const rows = await listPayouts();
  await writeCollection(PAYOUTS, rows.map((p) => (p.id === id ? { ...p, status } : p)));
}

/* ── Refunds ── */
export type RefundStatus = "Requested" | "Processed" | "Declined";
export type Refund = { id: string; orderId: string; customer: string; amount: string; reason: string; status: RefundStatus; date: string };

const REFUNDS = "refunds";
const refundSeed: Refund[] = [
  { id: "RF-118", orderId: "ORD-1039", customer: "Priya Patel", amount: "£24.60", reason: "Missing item — fries", status: "Requested", date: "28 Jun 2026" },
  { id: "RF-117", orderId: "ORD-1026", customer: "Eve Carter", amount: "£15.00", reason: "Order cancelled by kitchen", status: "Processed", date: "26 Jun 2026" },
  { id: "RF-116", orderId: "ORD-1014", customer: "Leon K.", amount: "£8.50", reason: "Late delivery goodwill", status: "Processed", date: "22 Jun 2026" },
];

export async function listRefunds(): Promise<Refund[]> {
  return readCollection<Refund>(REFUNDS, refundSeed);
}

export async function setRefundStatus(id: string, status: RefundStatus): Promise<void> {
  const rows = await listRefunds();
  await writeCollection(REFUNDS, rows.map((r) => (r.id === id ? { ...r, status } : r)));
}

export async function deleteRefund(id: string): Promise<void> {
  const rows = await listRefunds();
  await writeCollection(REFUNDS, rows.filter((r) => r.id !== id));
}
