"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export async function activateTheme(slug: string) {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const plugin = await prisma.plugin.findUnique({
      where: { slug },
    });

    if (!plugin || plugin.type !== "theme") {
      return { success: false as const, error: "Theme not found" };
    }

    if (!plugin.enabled || plugin.status !== "installed") {
      return { success: false as const, error: "Theme is not installed or enabled" };
    }

    await prisma.setting.upsert({
      where: { key: "active_theme" },
      update: { value: slug },
      create: { key: "active_theme", value: slug },
    });

    updateTag("active-theme");

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
