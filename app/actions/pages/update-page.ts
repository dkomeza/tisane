"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { refresh, updateTag } from "next/cache";
import {
  UpdatePageRequest,
  UpdatePageResponse,
  UpdatePageSchema,
} from "@/lib/schemas/PagesSchema";
import { preprocess } from "@/components/registry";

export async function updatePage(
  request: UpdatePageRequest
): Promise<UpdatePageResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.create")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = UpdatePageSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { pageId, tags, ...updateData } = parse.data;

    const existingPage = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!existingPage) {
      return { success: false, error: "Page not found" };
    }

    const updatedPage = await prisma.page.update({
      data: { ...updateData },
      where: { id: pageId },
    });

    if (!updatedPage) {
      throw new Error("Failed to update page");
    }

    if (tags) {
      await prisma.page.update({
        where: { id: pageId },
        data: {
          tags: {
            set: [],
            connect: tags.map((tagId) => ({ id: tagId })),
          },
        },
      });
    }

    updateTag(`page[${updatedPage.slug}]`);

    if (existingPage.slug !== updatedPage.slug) {
      updateTag(`page[${existingPage.slug}]`);
    }

    const content = preprocess(updatedPage.content);

    const res = {
      ...updatedPage,
      content,
    };

    return { success: true, data: { page: res } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    refresh();
  }
}

export async function restorePage(pageId: string) {
  const res = await restorePages([pageId]);

  if (res.success) {
    res.message = "Page restored successfully"; // Customize message for single restoration
  }

  return res;
}

export async function restorePages(pageIds: string[]) {
  const { session } = await authorize();

  if (!hasPermission(session, "content.delete")) {
    return { success: false, error: "Unauthorized" };
  }

  if (pageIds.length === 0) {
    return { success: false, error: "No page IDs provided" };
  }

  try {
    const updated = await prisma.page.updateMany({
      data: { deleted_at: null },
      where: {
        id: {
          in: pageIds,
        },
      },
    });

    if (updated.count === 0) {
      throw new Error("No pages found to restore");
    }

    return {
      success: true,
      message: `${updated.count} pages restored successfully`,
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
