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

export type GetPagesRequest = z.infer<typeof GetPagesSchema>;
