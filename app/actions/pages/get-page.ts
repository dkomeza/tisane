"use server";

import { DBComponentsArraySchema } from "@/components/registry";
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import prisma, { Prisma } from "@/lib/prisma";
import { GetPageSchema, GetPageRequest } from "@/lib/schemas/PagesSchema";

export async function getPage(request: GetPageRequest) {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = GetPageSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { pageId, slug } = parse.data;

    const query: Prisma.PageFindFirstArgs = {
      include: {
        tags: true,
      },
    };

    if (pageId) {
      query.where = {
        id: pageId,
      };
    } else if (slug) {
      query.where = {
        slug: slug,
      };
    }

    const page = await prisma.page.findFirst(query);

    if (!page) {
      throw new Error("Page not found");
    }

    const contentParse = DBComponentsArraySchema.safeParse(page.content);

    if (!contentParse.success) {
      throw new Error("Corrupted page content");
    }

    const res = {
      ...page,
      content: JSON.stringify(contentParse.data),
    };

    return { success: true, page: res };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
