"use server";

import prisma from "@/lib/prisma";
import { GetMenuResponse } from "@/lib/schemas/MenusSchema";
import { preprocess } from "@/components/registry";

export async function getMenuBySlug(slug: string): Promise<GetMenuResponse> {
  try {
    const menu = await prisma.menu.findUnique({
      where: { slug: slug },
    });

    if (!menu) {
      return { success: false, error: "Menu not found" };
    }

    if (menu.content) {
      menu.content = preprocess(menu.content);
    } else {
      menu.content = [];
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
