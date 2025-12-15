"use server";

import { SignupSchema } from "@/lib/schemas/SignupSchema";
import { auth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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

    const verification = await prisma.verification.findFirst({
      where: {
        identifier: `reset-password:${data.token}`,
        expiresAt: {
          gt: new Date(),
        },
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

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${data.name} ${data.surname}`,
        emailVerified: true,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error during signup" };
  }

  redirect("/admin/login");
}
