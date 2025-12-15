"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";

import { GetPagesSchema, GetPagesRequest } from "@/lib/schemas/PagesSchema";
import { Result } from "@/lib/types/Result";
import prisma, { Page, Prisma } from "@/lib/prisma";

export type PageWithoutContent = Omit<Page, "content">;
export type GetPagesResponse = Result<
  { pages: PageWithoutContent[]; count: number },
  string
>;

async function getPagesCount(): Promise<number> {
  const totalPages = await prisma.page.count({
    where: { deleted_at: null },
  });

  return totalPages;
}

/**
 * Get a list of pages. This function is meant to be used on the admin side.
 * Therefore, it requires proper authentication and authorization.
 *
 * @returns An array of pages. By default, it returns the first 20 pages.
 */
export async function getPages(
  request?: GetPagesRequest
): Promise<GetPagesResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const count = await getPagesCount();

    // Validating the request
    const parse = GetPagesSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { limit, offset, lastId, search, sortBy, sortOrder, returnAll } =
      parse.data;

    if (offset && lastId) {
      throw new Error("Cannot use both offset and lastId for pagination");
    }

    // Building the query
    const query: Prisma.PageFindManyArgs = {};
    const where: Prisma.PageWhereInput = {};
    const sortFunction = sortOrder || "desc";

    query.take = limit ?? 20;
    if (offset) query.skip = offset;
    if (lastId) query.cursor = { id: lastId };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    if (!returnAll) where.deleted_at = null;
    query.orderBy = [
      sortBy
        ? {
            [sortBy]: sortFunction,
          }
        : {
            created_at: sortFunction,
          },
      {
        id: sortFunction,
      },
    ];
    query.where = where;
    query.omit = { content: true };

    const pages = await prisma.page.findMany(query);

    return { success: true, data: { pages, count } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
