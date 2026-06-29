import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";
import { hashPassword, verifyPassword, isHashed } from "@/lib/password";

export type UserRole = "owner" | "manager" | "editor" | "staff";
export type UserStatus = "Active" | "Invited" | "Suspended";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

/** Stored shape — adds the credential. Never returned to the client (see {@link listUsers}). */
type StoredUser = StaffUser & { password?: string };

export const USER_ROLES: UserRole[] = ["owner", "manager", "editor", "staff"];
export const USER_STATUSES: UserStatus[] = ["Active", "Invited", "Suspended"];

const COLLECTION = "users";

/**
 * Demo credentials (local file store). This is a stopgap until NextAuth + a
 * `password_hash` column per the CMS spec — passwords live here in plaintext only
 * because the whole JSON store is plaintext on disk. They are stripped from every
 * client-facing read and preserved across edits.
 */
const seed: StoredUser[] = [
  { id: "u-1", name: "Orlando Laurentius", email: "orlando@fryo.co.uk", role: "owner", status: "Active", password: "fryo-owner" },
  { id: "u-2", name: "Sana Khalid", email: "sana@fryo.co.uk", role: "manager", status: "Active", password: "fryo-manager" },
  { id: "u-3", name: "Marco Reyes", email: "marco@fryo.co.uk", role: "editor", status: "Active", password: "fryo-editor" },
  { id: "u-4", name: "Dee Owens", email: "dee@fryo.co.uk", role: "staff", status: "Invited", password: "fryo-staff" },
];

export type UserInput = Omit<StaffUser, "id"> & { id?: string };

function strip(u: StoredUser): StaffUser {
  const { password: _pw, ...rest } = u;
  return rest;
}

/** Raw rows incl. credentials — server-internal only (auth + mutations). */
async function readUsers(): Promise<StoredUser[]> {
  const rows = await readCollection<StoredUser>(COLLECTION, seed);
  // Self-heal: files seeded before passwords existed get the demo credential
  // backfilled from the seed (matched by id, then email).
  return rows.map((u) => {
    if (u.password) return u;
    const fromSeed = seed.find((s) => s.id === u.id || s.email.toLowerCase() === u.email.toLowerCase());
    return fromSeed?.password ? { ...u, password: fromSeed.password } : u;
  });
}

/** Public, credential-free list for UI / RSC payloads. */
export async function listUsers(): Promise<StaffUser[]> {
  return (await readUsers()).map(strip);
}

/** Validate email + password; returns the (credential-free) user or null. */
export async function verifyCredentials(email: string, password: string): Promise<StaffUser | null> {
  const rows = await readUsers();
  const found = rows.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!found || found.status === "Suspended") return null;
  if (!(await verifyPassword(password, found.password))) return null;

  // Transparent upgrade: re-store legacy plaintext as a bcrypt hash on first login.
  if (found.password && !isHashed(found.password)) {
    const hashed = await hashPassword(password);
    await writeCollection(COLLECTION, rows.map((u) => (u.id === found.id ? { ...u, password: hashed } : u)));
  }
  return strip(found);
}

export async function saveUser(input: UserInput): Promise<StaffUser> {
  const rows = await readUsers();
  if (input.id) {
    let updated: StoredUser | null = null;
    const next = rows.map((u) => {
      if (u.id !== input.id) return u;
      // `input` carries no password, so the stored credential is preserved.
      updated = { ...u, ...input, id: u.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return strip(updated ?? rows[0]);
  }
  const id = uniqueId(input.name || input.email || "user", rows.map((u) => u.id));
  const user: StoredUser = { ...input, id };
  await writeCollection(COLLECTION, [...rows, user]);
  return strip(user);
}

export async function deleteUser(id: string): Promise<void> {
  const rows = await readUsers();
  await writeCollection(COLLECTION, rows.filter((u) => u.id !== id));
}

export async function getUserByEmail(email: string): Promise<StaffUser | null> {
  const u = (await readUsers()).find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  return u ? strip(u) : null;
}

/** The owner (super admin) — used for invite notifications. */
export async function getOwner(): Promise<StaffUser | null> {
  const u = (await readUsers()).find((x) => x.role === "owner");
  return u ? strip(u) : null;
}

/** Set a user's password (via invite acceptance) and activate them. */
export async function setUserPassword(email: string, password: string): Promise<StaffUser | null> {
  const rows = await readUsers();
  const hashed = await hashPassword(password);
  let updated: StoredUser | null = null;
  const next = rows.map((u) => {
    if (u.email.toLowerCase() !== email.trim().toLowerCase()) return u;
    updated = { ...u, password: hashed, status: "Active" };
    return updated;
  });
  if (!updated) return null;
  await writeCollection(COLLECTION, next);
  return strip(updated);
}
