import "server-only";
import { readCollection, writeCollection } from "./store";

export type ChatRole = "customer" | "admin";
export type ChatMessage = { id: string; from: ChatRole; text: string; time: string };
export type ChatThread = {
  id: string;
  name: string;
  online: boolean;
  unread: number;
  updated: string;
  messages: ChatMessage[];
};

const COLLECTION = "chat-threads";

const seed: ChatThread[] = [
  {
    id: "t-1", name: "Alex Johnson", online: true, unread: 2, updated: "2m",
    messages: [
      { id: "m-1", from: "customer", text: "Hi! Is my order ready yet?", time: "11:34 AM" },
      { id: "m-2", from: "admin", text: "Hey Alex! Your order is being prepared right now, should be ready in about 5 minutes. 🍔", time: "11:35 AM" },
      { id: "m-3", from: "customer", text: "Great, thanks! Can I add extra fries?", time: "11:36 AM" },
      { id: "m-4", from: "admin", text: "Absolutely, I'll add a large fries to your order. That'll be an extra £5.80.", time: "11:37 AM" },
      { id: "m-5", from: "customer", text: "Perfect, go ahead!", time: "11:37 AM" },
    ],
  },
  { id: "t-2", name: "Maria Garcia", online: true, unread: 0, updated: "8m", messages: [{ id: "m-1", from: "customer", text: "Thank you so much!", time: "11:20 AM" }] },
  { id: "t-3", name: "James Lee", online: false, unread: 1, updated: "15m", messages: [{ id: "m-1", from: "customer", text: "Can I change my order?", time: "11:05 AM" }] },
  { id: "t-4", name: "Priya Patel", online: false, unread: 0, updated: "32m", messages: [{ id: "m-1", from: "customer", text: "Great food as always 🔥", time: "10:48 AM" }] },
  { id: "t-5", name: "Tom Wilson", online: false, unread: 0, updated: "1h", messages: [{ id: "m-1", from: "customer", text: "What's the wait time?", time: "10:30 AM" }] },
  { id: "t-6", name: "Zoe Martinez", online: false, unread: 0, updated: "2h", messages: [{ id: "m-1", from: "customer", text: "Perfect, thank you!", time: "09:30 AM" }] },
];

function nowTime(): string {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export async function listThreads(): Promise<ChatThread[]> {
  return readCollection<ChatThread>(COLLECTION, seed);
}

/** Append an admin reply to a thread; bumps it to the top of the list. */
export async function sendMessage(threadId: string, text: string): Promise<ChatThread | null> {
  const rows = await listThreads();
  let updated: ChatThread | null = null;
  const next = rows.map((t) => {
    if (t.id !== threadId) return t;
    const msg: ChatMessage = { id: `m-${t.messages.length + 1}-${t.messages.length}`, from: "admin", text, time: nowTime() };
    updated = { ...t, messages: [...t.messages, msg], updated: "now", unread: 0 };
    return updated;
  });
  if (!updated) return null;
  // move the active thread to the front
  await writeCollection(COLLECTION, [updated, ...next.filter((t) => t.id !== threadId)]);
  return updated;
}

export async function markThreadRead(threadId: string): Promise<void> {
  const rows = await listThreads();
  await writeCollection(COLLECTION, rows.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)));
}

export async function unreadMessageCount(): Promise<number> {
  return (await listThreads()).reduce((sum, t) => sum + t.unread, 0);
}
