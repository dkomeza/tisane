"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";
import {
  GetMenuSchema,
  GetMenuRequest,
  GetMenuResponse,
} from "@/lib/schemas/MenusSchema";
import prisma from "@/lib/prisma";
import { DBComponent, preprocess } from "@/components/registry";

export async function getMenu(
  request: GetMenuRequest,
): Promise<GetMenuResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.read")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = GetMenuSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { menuId } = parse.data;

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      return { success: false, error: "Menu not found" };
    }

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
