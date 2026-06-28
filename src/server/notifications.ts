import "server-only";
import { readCollection, writeCollection } from "./store";

export type NotificationPref = {
  id: string;
  event: string;
  email: boolean;
  sms: boolean;
  push: boolean;
};

export type NotifChannel = "email" | "sms" | "push";

const COLLECTION = "notifications";

const seed: NotificationPref[] = [
  { id: "new-order", event: "New order placed", email: true, sms: true, push: true },
  { id: "order-ready", event: "Order ready", email: false, sms: true, push: true },
  { id: "low-stock", event: "Item low / sold out", email: true, sms: false, push: true },
  { id: "new-review", event: "New review", email: true, sms: false, push: false },
  { id: "new-comment", event: "New blog comment", email: true, sms: false, push: false },
  { id: "daily-summary", event: "Daily sales summary", email: true, sms: false, push: false },
];

export async function listNotificationPrefs(): Promise<NotificationPref[]> {
  return readCollection<NotificationPref>(COLLECTION, seed);
}

export async function setNotificationPref(id: string, channel: NotifChannel, value: boolean): Promise<void> {
  const rows = await listNotificationPrefs();
  await writeCollection(COLLECTION, rows.map((p) => (p.id === id ? { ...p, [channel]: value } : p)));
}
