import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";
import { DEALS, type Deal } from "@/lib/deals";

export type DealStatus = "Active" | "Hidden";
export type AdminDeal = Deal & { status: DealStatus };

const COLLECTION = "deals";

const seed: AdminDeal[] = DEALS.map((d) => ({ ...d, status: d.status ?? "Active" }));

export type DealInput = {
  id?: string;
  title: string;
  blurb: string;
  code: string;
  badge: string;
  tone: "gold" | "royal";
  cta: string;
  href: string;
  status: DealStatus;
};

export async function listDeals(): Promise<AdminDeal[]> {
  return readCollection<AdminDeal>(COLLECTION, seed);
}

export async function getPublicDeals(): Promise<AdminDeal[]> {
  return (await listDeals()).filter((d) => d.status !== "Hidden");
}

export async function createDeal(input: DealInput): Promise<AdminDeal> {
  const rows = await listDeals();
  const id = uniqueId(input.id || input.code || input.title, rows.map((r) => r.id));
  const { id: _omit, ...rest } = input;
  void _omit;
  const deal: AdminDeal = { ...rest, id };
  await writeCollection(COLLECTION, [...rows, deal]);
  return deal;
}

export async function updateDeal(id: string, patch: Partial<DealInput>): Promise<AdminDeal | null> {
  const rows = await listDeals();
  let updated: AdminDeal | null = null;
  const next = rows.map((r) => {
    if (r.id !== id) return r;
    updated = { ...r, ...patch, id };
    return updated;
  });
  await writeCollection(COLLECTION, next);
  return updated;
}

export async function deleteDeal(id: string): Promise<void> {
  const rows = await listDeals();
  await writeCollection(COLLECTION, rows.filter((r) => r.id !== id));
}
