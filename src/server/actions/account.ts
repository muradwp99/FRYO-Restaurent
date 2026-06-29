"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { registerAccount, verifyAccount, updateAccountProfile } from "@/server/account";
import { getAccountSession } from "@/server/auth";
import { signAccountSession, ACCOUNT_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export type AccountResult = { ok: true } | { ok: false; error: string };

async function setAccountCookie(uid: string, name: string, email: string) {
  const token = await signAccountSession({
    uid,
    name,
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });
  const store = await cookies();
  store.set(ACCOUNT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function registerAccountAction(input: { name: string; email: string; password: string }): Promise<AccountResult> {
  const res = await registerAccount(input);
  if (!res.ok) return { ok: false, error: res.error };
  await setAccountCookie(res.account.id, res.account.name, res.account.email);
  revalidatePath("/account");
  return { ok: true };
}

export async function loginAccountAction(input: { email: string; password: string }): Promise<AccountResult> {
  const email = (input.email ?? "").trim();
  if (!email || !input.password) return { ok: false, error: "Enter your email and password." };
  const account = await verifyAccount(email, input.password);
  if (!account) return { ok: false, error: "Invalid email or password." };
  await setAccountCookie(account.id, account.name, account.email);
  revalidatePath("/account");
  return { ok: true };
}

export async function logoutAccountAction(): Promise<void> {
  const store = await cookies();
  store.delete(ACCOUNT_COOKIE);
  redirect("/");
}

export async function updateProfileAction(input: { name: string; phone: string }): Promise<AccountResult> {
  const session = await getAccountSession();
  if (!session) return { ok: false, error: "Not signed in." };
  await updateAccountProfile(session.uid, { name: input.name, phone: input.phone });
  // refresh the cookie name if it changed
  if (input.name.trim() && input.name.trim() !== session.name) {
    await setAccountCookie(session.uid, input.name.trim(), session.email);
  }
  revalidatePath("/account");
  return { ok: true };
}
