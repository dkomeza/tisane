"use server";

import prisma from "@/lib/prisma";
import { GetMenuResponse } from "@/lib/schemas/MenusSchema";
import { DBComponent, preprocess } from "@/components/registry";

export async function getMenuBySlug(slug: string): Promise<GetMenuResponse> {
  try {
    const menu = await prisma.menu.findUnique({
      where: { slug: slug },
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
