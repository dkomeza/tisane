"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { refresh } from "next/cache";
import { DeletePluginResponse } from "@/lib/schemas/PluginsSchema";

export async function deletePlugin(
  pluginId: string
): Promise<DeletePluginResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!plugin) {
      throw new Error("Plugin not found");
    }

    if (plugin.repoUrl === null) {
      throw new Error(
        "Built-in plugins cannot be deleted. Disable them instead."
      );
    }

    await prisma.plugin.delete({ where: { id: pluginId } });

    return { success: true, data: { success: true } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  } finally {
    refresh();
  }
}
