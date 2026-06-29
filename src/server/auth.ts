import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifySession,
  verifyAccountSession,
  type SessionPayload,
  type AccountPayload,
  SESSION_COOKIE,
  ACCOUNT_COOKIE,
} from "@/lib/session";

/** Current admin session (verified) or null. Safe to call in Server Components. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Require an admin session; redirect to /login if absent. Returns the payload. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Current customer account session (verified) or null. */
export async function getAccountSession(): Promise<AccountPayload | null> {
  const store = await cookies();
  return verifyAccountSession(store.get(ACCOUNT_COOKIE)?.value);
}

/** Require a customer account session; redirect to /account/login if absent. */
export async function requireAccountSession(): Promise<AccountPayload> {
  const session = await getAccountSession();
  if (!session) redirect("/account/login");
  return session;
}
