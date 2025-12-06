// src/db/migrate.ts
import { migrate } from "drizzle-orm/neon-serverless/migrator"; // or your driver
import { db } from "./drizzle"; // import your db instance

async function main() {
  console.log("⏳ Running migrations...");

  // This will run migrations from the "drizzle" folder
  await migrate(db, {
    migrationsFolder: "migrations",
  });

  console.log("✅ Migrations completed!");

  await db.$client.end();

  // Close the connection so the script exits
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed!", err);
  process.exit(1);
});
