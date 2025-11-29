import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tisane",
  emailAndPassword: {
    enabled: true,
  },
  username: {
    enabled: true,
  },
  plugins: [admin(), nextCookies()],
});
