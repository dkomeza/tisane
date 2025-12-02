"use server";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";

import { db } from "@/src/db/drizzle";
import z from "zod";
import { eq } from "drizzle-orm";

export type getPagesRequest = {
  // Pagination
  limit?: number;
  offset?: number;
  lastId?: string;

  // Filters
  search?: string; // Search by title or content (in the future will support tags, etc.)

  // Sorting
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
};

const GetPagesSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().positive().optional(),
  lastId: z.string().optional(),

  search: z.string().min(1).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Get a list of pages. This function is meant to be used on the admin side.
 * Therefore, it requires proper authentication and authorization.
 *
 * @returns An array of pages. By default, it returns the first 20 pages.
 */
export async function getPages(request?: getPagesRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validating the request
    if (!request) {
      return {
        success: true,
        pages: await db.query.pages.findMany({ limit: 20 }),
      };
    }

    const parse = GetPagesSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { limit, offset, lastId, search, sortBy, sortOrder } = parse.data;

    if (offset && lastId) {
      throw new Error("Cannot use both offset and lastId for pagination");
    }

    // Building the query
    const query: Parameters<typeof db.query.pages.findMany>[0] = {};

    query.limit = limit ?? 20;
    if (offset) query.offset = offset;

    let last = null;
    if (lastId) {
      last = await db.query.pages.findFirst({
        where: (pages) => eq(pages.id, lastId),
      });

      if (!last) {
        throw new Error("Invalid lastId for pagination");
      }
    }

    query.where = (pages, { and, ilike, or, gt, lt }) => {
      const conditions = [];
      if (search)
        conditions.push(
          or(
            ilike(pages.title, `%${search}%`),
            ilike(pages.content, `%${search}%`)
          )
        );

      if (last) {
        const sortColumn = sortBy ? pages[sortBy] : pages.createdAt;
        const sortDirection = sortOrder === "desc" ? "desc" : "asc";

        if (sortDirection === "asc") {
          conditions.push(
            or(
              gt(sortColumn, last[sortBy ?? "createdAt"]),
              and(
                eq(sortColumn, last[sortBy ?? "createdAt"]),
                gt(pages.id, last.id)
              )
            )
          );
        } else {
          conditions.push(
            or(
              lt(sortColumn, last[sortBy ?? "createdAt"]),
              and(
                eq(sortColumn, last[sortBy ?? "createdAt"]),
                lt(pages.id, last.id)
              )
            )
          );
        }
      }

      return conditions.length ? and(...conditions) : undefined;
    };

    const pages = await db.query.pages.findMany({
      ...query,
      orderBy: (pages, { asc, desc }) => {
        const orderFn = sortOrder === "desc" ? desc : asc;
        return [
          sortBy ? orderFn(pages[sortBy]) : orderFn(pages.createdAt),
          orderFn(pages.id),
        ];
      },
    });

    return { success: true, pages };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
