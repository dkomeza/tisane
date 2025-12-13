"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";

import { db } from "@/src/db/drizzle";
import { GetPagesSchema, GetPagesRequest } from "@/lib/schemas/PagesSchema";
import {
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  isNull,
  sql,
} from "drizzle-orm";
import { pages as PagesSchema } from "@/src/db/schema/pages";

type Page = Omit<typeof PagesSchema.$inferSelect, "content"> & {
  queryOrder: number;
};

type GetPagesResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      pages: Array<Page>;
      pagesCount: number;
    };

const pageColumns = getTableColumns(PagesSchema);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...targetPage } = pageColumns;

  try {
    // Counting total pages
    const [totalPages] = await db
      .select({ count: count(PagesSchema.id) })
      .from(PagesSchema)
      .where(isNull(PagesSchema.deletedAt));

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

    query.where = (pages, { and, ilike, or, gt, lt, isNull }) => {
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
        const sortDirection = sortOrder === "asc" ? "asc" : "desc";

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

      if (!returnAll) {
        conditions.push(isNull(pages.deletedAt));
      }

      return conditions.length ? and(...conditions) : undefined;
    };

    const pages = await db
      .select({
        ...targetPage,
        queryOrder: sql<number>`ROW_NUMBER() OVER (ORDER BY ${
          sortBy ? pageColumns[sortBy] : PagesSchema.createdAt
        } ${sortOrder === "asc" ? sql`ASC` : sql`DESC`}, ${PagesSchema.id} ${
          sortOrder === "asc" ? sql`ASC` : sql`DESC`
        })`,
      })
      .from(PagesSchema)
      .where(isNull(PagesSchema.deletedAt))
      .orderBy(
        sortBy
          ? sortOrder === "asc"
            ? asc(pageColumns[sortBy])
            : desc(pageColumns[sortBy])
          : sortOrder === "asc"
            ? asc(PagesSchema.createdAt)
            : desc(PagesSchema.createdAt),
        sortOrder === "asc" ? asc(PagesSchema.id) : desc(PagesSchema.id)
      )
      .limit(query.limit || 20)
      .offset(query.offset ?? 0);
    // const pages = await db.query.pages.findMany({
    //   ...query,
    //   orderBy: (pages, { asc, desc }) => {
    //     const orderFn = sortOrder === "asc" ? asc : desc; // Default to desc
    //     return [
    //       sortBy ? orderFn(pages[sortBy]) : orderFn(pages.createdAt),
    //       orderFn(pages.id),
    //     ];
    //   },
    //   columns: {
    //     content: false,
    //   },
    // });

    return { success: true, pages, pagesCount: totalPages.count };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
