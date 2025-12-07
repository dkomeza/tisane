"use server";

import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { db } from "@/src/db/drizzle";
import { redirect } from "next/navigation";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

const SignupSchema = z
  .object({
    name: z.string().min(1).max(30),
    surname: z.string().min(1).max(30),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    passwordConfirm: z.string().min(1),
    token: z.any(),
  })
  .refine((val) => val.password === val.passwordConfirm);

export async function signupUser(_: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    surname: formData.get("surname"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    token: formData.get("token"),
  };
  try {
    const parse = SignupSchema.safeParse(rawData);

    if (!parse.success) {
      throw new Error("Invalid form data");
    }

    const { data } = parse;

    const verification = await db.query.verification.findFirst({
      where(fields, { ilike }) {
        return ilike(fields.identifier, `reset-password:${data.token}`);
      },
    });

    if (!verification) {
      throw new Error("Invalid or expired token");
    }

    const userId = verification.value;

    const resetResult = await auth.api.resetPassword({
      body: {
        newPassword: data.password,
        token: data.token,
      },
      asResponse: true,
    });

    if (!resetResult.ok) {
      throw new Error("Error resetting password");
    }

    await db
      .update(user)
      .set({
        name: `${data.name} ${data.surname}`,
        emailVerified: true,
      })
      .where(eq(user.id, userId));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error during signup" };
  }

  redirect("/admin/login");
}
