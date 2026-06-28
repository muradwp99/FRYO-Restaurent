import "server-only";
import { readCollection, writeCollection } from "./store";

export type Integration = {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  description: string;
};

const COLLECTION = "integrations";

const seed: Integration[] = [
  { id: "stripe", name: "Stripe", category: "Payments", connected: true, description: "Card payments & payouts." },
  { id: "mailchimp", name: "Mailchimp", category: "Email", connected: true, description: "Newsletter & campaigns." },
  { id: "twilio", name: "Twilio", category: "SMS", connected: false, description: "Order status texts." },
  { id: "whatsapp", name: "WhatsApp Business", category: "Messaging", connected: false, description: "Customer chat & updates." },
  { id: "gtm", name: "Google Tag Manager", category: "Analytics", connected: true, description: "Tags, pixels & events." },
  { id: "deliveroo", name: "Deliveroo", category: "Delivery", connected: false, description: "Sync orders & menu." },
];

export async function listIntegrations(): Promise<Integration[]> {
  return readCollection<Integration>(COLLECTION, seed);
}

export async function setIntegrationConnected(id: string, connected: boolean): Promise<void> {
  const rows = await listIntegrations();
  await writeCollection(COLLECTION, rows.map((i) => (i.id === id ? { ...i, connected } : i)));
}
