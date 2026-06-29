import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

const COLLECTION = "contact-messages";
const seed: ContactMessage[] = [];

export async function listMessages(): Promise<ContactMessage[]> {
  return readCollection<ContactMessage>(COLLECTION, seed);
}

export async function addMessage(input: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
  const rows = await listMessages();
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const msg: ContactMessage = {
    id: uniqueId(input.name || input.email || "msg", rows.map((m) => m.id)),
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    date,
    read: false,
  };
  await writeCollection(COLLECTION, [msg, ...rows]);
  return msg;
}
