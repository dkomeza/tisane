"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import {
  GetPluginSchema,
  GetPluginRequest,
  GetPluginResponse,
} from "@/lib/schemas/PluginsSchema";

export async function getPlugin(
  request: GetPluginRequest
): Promise<GetPluginResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = GetPluginSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const plugin = await prisma.plugin.findUnique({
      where: { id: parse.data.pluginId },
    });

    if (!plugin) {
      throw new Error("Plugin not found");
    }

    return { success: true, data: { plugin } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
