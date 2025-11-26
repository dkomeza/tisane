import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

config();
export const db = drizzle(process.env.DATABASE_URL, { casing: "snake_case" });
