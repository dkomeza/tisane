import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";
export * from "@/src/generated/prisma/client";

declare global {
  var Prisma: PrismaClient;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
  });
}

const prisma = global.Prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") global.Prisma = prisma;

export default prisma;
