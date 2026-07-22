import { Pool } from "pg";

declare global {
  var pool: Pool;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db =
  global.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.pool = db;
}
