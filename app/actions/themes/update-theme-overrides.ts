"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma, { Prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function updateThemeOverrides(
  pluginId: string,
  overrides: Record<string, unknown>
) {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin || plugin.type !== "theme") {
      return { success: false as const, error: "Theme not found" };
    }

    await prisma.plugin.update({
      where: { id: pluginId },
      data: { themeOverrides: overrides as Prisma.InputJsonValue },
    });

    revalidateTag("active-theme");

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
