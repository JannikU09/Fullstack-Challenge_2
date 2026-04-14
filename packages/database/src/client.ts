import path from "node:path";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

// Only load dotenv in standalone Node.js context (migrations, seeding).
// Next.js loads .env automatically; import.meta.dirname is undefined in webpack.
if (typeof import.meta.dirname === "string") {
  dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
}

const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
  }
  return new pg.Pool({ connectionString: process.env.DATABASE_URL });
}

export const pool = globalForDb.pool ?? createPool();
export const db = drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}
