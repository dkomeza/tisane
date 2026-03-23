"use server";

import prisma from "@/lib/prisma";
import { authorize } from "@/lib/auth/authorize";

export async function updateGithubSettings(token: string) {
  const { authorized } = await authorize();
  
  if (!authorized) {
    throw new Error("Unauthorized");
  }

  await prisma.setting.upsert({
    where: { key: "github_token" },
    update: { value: token },
    create: { key: "github_token", value: token },
  });

  return { success: true };
}
