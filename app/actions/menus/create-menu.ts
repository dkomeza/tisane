"use server";

import { hasPermission } from "@/lib/permissions";
import { authorize } from "@/lib/auth/authorize";
import {
  CreateMenuSchema,
  CreateMenuRequest,
  CreateMenuResponse,
} from "@/lib/schemas/MenusSchema";
import prisma from "@/lib/prisma";
import { preprocess } from "@/components/registry";

export async function createMenu(
  request: CreateMenuRequest
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

    const menu = await (prisma as any).menu.create({
      data: {
        title,
        slug,
        content: content ? JSON.parse(JSON.stringify(content)) : [],
      },
    });

    if (menu.content) {
      menu.content = preprocess(menu.content);
    }

    return { success: true, data: { menu } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
