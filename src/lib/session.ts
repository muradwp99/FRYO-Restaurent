/**
 * Stateless signed-session token — shared by the Proxy gate (Node runtime) and
 * Server Functions / Components. Uses Web Crypto (HMAC-SHA256) so the exact same
 * code runs everywhere without a Node-only dependency.
 *
 * The token is `base64url(payload).base64url(signature)`. The payload is *not*
 * encrypted (it carries no secret — just uid/role/name + expiry), only signed,
 * so it cannot be tampered with. Swap for NextAuth + DB sessions per the CMS
 * spec when moving off the file store.
 */

export type SessionRole = "owner" | "manager" | "editor" | "staff";

export type SessionPayload = {
  uid: string;
  name: string;
  email: string;
  role: SessionRole;
  /** Unix seconds. */
  exp: number;
};

export const SESSION_COOKIE = "fryo_session";
/** Customer storefront account cookie (separate from the admin session). */
export const ACCOUNT_COOKIE = "fryo_account";
/** 7 days. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Customer account session payload. */
export type AccountPayload = {
  uid: string;
  name: string;
  email: string;
  exp: number;
};

function secret(): string {
  return process.env.FRYO_SESSION_SECRET || "fryo-dev-secret-change-me";
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Generic sign — payload must already carry its `exp`. */
async function signToken(payload: object): Promise<string> {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(sig))}`;
}

/** Generic verify — checks signature + expiry, returns the typed payload or null. */
async function verifyToken<T extends { exp: number }>(token: string | undefined | null): Promise<T | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await hmacKey();
    const sigBytes = fromBase64Url(sig) as unknown as BufferSource;
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as T;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Admin session. */
export const signSession = (payload: SessionPayload) => signToken(payload);
export const verifySession = (token: string | undefined | null) => verifyToken<SessionPayload>(token);

/** Customer account session. */
export const signAccountSession = (payload: AccountPayload) => signToken(payload);
export const verifyAccountSession = (token: string | undefined | null) => verifyToken<AccountPayload>(token);
