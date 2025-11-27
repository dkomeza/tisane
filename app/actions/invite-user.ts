"use server";

import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";

export async function inviteUser(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Tisane <onboarding@resend.dev>", // Update this with your verified domain
      to: [email],
      subject: "You have been invited to Tisane",
      react: InviteUserEmail({
        inviteLink: "http://localhost:3000/create-account",
      }),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to send email" };
  }
}
