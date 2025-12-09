// src/db/migrate.ts
import { migrate } from "drizzle-orm/neon-serverless/migrator"; // or your driver
import { db } from "./drizzle"; // import your db instance

async function main() {
  console.log("⏳ Running migrations...");

  await migrate(db, {
    migrationsFolder: "sql/migrations",
  });

  console.log("✅ Migrations completed!");

  await db.$client.end();

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed!", err);
  process.exit(1);
});
