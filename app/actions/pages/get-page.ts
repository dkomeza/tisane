"use server";

import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { db } from "@/src/db/drizzle";
import { eq } from "drizzle-orm";
import z from "zod";

const GetPageSchema = z
  .object({
    pageId: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  })
  .refine((data) => data.pageId || data.slug, {
    message: "Either pageId or slug must be provided",
  });

type GetPagesRequest = z.infer<typeof GetPageSchema>;

export async function getPage(request: GetPagesRequest) {
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

    const query: Parameters<typeof db.query.pages.findFirst>[0] = {};

    if (pageId) {
      query.where = (pages) => eq(pages.id, pageId);
    } else if (slug) {
      // Default to pageId if both are provided
      query.where = (pages) => eq(pages.slug, slug);
    }

    const page = await db.query.pages.findFirst({
      ...query,
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
