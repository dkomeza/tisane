import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import { resend } from "../resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tisane",
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      const isInvite = !data.user.emailVerified;

      const subject = isInvite
        ? "You're invited to join Tisane"
        : "Reset your Tisane password";

      const baseUrl = new URL(
        request?.url || process.env.BETTER_AUTH_URL || "http://localhost:3000"
      ).origin;

      const emailBody = isInvite
        ? InviteUserEmail({
            inviteLink: `${baseUrl}/admin/signup?token=${data.token}`,
          })
        : `Click the following link to reset your password: ${data.url}`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>",
        to: [data.user.email],
        subject,
        react: emailBody,
      });
    },
  },
  plugins: [admin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
