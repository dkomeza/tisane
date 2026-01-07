/**
 * Component: Column
 */

import {
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import z from "zod";
import ColumnAdmin from "@/components/registry/layout/column/AdminComponent";
import { cn } from "@/lib/utils";
import { Layout } from "lucide-react";

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
  return (
    <div
      className={cn(
        "flex flex-col",
        `flex-${data.wrap} gap-${data.gap}`,
        `justify-${data.justify} items-${data.align}`
      )}
    >
      {data.children?.map((child, index) => {
        const ChildComponent =
          COMPONENT_REGISTRY[child.type as keyof typeof COMPONENT_REGISTRY];

        if (!ChildComponent) return null;

        const ClientComp = ChildComponent.ClientComponent as React.FC<
          BlockProps<typeof child.data>
        >;

        return (
          <ClientComp key={index} id={`child-${index}`} data={child.data} />
        );
      })}
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ColumnPreview() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-muted-foreground gap-2">
      <Layout className="w-8 h-8 opacity-50" />
      <span className="text-xs font-medium">Column</span>
    </div>
  );
}
