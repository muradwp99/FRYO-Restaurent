import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type CampaignStatus = "Draft" | "Scheduled" | "Sent";
export type Campaign = {
  id: string;
  name: string;
  subject: string;
  audience: string;
  status: CampaignStatus;
  recipients: number;
  date: string;
};

const COLLECTION = "campaigns";

const seed: Campaign[] = [
  { id: "welcome", name: "Welcome Series", subject: "Your first FRYO is on us 🍔", audience: "New subscribers", status: "Sent", recipients: 1240, date: "20 Jun 2026" },
  { id: "thursday", name: "Double Points Thursday", subject: "2× points today only", audience: "Loyalty members", status: "Scheduled", recipients: 890, date: "02 Jul 2026" },
  { id: "summer", name: "Summer Combo Drop", subject: "New combos, same fire", audience: "All customers", status: "Draft", recipients: 0, date: "—" },
];

export type CampaignInput = Omit<Campaign, "id" | "recipients" | "date"> & { id?: string; recipients?: number; date?: string };

export async function listCampaigns(): Promise<Campaign[]> {
  return readCollection<Campaign>(COLLECTION, seed);
}

export async function saveCampaign(input: CampaignInput): Promise<Campaign> {
  const rows = await listCampaigns();
  if (input.id) {
    let updated: Campaign | null = null;
    const next = rows.map((c) => {
      if (c.id !== input.id) return c;
      updated = { ...c, ...input, id: c.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || "campaign", rows.map((c) => c.id));
  const campaign: Campaign = { name: input.name, subject: input.subject, audience: input.audience, status: input.status, recipients: input.recipients ?? 0, date: input.date ?? "—", id };
  await writeCollection(COLLECTION, [campaign, ...rows]);
  return campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  const rows = await listCampaigns();
  await writeCollection(COLLECTION, rows.filter((c) => c.id !== id));
}
