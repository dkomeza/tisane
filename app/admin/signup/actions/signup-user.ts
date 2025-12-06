"use server";

import { z } from "zod";
import { auth } from "@/lib/auth/server";

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
      return { error: "Wrong Data" };
    }

    const { data } = parse;

    const resetResult = await auth.api.resetPassword({
      body: {
        newPassword: data.password,
        token: data.token,
      },
    });

    if (!resetResult.status) {
      return { error: "Error resetting password" };
    }

    const updateResult = await auth.api.updateUser({
      body: {
        name: `${data.name} ${data.surname}`,
      },
    });
    console.log(updateResult);

    return { error: "" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error during signup" };
  }
}
