"use server";

import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";
import { db } from "@/src/db/drizzle";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "users.manage")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = z.string().min(1).safeParse(userId);

    if (!parse.success) {
      return { success: false, error: "Invalid user ID" };
    }

    // Check if the user is trying to delete themselves
    if (session?.user.id === parse.data) {
      return {
        success: false,
        error: "You cannot delete your own account from the users tab",
      };
    }

    const res = await auth.api.removeUser({
      body: {
        userId: parse.data,
      },
      headers: await headers(),
    });

    if (!res) {
      return { success: false, error: "Failed to delete user" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
