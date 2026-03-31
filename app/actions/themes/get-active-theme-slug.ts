"use server";

import prisma from "@/lib/prisma";

export async function getActiveThemeSlug(): Promise<string | null> {
  const setting = await prisma.setting.findUnique({
    where: { key: "active_theme" },
  });

  return setting?.value ?? null;
}
