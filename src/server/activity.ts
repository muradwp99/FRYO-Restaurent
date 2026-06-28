import "server-only";
import { readCollection, writeCollection } from "./store";

export type ActivityKind = "menu" | "order" | "review" | "user" | "content" | "finance" | "blog";

export type ActivityEntry = {
  id: string;
  actor: string;
  action: string;
  kind: ActivityKind;
  time: string;
};

const COLLECTION = "activity";

const seed: ActivityEntry[] = [
  { id: "a-1", actor: "Sana Khalid", action: "raised the free-delivery threshold to £25", kind: "finance", time: "28 Jun 2026, 11:42 AM" },
  { id: "a-2", actor: "Chef Marco", action: "published the post “The Secret Behind Our Smash Patty”", kind: "blog", time: "28 Jun 2026, 10:18 AM" },
  { id: "a-3", actor: "Orlando Laurentius", action: "marked Super Charger Burger as Sold out", kind: "menu", time: "28 Jun 2026, 09:55 AM" },
  { id: "a-4", actor: "Maria Kings", action: "approved a review from Alex Johnson", kind: "review", time: "27 Jun 2026, 08:30 PM" },
  { id: "a-5", actor: "Orlando Laurentius", action: "invited Dee Owens (staff)", kind: "user", time: "27 Jun 2026, 04:12 PM" },
  { id: "a-6", actor: "Sana Khalid", action: "edited the homepage About section", kind: "content", time: "26 Jun 2026, 02:03 PM" },
  { id: "a-7", actor: "Kitchen", action: "moved order ORD-1041 to Ready", kind: "order", time: "26 Jun 2026, 12:47 PM" },
];

export async function listActivity(): Promise<ActivityEntry[]> {
  return readCollection<ActivityEntry>(COLLECTION, seed);
}

export async function clearActivity(): Promise<void> {
  await writeCollection<ActivityEntry>(COLLECTION, []);
}
