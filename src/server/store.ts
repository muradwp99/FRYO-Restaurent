import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { dbConfigured, getPool } from "./db";
import type { RowDataPacket } from "mysql2";

/**
 * Persistence layer for the admin CMS + storefront.
 *
 * Primary backend is **MySQL** (a single `fryo_store` key/value table holding one
 * JSON document per "collection"/object). The interface
 * (readCollection/writeCollection/readObject/writeObject) is unchanged, so every
 * domain repo in `src/server/*` is DB-backed without modification.
 *
 * If MySQL is not configured (no MYSQL_* env) or a query fails, it transparently
 * falls back to the original file-backed store (`<project>/data/<name>.json`) so
 * local dev / CI without DB access still works.
 */

const TABLE = "fryo_store";
let tableReady = false;
/** Once MySQL proves unavailable at runtime, stop retrying it for this process. */
let dbDisabled = false;

async function ensureTable(): Promise<void> {
  if (tableReady) return;
  const pool = getPool();
  await pool.query(
    `CREATE TABLE IF NOT EXISTS ${TABLE} (
       name VARCHAR(191) NOT NULL PRIMARY KEY,
       data LONGTEXT NOT NULL,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  tableReady = true;
}

function useDb(): boolean {
  return dbConfigured() && !dbDisabled;
}

async function dbReadRaw(name: string): Promise<string | null> {
  await ensureTable();
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT data FROM ${TABLE} WHERE name = ? LIMIT 1`,
    [name],
  );
  return rows.length ? (rows[0].data as string) : null;
}

async function dbWriteRaw(name: string, json: string): Promise<void> {
  await ensureTable();
  const pool = getPool();
  await pool.query(
    `INSERT INTO ${TABLE} (name, data) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE data = VALUES(data)`,
    [name, json],
  );
}

/* ── file-store fallback ── */

const DATA_DIR = path.join(process.cwd(), "data");
async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}
function fileFor(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}
async function fileRead(name: string): Promise<string | null> {
  try {
    return await fs.readFile(fileFor(name), "utf8");
  } catch {
    return null;
  }
}
async function fileWrite(name: string, json: string): Promise<void> {
  await ensureDir();
  await fs.writeFile(fileFor(name), json, "utf8");
}

/* ── unified read/write with DB → file fallback ── */

async function readRaw(name: string): Promise<string | null> {
  if (useDb()) {
    try {
      return await dbReadRaw(name);
    } catch (err) {
      console.error(`[store] MySQL read failed for "${name}" — falling back to file store.`, err);
      dbDisabled = true;
    }
  }
  return fileRead(name);
}

async function writeRaw(name: string, json: string): Promise<void> {
  if (useDb()) {
    try {
      await dbWriteRaw(name, json);
      return;
    } catch (err) {
      console.error(`[store] MySQL write failed for "${name}" — falling back to file store.`, err);
      dbDisabled = true;
    }
  }
  await fileWrite(name, json);
}

export async function readCollection<T>(name: string, seed: T[]): Promise<T[]> {
  const raw = await readRaw(name);
  if (raw == null) {
    await writeRaw(name, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

export async function writeCollection<T>(name: string, rows: T[]): Promise<void> {
  await writeRaw(name, JSON.stringify(rows, null, 2));
}

/** Read a single JSON object blob (content blocks / settings). Seeds on first read. */
export async function readObject<T>(name: string, seed: T): Promise<T> {
  const raw = await readRaw(name);
  if (raw == null) {
    await writeRaw(name, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export async function writeObject<T>(name: string, data: T): Promise<void> {
  await writeRaw(name, JSON.stringify(data, null, 2));
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
