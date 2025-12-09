import { resend } from "@/lib/resend";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import { db } from "@/src/db/drizzle";
import { and, desc, eq, gt } from "drizzle-orm";

export async function extractInviteToken(id: string) {
  const verification = await db.query.verification.findFirst({
    where: (verification) => {
      const idCond = eq(verification.value, id);
      const expiryCond = gt(verification.expiresAt, new Date());
      return and(idCond, expiryCond);
    },
    orderBy: (verification) => desc(verification.createdAt),
  });

  const token = verification
    ? verification.identifier.replaceAll("reset-password:", "")
    : null;

  return token;
}

export async function sendInviteEmail(to: string, token: string) {
  return await resend.emails.send({
    from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>",
    to: [to],
    subject: "You're invited to join Tisane",
    react: InviteUserEmail({
      inviteLink: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/admin/signup?token=${token}`,
    }),
  });
}
