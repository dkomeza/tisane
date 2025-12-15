"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import prisma, { PageStatus, PageVisibility } from "@/lib/prisma";
import { refresh } from "next/cache";
import z from "zod";

const UpdatePageSchema = z.object({
  pageId: z.string().min(1),

  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),

  status: z.enum(PageStatus).optional(),
  visibility: z.enum(PageVisibility).optional(),

  content: z.string().min(1).optional(),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  openGraphImage: z.string().optional(),
  canonicalUrl: z.string().optional(),

  order: z.number().int().optional(),
  parentId: z.string().optional(),

  tags: z.array(z.string()).optional(), // Array of tag IDs
});

type UpdatePageRequest = z.infer<typeof UpdatePageSchema>;

export async function updatePage(request: UpdatePageRequest) {
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

    return { success: true, page: updatedPage };
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
