/**
 * Component: Column
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import z from "zod";
import ColumnAdmin from "@/components/registry/layout/column/AdminComponent";

export type ColumnProps = {
  justify: "start" | "end" | "center" | "between" | "around" | "evenly";
  align: "start" | "end" | "center" | "stretch" | "baseline";
  wrap: "nowrap" | "wrap" | "wrap-reverse";
  gap: number;
  children?: DBComponent[];
};

export const Column: CMSComponent<"column", ColumnProps> = {
  id: "column" as const,
  label: "Column",

  ClientComponent: ColumnClient,
  AdminComponent: ColumnAdmin,
  PreviewComponent: ColumnPreview,

  Schema: z.object({
    justify: z
      .enum(["start", "end", "center", "between", "around", "evenly"])
      .default("between"),
    align: z
      .enum(["start", "end", "center", "stretch", "baseline"])
      .default("stretch"),
    wrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).default("wrap"),
    gap: z.number().min(0).max(12).default(4),
    children: z.array(z.lazy(() => DBComponentSchema)).optional(),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ColumnClient({ data }: BlockProps<ColumnProps>) {
  return <div>aaaa</div>;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ColumnPreview() {
  return <div>Column Preview</div>;
}