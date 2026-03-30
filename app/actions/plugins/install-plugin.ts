"use server";

import { authorize } from "@/lib/auth/authorize";
import prisma from "@/lib/prisma";
import { refresh } from "next/cache";
import {
  InstallPluginSchema,
  InstallPluginRequest,
  InstallPluginResponse,
} from "@/lib/schemas/PluginsSchema";

function slugFromRepoUrl(repoUrl: string): string {
  const parts = repoUrl.replace(/\.git$/, "").split("/");
  const repoName = parts[parts.length - 1] ?? "plugin";
  return repoName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function installPlugin(
  request: InstallPluginRequest
): Promise<InstallPluginResponse> {
  const { session } = await authorize();

  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = InstallPluginSchema.safeParse(request);

    if (!parse.success) {
      throw new Error("Invalid request parameters");
    }

    const { repoUrl, branch, displayName } = parse.data;
    const slug = slugFromRepoUrl(repoUrl);

    const existing = await prisma.plugin.findFirst({
      where: { OR: [{ repoUrl }, { slug }] },
    });

    if (existing) {
      throw new Error(
        existing.repoUrl === repoUrl
          ? "A plugin with this repository URL is already installed"
          : `A plugin with the slug "${slug}" already exists`
      );
    }

    const plugin = await prisma.plugin.create({
      data: {
        slug,
        displayName: displayName ?? slug,
        repoUrl,
        branch,
        status: "pending",
        enabled: false,
      },
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
