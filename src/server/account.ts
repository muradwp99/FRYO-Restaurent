import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";
import { saveCustomer } from "./customers";
import { hashPassword, verifyPassword, isHashed } from "@/lib/password";

/**
 * Customer storefront accounts — distinct from admin staff users.
 * Demo-grade plaintext credentials in the file store (same stopgap as staff
 * users; swap to hashed passwords + DB per the spec). Registration also mirrors
 * the customer into the admin customers store so staff can see them.
 */
export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  joined: string;
};

/** Public (credential-free) account shape. */
export type PublicAccount = Omit<Account, "password">;

const COLLECTION = "accounts";
const seed: Account[] = [];

function strip(a: Account): PublicAccount {
  const { password: _pw, ...rest } = a;
  return rest;
}

async function readAccounts(): Promise<Account[]> {
  return readCollection<Account>(COLLECTION, seed);
}

export async function findAccountByEmail(email: string): Promise<PublicAccount | null> {
  const rows = await readAccounts();
  const a = rows.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  return a ? strip(a) : null;
}

export async function getAccount(id: string): Promise<PublicAccount | null> {
  const a = (await readAccounts()).find((x) => x.id === id);
  return a ? strip(a) : null;
}

export type RegisterInput = { name: string; email: string; password: string };
export type RegisterResult = { ok: true; account: PublicAccount } | { ok: false; error: string };

export async function registerAccount(input: RegisterInput): Promise<RegisterResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email || !input.password) return { ok: false, error: "All fields are required." };
  if (input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const rows = await readAccounts();
  if (rows.some((a) => a.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with that email already exists." };
  }

  const joined = new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  const account: Account = { id: uniqueId(name || email, rows.map((a) => a.id)), name, email, password: await hashPassword(input.password), joined };
  await writeCollection(COLLECTION, [...rows, account]);

  // Mirror into the admin customers store so staff see new signups.
  try {
    await saveCustomer({ name, email, orders: 0, spent: "£0.00", joined, status: "New" });
  } catch {
    /* non-fatal */
  }

  return { ok: true, account: strip(account) };
}

export async function verifyAccount(email: string, password: string): Promise<PublicAccount | null> {
  const rows = await readAccounts();
  const a = rows.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!a || !(await verifyPassword(password, a.password))) return null;
  // Transparent upgrade of any legacy plaintext credential.
  if (!isHashed(a.password)) {
    const hashed = await hashPassword(password);
    await writeCollection(COLLECTION, rows.map((x) => (x.id === a.id ? { ...x, password: hashed } : x)));
  }
  return strip(a);
}

export async function updateAccountProfile(id: string, patch: { name?: string; phone?: string }): Promise<PublicAccount | null> {
  const rows = await readAccounts();
  let updated: Account | null = null;
  const next = rows.map((a) => {
    if (a.id !== id) return a;
    updated = { ...a, name: patch.name?.trim() || a.name, phone: patch.phone?.trim() ?? a.phone };
    return updated;
  });
  if (!updated) return null;
  await writeCollection(COLLECTION, next);
  return strip(updated);
}
