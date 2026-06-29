"use server";

import { cookies } from "next/headers";
import { getInvite, consumeInvite } from "@/server/invites";
import { setUserPassword } from "@/server/users";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export type AcceptResult = { ok: true } | { ok: false; error: string };

export async function acceptInviteAction(token: string, password: string): Promise<AcceptResult> {
  if (!password || password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const invite = await getInvite(token);
  if (!invite) return { ok: false, error: "This invite is invalid or has expired. Ask an admin to resend it." };

  const user = await setUserPassword(invite.email, password);
  if (!user) return { ok: false, error: "Account not found — the invite may have been revoked." };

  await consumeInvite(token);

  // Sign them straight in (admin session) so they land in the dashboard.
  const sessionToken = await signSession({
    uid: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return { ok: true };
}
