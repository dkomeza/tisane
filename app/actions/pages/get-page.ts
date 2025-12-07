"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { db } from "@/src/db/drizzle";
import { eq } from "drizzle-orm";

export async function getPage(pageId: string) {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const page = await db.query.pages.findFirst({
      where: (pages) => eq(pages.id, pageId),
    });

    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
