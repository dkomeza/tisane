import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError, betterAuth } from "better-auth";
import InviteUserEmail from "@/components/emails/InviteUserEmail";
import { resend } from "../resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tisane",
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      const isInvite = !data.user.emailVerified;

      if (isInvite) return; // Invitation emails are handled elsewhere for better UX

      const subject = "Reset your Tisane password";

      const emailBody = `Click the following link to reset your password: ${data.url}`;

      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Tisane <onboarding@resend.dev>",
        to: [data.user.email],
        subject,
        react: emailBody,
      });

      if (error) {
        throw new APIError("INTERNAL_SERVER_ERROR", { message: error.message });
      }
    },
  },
  plugins: [admin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
