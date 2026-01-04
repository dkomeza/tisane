import { SignupSchema } from "./SignupSchema";
import { z } from "zod";

export const OnboardingSchema = SignupSchema.omit({
  token: true,
}).safeExtend({
  email: z.email("Please enter a valid email address"),
  siteUrl: z.url("Please enter a valid URL"),
});

export type OnboardingRequest = z.infer<typeof OnboardingSchema>;
