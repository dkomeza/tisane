/**
 * Component: Row
 */

import {
  BlockProps,
  CreateComponent,
  DBComponentSchema,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import z from "zod";
import { Layout } from "lucide-react";
import RowContainerAdminComponent from "@/components/registry/layout/row/AdminComponent";

export const Schema = z.object({
  label: z.string().default("Row Container"),
  layout: z.enum(["flex", "grid"]).default("flex"),
  direction: z.literal("row").default("row"),
  justify: z
    .enum(["start", "end", "center", "between", "around", "evenly"])
    .default("start"),
  align: z
    .enum(["start", "end", "center", "baseline", "stretch"])
    .default("stretch"),
  flexWrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).default("wrap"),
  gap: z.number().min(0).max(12).default(4),
  padding: z.enum(["0", "2", "4", "8", "12", "16"]).default("4"),
  width: z.enum(["full", "container", "max-w-screen-md"]).default("full"),
  backgroundColor: z.string().optional(),
  text: z.string().optional(),
  children: z
    .array(z.lazy(() => DBComponentSchema))
    .optional()
    .default([]),
});

export type RowProps = z.infer<typeof Schema>;

export const Row = CreateComponent({
  id: "row" as const,
  label: "Row",

  ClientComponent: RowClient,
  AdminComponent: RowContainerAdminComponent,
  PreviewComponent: RowPreview,

  Schema,
});

/**
 * This is the client-side component that will be rendered in the application.
 */
function RowClient({ data }: BlockProps<RowProps>) {
  const map = {
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    padding: {
      "0": "p-0",
      "2": "p-2",
      "4": "p-4",
      "8": "p-8",
      "12": "p-12",
      "16": "p-16",
    },
    width: {
      full: "w-full",
      container: "container mx-auto",
      "max-w-screen-md": "max-w-screen-md mx-auto",
    },
  };

  return (
    <div
      className={cn(
        data.layout === "flex" ? "flex" : "grid",
        "col",
        data.flexWrap === "wrap" ? "flex-wrap" : "flex-nowrap",
        map.justify[data.justify],
        map.align[data.align],
        `gap-${data.gap}`,
        map.padding[data.padding],
        map.width[data.width]
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
