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
import { Result } from "@/lib/types/Result";

type Page = Omit<typeof PagesSchema.$inferSelect, "content"> & {
  queryOrder: number;
};

type GetPagesResponse = Result<{ pages: Page[]; pagesCount: number }, string>;

/**
 * Recursive page group structure
 */
export type PageGroup = {
  parentId: string | null;
  page: Page;
  pages: PageGroup[];
};

// For now only grouping by parentId is supported
export type GetPageGroupsResponse = Result<
  { pages: PageGroup[]; count: number },
  string
>;

const pageColumns = getTableColumns(PagesSchema);

async function getPagesCount(): Promise<number> {
  const [totalPages] = await db
    .select({ count: count(PagesSchema.id) })
    .from(PagesSchema)
    .where(isNull(PagesSchema.deletedAt));

  return totalPages.count;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...targetPage } = pageColumns;

  try {
    const pagesCount = await getPagesCount();

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

    return { success: true, data: { pages, pagesCount } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

function buildPageGroups(pages: Page[]): PageGroup[] {
  const pageMap: Record<string, PageGroup> = {};
  const rootPages: PageGroup[] = [];

  // Initialize the page map
  pages.forEach((page) => {
    pageMap[page.id] = { parentId: page.parentId, page, pages: [] };
  });

  // Build the hierarchy
  pages.forEach((page) => {
    const pageGroup = pageMap[page.id];
    if (page.parentId && pageMap[page.parentId]) {
      pageMap[page.parentId].pages.push(pageGroup);
    } else {
      rootPages.push(pageGroup);
    }
  });

  return rootPages;
}

/**
 * Get pages grouped by their parentId. This function is meant to be used on the admin side.
 * Therefore, it requires proper authentication and authorization.
 * @param request Optional request parameters for filtering, sorting, and pagination.
 * @returns A hierarchical structure of pages grouped by parentId.
 */
export async function getPageGroups(
  request?: GetPagesRequest
): Promise<GetPageGroupsResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...targetPage } = pageColumns;

  try {
    // Counting total pages
    const pagesCount = await getPagesCount();

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

    const groupedPages = buildPageGroups(pages);

    return { success: true, data: { pages: groupedPages, count: pagesCount } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
