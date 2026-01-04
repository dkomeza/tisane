"use server";

import { auth } from "@/lib/auth/server";
import { isSetupComplete } from "@/lib/is-setup";
import prisma from "@/lib/prisma";
import { OnboardingSchema } from "@/lib/schemas/OnboardingSchema";
import { redirect } from "next/navigation";

export async function completeOnboarding(_: unknown, formData: FormData) {
  const isSetup = await isSetupComplete();

  if (isSetup) {
    return { error: "Setup is already complete" };
  }

  const rawData = {
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    siteUrl: formData.get("siteUrl"),
  };

  try {
    const parse = OnboardingSchema.safeParse(rawData);

    if (!parse.success) {
      return { error: `${parse.error.message}` };
    }

    const { data } = parse;

    // Create user
    const user = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: `${data.name} ${data.surname}`,
        rememberMe: true,
      },
      asResponse: false,
    });

    if (!user) {
      return { error: "Failed to create user" };
    }

    await prisma.$transaction(async (tx) => {
      await prisma.user.update({
        where: { id: user.user.id },
        data: {
          role: "admin",
          emailVerified: true,
        },
      });

      await tx.setting.create({
        data: {
          key: "site_url",
          value: data.siteUrl,
        },
      });

      // Mark setup as complete
      await prisma.setting.create({
        data: {
          key: "setup_complete",
          value: "true",
        },
      });
    });
  } catch (e) {
    // Rollback in case of error
    const existingUser = await prisma.user.findUnique({
      where: { email: String(rawData.email) },
    });
    if (existingUser) {
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    return {
      error: e instanceof Error ? e.message : "Error during onboarding",
    };
  }

  redirect("/admin");
}
