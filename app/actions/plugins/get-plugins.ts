"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { GetPluginsResponse } from "@/lib/schemas/PluginsSchema";

export async function getPlugins(): Promise<GetPluginsResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const plugins = await prisma.plugin.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: { plugins } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
