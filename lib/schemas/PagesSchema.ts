import z from "zod";
import { PageStatus, PageVisibility } from "../prisma";

export const GetPagesSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  lastId: z.string().optional(),

  search: z.string().min(1).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),

  returnAll: z.boolean().optional(),
});

export const CreatePageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),

  status: z.enum(Object.values(PageStatus)).optional(),
  visibility: z.enum(Object.values(PageVisibility)).optional(),

  content: z.string().min(1),

  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  open_graph_image: z.string().optional(),
  canonical_url: z.string().optional(),

  order: z.number().int().optional(),

  tags: z.array(z.string()).optional(), // Array of tag IDs
});

export const GetPageSchema = z
  .object({
    pageId: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  })
  .refine((data) => data.pageId || data.slug, {
    message: "Either pageId or slug must be provided",
  });

export const UpdatePageSchema = z.object({
  pageId: z.string().min(1),

  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),

  status: z.enum(Object.values(PageStatus)).optional(),
  visibility: z.enum(Object.values(PageVisibility)).optional(),

  content: z.string().min(1).optional(),

  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  open_graph_image: z.string().optional(),
  canonical_url: z.string().optional(),

  order: z.number().int().optional(),

  tags: z.array(z.string()).optional(), // Array of tag IDs
});

export type UpdatePageRequest = z.infer<typeof UpdatePageSchema>;

export type GetPageRequest = z.infer<typeof GetPageSchema>;

export type CreatePageRequest = z.infer<typeof CreatePageSchema>;

export type GetPagesRequest = z.infer<typeof GetPagesSchema>;
