"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { refresh, revalidateTag } from "next/cache";

export async function deletePage(pageId: string) {
  const res = await deletePages([pageId]);

  if (res.success) {
    res.message = "Page deleted successfully"; // Customize message for single deletion
  }

  return res;
}

export async function deletePages(pageIds: string[]) {
  const { session } = await authorize();
  if (!hasPermission(session, "content.delete")) {
    return { success: false, error: "Unauthorized" };
  }

  if (pageIds.length === 0) {
    return { success: false, error: "No page IDs provided" };
  }

  try {
    const pages = await prisma.page.findMany({
      where: {
        id: {
          in: pageIds,
        },
        deleted_at: null,
      },
    });

    const updated = await prisma.page.updateMany({
      data: { deleted_at: new Date() },
      where: {
        id: {
          in: pageIds,
        },
      },
    });

    if (updated.count === 0) {
      throw new Error("No pages found to delete");
    }

    for (const page of pages) {
      revalidateTag(`page[${page.slug}]`, "max");
    }

    return {
      success: true,
      message: `${updated.count} pages deleted successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  } finally {
    refresh();
  }
}
