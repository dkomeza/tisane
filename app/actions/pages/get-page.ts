"use server";

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

    return { success: true, page };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
