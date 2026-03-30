"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { refresh } from "next/cache";
import { DisablePluginResponse } from "@/lib/schemas/PluginsSchema";

export async function disablePlugin(
  pluginId: string
): Promise<DisablePluginResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const plugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { enabled: false },
    });

    return { success: true, data: { plugin } };
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
