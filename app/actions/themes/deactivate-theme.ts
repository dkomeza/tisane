"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function deactivateTheme() {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    await prisma.setting.deleteMany({
      where: { key: "active_theme" },
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
