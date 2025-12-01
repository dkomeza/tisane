"use server";

import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";
import { extractInviteToken, sendInviteEmail } from "./utils";

export async function resendInvite(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "users.manage")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const parse = z.string().min(1).safeParse(id);

    if (!parse.success) {
      return { success: false, error: "Invalid user ID" };
    }

    const user = await auth.api.getUser({
      query: {
        id: parse.data,
      },
      headers: await headers(),
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.emailVerified) {
      return { success: false, error: "User has already accepted the invite" };
    }

    // Check if user exists
    await auth.api.requestPasswordReset({
      body: { email: user.email, redirectTo: "/admin/signup" },
      headers: await headers(),
    });

    const token = await extractInviteToken(user.id);

    if (!token) {
      return { success: false, error: "Failed to generate invite token" };
    }

    const { error } = await sendInviteEmail(user.email, token);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
