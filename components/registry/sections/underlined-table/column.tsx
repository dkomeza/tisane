import { CMSComponent, Block, BlockSchema } from "@/components/registry";
import z from "zod";
import { UnderlinedTableColumnAdmin } from "./column-admin";
import { Heading } from "@/components/registry/typography/heading";

export type UnderlinedTableColumnProps = {
  width: "1/2" | "1/3" | "2/3";
  header?: Block<"heading">;
  content?: Block;
};

export const UnderlinedTableColumn: CMSComponent<
  "underlined-table-column",
  UnderlinedTableColumnProps
> = {
  id: "underlined-table-column",
  label: "Table Column",

  ClientComponent: () => null,
  AdminComponent: UnderlinedTableColumnAdmin,
  PreviewComponent: () => null,

  Schema: z.object({
    width: z.enum(["1/2", "1/3", "2/3"]).default("1/3"),
    header: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "heading", {
        message: "Content must be 'heading'",
      })
      .optional() as z.ZodType<Block<"heading"> | undefined>,
    content: z.lazy(() => BlockSchema).optional(),
  }),
};
