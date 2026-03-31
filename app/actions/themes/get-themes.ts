"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";

export async function getThemes() {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const themes = await prisma.plugin.findMany({
      where: { type: "theme" },
      orderBy: { createdAt: "desc" },
    });

    return { success: true as const, data: { themes } };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
