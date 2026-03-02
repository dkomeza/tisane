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
  columns: number;
  gap: number;
  children?: DBComponent<"grid-item">[];
};

export const Grid: CMSComponent<"grid", GridProps> = {
  id: "grid" as const,
  label: "Grid",

  ClientComponent: GridClient,
  AdminComponent: GridAdmin,
  PreviewComponent: GridPreview,

  Schema: z.object({
    columns: z.number().min(1).max(12).default(4),
    gap: z.number().min(0).max(12).default(4),
    children: z.array(z.lazy(() => DBComponentSchema)).optional() as z.ZodType<
      DBComponent<"grid-item">[] | undefined
    >,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function GridClient({ data }: BlockProps<GridProps>) {
  return (
    <div
      className={cn("grid w-full h-full", `gap-${data.gap}`)}
      style={{
        gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))`,
      }}
    >
      {data.children?.map((child, index) => {
        const ChildComponent =
          COMPONENT_REGISTRY[child.type as keyof typeof COMPONENT_REGISTRY];

        if (!ChildComponent) return null;

        const ClientComp = ChildComponent.ClientComponent as React.FC<
          BlockProps<typeof child.data>
        >;

        return (
          <ClientComp
            key={(child as unknown as Block).id || index}
            id={(child as unknown as Block).id || `child-${index}`}
            data={child.data}
          />
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
