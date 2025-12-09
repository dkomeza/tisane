import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}
export const db = drizzle(process.env.DATABASE_URL, {
  casing: "snake_case",
  schema,
});
