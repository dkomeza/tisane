"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { db } from "@/src/db/drizzle";
import { pages } from "@/src/db/schema";
import { inArray } from "drizzle-orm";
import { refresh } from "next/cache";

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
    const res = await db
      .update(pages)
      .set({ deletedAt: new Date() })
      .where(inArray(pages.id, pageIds))
      .returning();

    if (res.length === 0) {
      throw new Error("No pages found to delete");
    }

    return {
      success: true,
      message: `${res.length} pages deleted successfully`,
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
