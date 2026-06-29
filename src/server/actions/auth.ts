"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "@/server/users";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAction(input: { email: string; password: string }): Promise<LoginResult> {
  const email = (input.email ?? "").trim();
  const password = input.password ?? "";
  if (!email || !password) return { ok: false, error: "Enter your email and password." };

  const user = await verifyCredentials(email, password);
  if (!user) return { ok: false, error: "Invalid email or password." };

  const token = await signSession({
    uid: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
