import "server-only";
import { readCollection, writeCollection } from "./store";
import type { UserRole } from "./users";

export type Invite = {
  token: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
  used: boolean;
};

const COLLECTION = "invites";
const seed: Invite[] = [];
/** Invites expire after 7 days. */
const TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function listInvites(): Promise<Invite[]> {
  return readCollection<Invite>(COLLECTION, seed);
}

function newToken(): string {
  // crypto.randomUUID is available in the Node runtime; double it for length.
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
}

export async function createInvite(input: { email: string; name: string; role: UserRole }): Promise<Invite> {
  const rows = await listInvites();
  // expire any existing open invites for this email
  const cleaned = rows.map((i) =>
    i.email.toLowerCase() === input.email.toLowerCase() && !i.used ? { ...i, used: true } : i,
  );
  const invite: Invite = {
    token: newToken(),
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
    createdAt: Date.now(),
    used: false,
  };
  await writeCollection(COLLECTION, [...cleaned, invite]);
  return invite;
}

export async function getInvite(token: string): Promise<Invite | null> {
  const invite = (await listInvites()).find((i) => i.token === token);
  if (!invite || invite.used) return null;
  if (Date.now() - invite.createdAt > TTL_MS) return null;
  return invite;
}

export async function consumeInvite(token: string): Promise<void> {
  const rows = await listInvites();
  await writeCollection(COLLECTION, rows.map((i) => (i.token === token ? { ...i, used: true } : i)));
}
