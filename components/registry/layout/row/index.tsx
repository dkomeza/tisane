/**
 * Component: Row
 */

import {
  BlockProps,
  CreateComponent,
  DBComponentSchema,
  COMPONENT_REGISTRY,
  DBComponent,
  CMSComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import z from "zod";
import { Layout } from "lucide-react";
import RowContainerAdminComponent from "@/components/registry/layout/row/AdminComponent";

export type RowProps = {
  justify: "start" | "end" | "center" | "between" | "around" | "evenly";
  align: "start" | "end" | "center" | "baseline" | "stretch";
  flexWrap: "nowrap" | "wrap" | "wrap-reverse";
  gap: number;
  children?: DBComponent[];
};

export const Row: CMSComponent<"row", RowProps> = {
  id: "row" as const,
  label: "Row",

  ClientComponent: RowClient,
  AdminComponent: RowContainerAdminComponent,
  PreviewComponent: RowPreview,

  Schema: z.object({
    justify: z
      .enum(["start", "end", "center", "between", "around", "evenly"])
      .default("start"),
    align: z
      .enum(["start", "end", "center", "baseline", "stretch"])
      .default("stretch"),
    flexWrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).default("wrap"),
    gap: z.number().min(0).max(12).default(4),
    children: z.array(z.lazy(() => DBComponentSchema)).optional(),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function RowClient({ data }: BlockProps<RowProps>) {
  return (
    <div
      className={cn(
        "flex flex-row",
        data.flexWrap === "wrap" ? "flex-wrap" : "flex-nowrap",
        `justify-${data.justify}`,
        `items-${data.align}`,
        `gap-${data.gap}`
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
function RowPreview() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-muted-foreground gap-2">
      <Layout className="w-8 h-8 opacity-50 rotate-90" />
      <span className="text-xs font-medium">Row</span>
    </div>
  );
}
