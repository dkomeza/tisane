"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";
import {
  UpdateMenuSchema,
  UpdateMenuRequest,
  UpdateMenuResponse,
} from "@/lib/schemas/MenusSchema";
import prisma from "@/lib/prisma";
import { DBComponent, preprocess } from "@/components/registry";

export async function updateMenu(
  request: UpdateMenuRequest,
): Promise<UpdateMenuResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.create")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = UpdateMenuSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { menuId, title, slug, content } = parse.data;

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        title,
        slug,
        content: content ? JSON.parse(JSON.stringify(content)) : undefined,
      },
    });

    const res = {
      ...menu,
      content: preprocess(menu.content)[0] as DBComponent<"menu">,
    };

    return { success: true, data: { menu: res } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
