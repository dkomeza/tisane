/**
 * Component: Grid
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import z from "zod";
import GridAdmin from "./AdminComponent";

export type GridProps = {
  gap: number;
  children?: DBComponent[];
};

export const Grid: CMSComponent<"grid", GridProps> = {
  id: "grid" as const,
  label: "Grid",

  ClientComponent: GridClient,
  AdminComponent: GridAdmin,
  PreviewComponent: GridPreview,

  Schema: z.object({
    gap: z.number().min(0).max(12).default(4),
    children: z.array(z.lazy(() => DBComponentSchema)).optional(),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function GridClient({ data }: BlockProps<GridProps>) {
  return (
    <div
      className={cn(
        "flex flex-wrap w-full h-full",
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
          <div
            key={index}
            className="flex-grow flex-shrink basis-auto min-w-[300px]"
          >
            <ClientComp id={`child-${index}`} data={child.data} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function GridPreview() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-muted-foreground gap-2">
      <div className="grid grid-cols-3 gap-1 w-8 h-8 opacity-50">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-current rounded-[1px]" />
        ))}
      </div>
      <span className="text-xs font-medium">Grid (12 cols)</span>
    </div>
  );
}