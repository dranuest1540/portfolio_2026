import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const ssl = process.env.DB_SSL === "false"
  ? false
  : { rejectUnauthorized: false };

const pool = new Pool({
  ...(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      }),
  ssl,
  max: process.env.VERCEL ? 1 : 10,
});

export default pool;