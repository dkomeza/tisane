import z from "zod";
import { Result } from "../types/Result";
import { DBComponent, DBComponentsArraySchema } from "@/components/registry";
import { Menu as RawMenu } from "../prisma";

export const GetMenusSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),

  search: z.string().min(1).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const CreateMenuSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: DBComponentsArraySchema.optional(),
});

export const UpdateMenuSchema = z.object({
  menuId: z.string().min(1),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: DBComponentsArraySchema.optional(),
});

export const GetMenuSchema = z.object({
  menuId: z.string().min(1),
});

export type Menu = Omit<RawMenu, "content"> & { content: DBComponent[] };

export type CreateMenuRequest = z.infer<typeof CreateMenuSchema>;
export type CreateMenuResponse = Result<{ menu: Menu }, string>;

export type UpdateMenuRequest = z.infer<typeof UpdateMenuSchema>;
export type UpdateMenuResponse = Result<{ menu: Menu }, string>;

export type GetMenuRequest = z.infer<typeof GetMenuSchema>;
export type GetMenuResponse = Result<{ menu: Menu }, string>;

export type GetMenusRequest = z.infer<typeof GetMenusSchema>;
export type GetMenusResponse = Result<{ menus: Menu[]; total: number }, string>;
