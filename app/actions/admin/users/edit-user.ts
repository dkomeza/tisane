"use server";

import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";

export async function editUser(id: string, name: string, role: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "users.manage")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parseId = z.string().min(1).safeParse(id);
    const parseName = z.string().min(1).max(100).safeParse(name);
    const parseRole = z.enum(["user", "admin"]).safeParse(role);

    if (!parseId.success) {
      throw new Error("Invalid user ID");
    }

    if (!parseName.success) {
      throw new Error("Invalid name");
    }

    if (!parseRole.success) {
      throw new Error("Invalid role");
    }

    const res = await auth.api.adminUpdateUser({
      body: {
        data: {
          name: parseName.data,
          role: parseRole.data,
        },
        userId: parseId.data,
      },

      headers: await headers(),
    });

    if (!res) {
      throw new Error("Failed to update user");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}
