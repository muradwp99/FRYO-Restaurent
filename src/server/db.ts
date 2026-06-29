import "server-only";
import mysql from "mysql2/promise";

/**
 * Single shared MySQL pool. Configured entirely from env (MYSQL_*). When the
 * env is absent the app transparently falls back to the file store (see
 * store.ts), so local/CI without DB access still works.
 */
let pool: mysql.Pool | null = null;

export function dbConfigured(): boolean {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 2,
      idleTimeout: 30_000,
      connectTimeout: 12_000,
      enableKeepAlive: true,
    });
  }
  return pool;
}
