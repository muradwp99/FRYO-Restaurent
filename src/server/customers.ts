import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type CustomerStatus = "Active" | "VIP" | "New";

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: string;
  joined: string;
  status: CustomerStatus;
};

export const CUSTOMER_STATUSES: CustomerStatus[] = ["Active", "VIP", "New"];

const COLLECTION = "customers";

const seed: AdminCustomer[] = [
  { id: "c-1", name: "Alex Johnson", email: "alex@example.com", orders: 24, spent: "£742.80", joined: "Jan 2025", status: "Active" },
  { id: "c-2", name: "Maria Garcia", email: "maria@example.com", orders: 18, spent: "£536.40", joined: "Mar 2025", status: "Active" },
  { id: "c-3", name: "James Lee", email: "james@example.com", orders: 31, spent: "£1,024.20", joined: "Nov 2024", status: "Active" },
  { id: "c-4", name: "Priya Patel", email: "priya@example.com", orders: 7, spent: "£198.60", joined: "May 2026", status: "Active" },
  { id: "c-5", name: "Tom Wilson", email: "tom@example.com", orders: 12, spent: "£384.50", joined: "Feb 2025", status: "Active" },
  { id: "c-6", name: "Zoe Martinez", email: "zoe@example.com", orders: 45, spent: "£1,680.00", joined: "Aug 2024", status: "VIP" },
  { id: "c-7", name: "Ryan Chen", email: "ryan@example.com", orders: 3, spent: "£87.20", joined: "Jun 2026", status: "New" },
  { id: "c-8", name: "Sara Kim", email: "sara@example.com", orders: 19, spent: "£612.40", joined: "Dec 2024", status: "Active" },
  { id: "c-9", name: "Daniel Brown", email: "daniel@example.com", orders: 8, spent: "£224.80", joined: "Apr 2025", status: "Active" },
  { id: "c-10", name: "Lily Thompson", email: "lily@example.com", orders: 52, spent: "£1,924.60", joined: "Jun 2024", status: "VIP" },
];

export type CustomerInput = {
  id?: string;
  name: string;
  email: string;
  orders: number;
  spent: string;
  joined: string;
  status: CustomerStatus;
};

export async function listCustomers(): Promise<AdminCustomer[]> {
  return readCollection<AdminCustomer>(COLLECTION, seed);
}

export async function getCustomer(id: string): Promise<AdminCustomer | null> {
  return (await listCustomers()).find((c) => c.id === id) ?? null;
}

export async function saveCustomer(input: CustomerInput): Promise<AdminCustomer> {
  const rows = await listCustomers();
  if (input.id) {
    let updated: AdminCustomer | null = null;
    const next = rows.map((c) => {
      if (c.id !== input.id) return c;
      updated = { ...c, ...input, id: c.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "customer", rows.map((c) => c.id));
  const customer: AdminCustomer = { ...input, id };
  await writeCollection(COLLECTION, [customer, ...rows]);
  return customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const rows = await listCustomers();
  await writeCollection(COLLECTION, rows.filter((c) => c.id !== id));
}
