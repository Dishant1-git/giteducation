import "server-only";

import mysql from "mysql2/promise";

/**
 * MySQL connection pool, shared by every route handler.
 *
 * Credentials come from environment variables (.env / .env.local, see
 * .env.example). The pool is kept on `globalThis` so hot reloads in development
 * reuse it instead of opening a new pool on every file save — but it is rebuilt
 * whenever the credentials change, so editing the env file never leaves a pool
 * stuck on the old (e.g. empty) password.
 */

const globalForDb = globalThis as unknown as { mysqlPool?: mysql.Pool; mysqlPoolKey?: string };

export function getPool(): mysql.Pool {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD = "", DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("Database is not configured. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in .env or .env.local.");
  }

  const key = [DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME].join("\u0000");
  if (!globalForDb.mysqlPool || globalForDb.mysqlPoolKey !== key) {
    void globalForDb.mysqlPool?.end().catch(() => {});
    globalForDb.mysqlPool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: 5,
      waitForConnections: true,
    });
    globalForDb.mysqlPoolKey = key;
  }
  return globalForDb.mysqlPool;
}
