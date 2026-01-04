import { connection } from "next/server";
import prisma from "./prisma";

const globalForSetup = globalThis as typeof globalThis & {
  __tisane_is_setup: boolean | undefined;
};

export async function isSetupComplete(): Promise<boolean> {
  await connection();

  if (globalForSetup.__tisane_is_setup) {
    return true;
  }

  const isSetup = await prisma.setting.findUnique({
    where: { key: "setup_complete" },
  });

  const setupComplete = isSetup?.value === "true";

  if (setupComplete) {
    globalForSetup.__tisane_is_setup = true;
  }

  return setupComplete;
}
