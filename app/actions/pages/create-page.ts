"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { refresh } from "next/cache";
import prisma from "@/lib/prisma";
import { CreatePageSchema, CreatePageRequest } from "@/lib/schemas/PagesSchema";

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
