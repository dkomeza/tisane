"use server";

import { revalidatePath } from "next/cache";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";
import {
  CreateMenuSchema,
  CreateMenuRequest,
  CreateMenuResponse,
} from "@/lib/schemas/MenusSchema";
import prisma from "@/lib/prisma";
import { DBComponent, preprocess } from "@/components/registry";

export async function createMenu(
  request: CreateMenuRequest,
): Promise<CreateMenuResponse> {
  const { session } = await authorize();

  if (!hasPermission(session, "content.create")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = CreateMenuSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { title, slug, content } = parse.data;

    const menu = await prisma.menu.create({
      data: {
        title,
        slug,
        content: content ? JSON.parse(JSON.stringify(content)) : [],
      },
    });

    const res = {
      ...menu,
      content: preprocess(menu.content)[0] as DBComponent<"menu">,
    };

    revalidatePath("/admin/menus");
    return { success: true, data: { menu: res } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
