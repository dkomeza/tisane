import PageSeeder from "./pages";

// Global seeder

// Try to match the arguments of "npm run seed" to decide what to seed
const args = process.argv.slice(2);

async function seedAll() {
  console.log("Seeding all...");
  await PageSeeder();
  console.log("✅ Seeded all");
}

if (args.includes("--pages")) {
  console.log("Seeding pages...");
  await PageSeeder();
  console.log("✅ Seeded pages");
  process.exit(0);
}

await seedAll();
process.exit(0);
