import { BaseSignupSchema } from "./SignupSchema";
import { z } from "zod";

export const OnboardingSchema = BaseSignupSchema.safeExtend({
  email: z.email("Please enter a valid email address"),
  siteUrl: z.url("Please enter a valid URL"),
});

export type OnboardingRequest = z.infer<typeof OnboardingSchema>;
