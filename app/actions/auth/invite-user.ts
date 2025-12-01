"use server";

import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";
import { db } from "@/src/db/drizzle";
import { and, desc, eq, gt } from "drizzle-orm";

import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import { user } from "@/src/db/schema";

export async function inviteUser(email: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!hasPermission(session, "users.manage")) {
    return { success: false, error: "Unauthorized" };
  }

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

    await auth.api.requestPasswordReset({
      body: { email: res.user.email, redirectTo: "/admin/signup" },
      headers: await headers(),
    });

    const verification = await db.query.verification.findFirst({
      where: (verification) => {
        const id = eq(verification.value, res.user.id);
        const expiry = gt(verification.expiresAt, new Date());

        return and(id, expiry);
      },
      orderBy: (verification) => desc(verification.createdAt),
    });

    const token = verification
      ? verification.identifier.replaceAll("reset-password:", "")
      : null;

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>",
      to: [res.user.email],
      subject: "You're invited to join Tisane",
      react: InviteUserEmail({
        inviteLink: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/admin/signup?token=${token}`,
      }),
    });

    if (error) {
      await db.delete(user).where(eq(user.id, res.user.id));
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
