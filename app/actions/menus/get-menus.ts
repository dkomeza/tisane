"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";

import {
  GetMenusSchema,
  GetMenusRequest,
  GetMenusResponse,
} from "@/lib/schemas/MenusSchema";
import prisma, { Prisma } from "@/lib/prisma";

export async function getMenus(
  request?: GetMenusRequest
): Promise<GetMenusResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = GetMenusSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { limit, offset, search, sortBy, sortOrder } = parse.data;

    const query: Prisma.MenuFindManyArgs = {};
    const where: Prisma.MenuWhereInput = {};
    const sortFunction = sortOrder || "desc";

    query.take = limit ?? 20;
    if (offset) query.skip = offset;

    if (search) {
      where.OR = [{ title: { contains: search, mode: "insensitive" } }];
    }

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

    // We cast to any because prisma.menu might not be generated yet but we want to write the code
    const menus = await (prisma as any).menu.findMany(query);
    const count = await (prisma as any).menu.count({ where });

    return { success: true, data: { menus, total: count } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
