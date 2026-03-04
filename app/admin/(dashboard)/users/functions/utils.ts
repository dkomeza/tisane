import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import prisma from "@/lib/prisma";

export async function extractInviteToken(id: string) {
  const verification = await prisma.verification.findFirst({
    where: {
      value: id,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const token = verification
    ? verification.identifier.replaceAll("reset-password:", "")
    : null;

  return token;
}

export async function sendInviteEmail(to: string, token: string) {
  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    throw new Error("SITE_URL is not defined");
  }

  return await resend.emails.send({
    from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>",
    to: [to],
    subject: "You're invited to join Tisane",
    react: InviteUserEmail({
      inviteLink: `${siteUrl}/admin/signup?token=${token}`,
    }),
  });
}
