import "server-only";
import { dbConfigured, getPool } from "./db";
import { uniqueId } from "./store";
import type { RowDataPacket } from "mysql2";

/**
 * Binary media storage in MySQL (host-agnostic — works on serverless or shared
 * hosting without a writable filesystem). Uploaded images are stored as LONGBLOB
 * and served by /api/media/[id].
 */

const TABLE = "fryo_media";
let ready = false;

async function ensureTable(): Promise<void> {
  if (ready) return;
  const pool = getPool();
  await pool.query(
    `CREATE TABLE IF NOT EXISTS ${TABLE} (
       id VARCHAR(191) NOT NULL PRIMARY KEY,
       mime VARCHAR(127) NOT NULL,
       name VARCHAR(255) NULL,
       bytes LONGBLOB NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  );
  ready = true;
}

export function mediaAvailable(): boolean {
  return dbConfigured();
}

export async function saveMediaBlob(bytes: Buffer, mime: string, name: string): Promise<string> {
  await ensureTable();
  const pool = getPool();
  const base = (name || "image").replace(/\.[^.]+$/, "");
  const id = uniqueId(base, []) + "-" + Date.now().toString(36);
  await pool.query(`INSERT INTO ${TABLE} (id, mime, name, bytes) VALUES (?, ?, ?, ?)`, [id, mime, name, bytes]);
  return id;
}

export async function getMediaBlob(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  await ensureTable();
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT mime, bytes FROM ${TABLE} WHERE id = ? LIMIT 1`,
    [id],
  );
  if (!rows.length) return null;
  return { mime: rows[0].mime as string, bytes: rows[0].bytes as Buffer };
}
