"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { refresh } from "next/cache";
import z from "zod";
import prisma, { PageVisibility, PageStatus } from "@/lib/prisma";

const CreatePageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),

  status: z.enum(PageStatus).optional(),
  visibility: z.enum(PageVisibility).optional(),

  content: z.string().min(1),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  openGraphImage: z.string().optional(),
  canonicalUrl: z.string().optional(),

  order: z.number().int().optional(),
  parentId: z.string().optional(),

  tags: z.array(z.string()).optional(), // Array of tag IDs
});

type CreatePageRequest = z.infer<typeof CreatePageSchema>;

export async function createPage(request: CreatePageRequest) {
  const { session } = await authorize();

  if (!hasPermission(session, "content.create")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = CreatePageSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { tags, ...pageData } = parse.data;

    const page = await prisma.page.create({
      data: {
        ...pageData,
        ...(tags && {
          tags: {
            connect: tags.map((tagId) => ({ id: tagId })),
          },
        }),
      },
    });

    if (!page) {
      throw new Error("Failed to create page");
    }

    return { success: true, page };
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
