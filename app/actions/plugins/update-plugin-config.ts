"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma, { Prisma } from "@/lib/prisma";
import { refresh } from "next/cache";
import {
  UpdatePluginConfigSchema,
  UpdatePluginConfigRequest,
  UpdatePluginConfigResponse,
} from "@/lib/schemas/PluginsSchema";
import { pluginMap } from "@/plugins/index";

export async function updatePluginConfig(
  request: UpdatePluginConfigRequest
): Promise<UpdatePluginConfigResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = UpdatePluginConfigSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { pluginId, config } = parse.data;

    const dbPlugin = await prisma.plugin.findUnique({
      where: { id: pluginId },
    });

    if (!dbPlugin) {
      throw new Error("Plugin not found");
    }

    // If the plugin is active and has a configSchema, validate the config
    const activePlugin = pluginMap[dbPlugin.slug];
    if (activePlugin?.configSchema) {
      const configParse = activePlugin.configSchema.safeParse(config);
      if (!configParse.success) {
        throw new Error(
          `Invalid config: ${configParse.error.issues.map((i: { message: string }) => i.message).join(", ")}`
        );
      }
    }

    const plugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { config: config as Prisma.InputJsonValue },
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
