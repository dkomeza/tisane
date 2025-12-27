import { z } from "zod";

export const PageStatus = ["draft", "published"] as const;

export const pageSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  status: z.enum(PageStatus),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  content: z.string().optional(),
});

export type PageFormValues = z.infer<typeof pageSchema>;