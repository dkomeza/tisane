"use server";

import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";
import { db } from "@/src/db/drizzle";
import { eq } from "drizzle-orm";

import { extractInviteToken, sendInviteEmail } from "./utils";

export async function inviteUser(email: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "users.manage")) {
    return { success: false, error: "Unauthorized" };
  }

  let newUserId: string | null = null;

  try {
    const parse = z.email().safeParse(email);

    if (!parse.success) {
      return { success: false, error: "Invalid email address" };
    }

    // Check if user already exists in your database here
    const exists = await db.query.user.findFirst({
      where: (user) => eq(user.email, parse.data),
    });

    if (exists) {
      return { success: false, error: "User already exists" };
    }

    const res = await auth.api.createUser({
      body: {
        email: parse.data,
        name: "",
        password: crypto.randomUUID(), // Temporary password, user should reset it
        role: "user",
      },
      headers: await headers(),
    });

    if (!res) {
      return { success: false, error: "Failed to create user" };
    }

    newUserId = res.user.id;

    await auth.api.requestPasswordReset({
      body: { email: res.user.email, redirectTo: "/admin/signup" },
      headers: await headers(),
    });

    const token = await extractInviteToken(res.user.id);

    if (!token) {
      throw new Error("Failed to generate invite token");
    }

    const { error } = await sendInviteEmail(res.user.email, token || "");

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    // Rollback: delete the user if created
    if (newUserId) {
      await auth.api.removeUser({
        body: {
          userId: newUserId,
        },
        headers: await headers(),
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
