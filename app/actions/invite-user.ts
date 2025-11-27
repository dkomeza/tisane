"use server";

import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import z from "zod";

export async function inviteUser(email: string) {
  try {
    const parse = z.email().safeParse(email);

    if (!parse.success) {
      return { success: false, error: "Invalid email address" };
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
