"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMenu(menuId: string) {
  const { session } = await authorize();

  if (!hasPermission(session, "content.delete")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await (prisma as any).menu.delete({
      where: { id: menuId },
    });

    revalidatePath("/admin/menus");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
