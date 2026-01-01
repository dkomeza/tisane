import z from "zod";

export const GetPagesSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  lastId: z.string().optional(),

  search: z.string().min(1).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),

  returnAll: z.boolean().optional(),
});

export const PageStatus = ["draft", "published", "archived"] as const;

export const PageSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  status: z.enum(PageStatus),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  content: z.string().optional(),
});

export type PageFormValues = z.infer<typeof PageSchema>;
export type GetPagesRequest = z.infer<typeof GetPagesSchema>;
