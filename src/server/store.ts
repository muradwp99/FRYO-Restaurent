import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny file-backed JSON store — the persistence layer for the admin CMS.
 *
 * Each "collection" is a JSON array saved to `<project>/data/<name>.json`.
 * On first read the file is seeded from the provided `seed` (derived from the
 * code-level seed data in `src/lib/*`), then all edits persist to disk.
 *
 * This is intentionally swappable: every repo (src/server/<domain>.ts) talks to
 * the store through `readCollection` / `writeCollection`, so moving to MySQL
 * (per the CMS spec) later means reimplementing just these two functions.
 *
 * Note: single-process dev usage. Writes are last-write-wins (no row locking);
 * fine for an admin panel, revisit when moving to a real DB.
 */

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function fileFor(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readCollection<T>(name: string, seed: T[]): Promise<T[]> {
  await ensureDir();
  const file = fileFor(name);
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    // Not yet created → seed it.
    await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export async function writeCollection<T>(name: string, rows: T[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(fileFor(name), JSON.stringify(rows, null, 2), "utf8");
}

/** Read a single JSON object blob (used for content blocks / settings). Seeds on first read. */
export async function readObject<T>(name: string, seed: T): Promise<T> {
  await ensureDir();
  const file = fileFor(name);
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export async function writeObject<T>(name: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(fileFor(name), JSON.stringify(data, null, 2), "utf8");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate an id from a base string that is unique within `existing`. */
export function uniqueId(base: string, existing: string[]): string {
  let id = slugify(base) || "item";
  const root = id;
  let n = 2;
  while (existing.includes(id)) id = `${root}-${n++}`;
  return id;
}
