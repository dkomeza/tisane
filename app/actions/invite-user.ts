"use server";

import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import z from "zod";

import { auth } from "@/lib/auth/server";
import { hasPermission } from "@/lib/permissions";
import { headers } from "next/headers";
import { db } from "@/src/db/drizzle";
import { user } from "@/src/db/schema/auth";
import { eq } from "drizzle-orm";

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

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>", // Use  pclientenv var or fallback to test address
      to: [parse.data],
      subject: "You have been invited to Tisane",
      react: InviteUserEmail({
        inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/create-account`,
      }),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
