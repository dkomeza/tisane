import z from "zod";

type PasswordRequirement = {
  description: string;
  function: (prev: z.ZodString) => z.ZodString;
};

export const passwordRules: PasswordRequirement[] = [
  {
    description: "At least 8 characters",
    function: (prev) => prev.min(8, "At least 8 characters"),
  },
  {
    description: "At least one uppercase letter",
    function: (prev) => prev.regex(/[A-Z]/, "At least one uppercase letter"),
  },
  {
    description: "At least one lowercase letter",
    function: (prev) => prev.regex(/[a-z]/, "At least one lowercase letter"),
  },
  {
    description: "At least one number",
    function: (prev) => prev.regex(/[0-9]/, "At least one number"),
  },
];

export const PasswordSchema = passwordRules.reduce(
  (schema, rule) => rule.function(schema),
  z.string(),
);

export const BaseSignupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Please enter your name")
      .max(30, "Name must be at most 30 characters"),
    surname: z
      .string()
      .min(1, "Please enter your surname")
      .max(30, "Surname must be at most 30 characters"),
    password: PasswordSchema,
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((val) => val.password === val.passwordConfirm, {
    error: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const SignupSchema = BaseSignupSchema.extend({
  token: z.string("Token is required"),
});

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    passwordConfirm: z.string().min(1, "Please confirm your password"),
    token: z.string("Token is required"),
  })
  .refine((val) => val.password === val.passwordConfirm, {
    error: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export type SignupRequest = z.infer<typeof SignupSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
