import {
  Block,
  BlockProps,
  BlockSchema,
  CMSComponent,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import { Layout } from "lucide-react";

import z from "zod";
import FlexContainerAdminComponent from "./flex/AdminComponent";

export type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly";
export type AlignItems = "start" | "end" | "center" | "baseline" | "stretch";

export type FlexContainerProps = {
  direction: "row" | "column";
  justify: JustifyContent;
  align: AlignItems;
  gap: number;
  children?: Block[];
};

export const FlexContainer: CMSComponent<"flex-container", FlexContainerProps> =
  {
    id: "flex-container" as const,
    label: "Flex Container",

    ClientComponent: ComponentClientComponent,
    AdminComponent: FlexContainerAdminComponent,
    PreviewComponent: ComponentPreviewComponent,

    Schema: z.object({
      direction: z.enum(["row", "column"]).default("row"),
      justify: z
        .enum(["start", "end", "center", "between", "around", "evenly"])
        .default("start"),
      align: z
        .enum(["start", "end", "center", "baseline", "stretch"])
        .default("stretch"),
      gap: z.number().min(0).max(12).default(4),
      children: z
        .array(z.lazy(() => BlockSchema))
        .optional()
        .default([]),
    }),
  };

/**
 * Client Component
 */
function ComponentClientComponent({ data }: BlockProps<FlexContainerProps>) {
  const directionClasses = {
    row: "flex-row",
    column: "flex-col",
  };

  const justifyClasses: Record<JustifyContent, string> = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const alignClasses: Record<AlignItems, string> = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  };

  // Gap is in rem units (multiples of 0.25rem in Tailwind)
  // We can construct the class dynamically since we know the range is limited (0-12)
  const gapClass = `gap-${data.gap}`;

  return (
    <div
      className={cn(
        "flex w-full",
        directionClasses[data.direction],
        justifyClasses[data.justify],
        alignClasses[data.align],
        gapClass
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

function ComponentPreviewComponent() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2 text-muted-foreground">
      <Layout className="w-8 h-8 opacity-50" />
      <span className="text-xs font-medium">Flex Container</span>
    </div>
  );
}
