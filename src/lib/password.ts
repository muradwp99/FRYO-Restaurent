import "server-only";
import bcrypt from "bcryptjs";

/**
 * Password hashing. New passwords are bcrypt-hashed. Legacy plaintext values
 * (seed demo creds + rows written before hashing existed) still verify and are
 * flagged for transparent upgrade-on-login by the caller.
 */

const ROUNDS = 10;

export function isHashed(value: string | undefined | null): boolean {
  return typeof value === "string" && /^\$2[aby]\$/.test(value);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

/** Verify a plaintext attempt against a stored value (hashed or legacy plaintext). */
export async function verifyPassword(plain: string, stored: string | undefined | null): Promise<boolean> {
  if (!stored) return false;
  if (isHashed(stored)) return bcrypt.compare(plain, stored);
  return plain === stored; // legacy plaintext
}
