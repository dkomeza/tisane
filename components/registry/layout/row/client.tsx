import { Block, BlockProps, COMPONENT_REGISTRY } from "@/components/registry";
import { cn } from "@/lib/utils";
import { RowProps } from "./schema";

export function RowClient({ data }: BlockProps<RowProps>) {
  const classes = {
    direction: { row: "flex-row", column: "flex-col" },
    justify: {
      start: "justify-start", end: "justify-end", center: "justify-center",
      between: "justify-between", around: "justify-around", evenly: "justify-evenly",
    },
    align: {
      start: "items-start", end: "items-end", center: "items-center",
      baseline: "items-baseline", stretch: "items-stretch",
    },
    padding: { "0": "p-0", "2": "p-2", "4": "p-4", "8": "p-8", "12": "p-12" },
    width: { full: "w-full", container: "container mx-auto" }
  };

  return (
    <div
      className={cn(
        "flex relative",
        classes.direction[data.direction],
        classes.justify[data.justify],
        classes.align[data.align],
        classes.padding[data.padding],
        classes.width[data.width],
        data.wrap === "wrap" ? "flex-wrap" : "flex-nowrap",
        `gap-${data.gap}`
      )}
    >
      {data.children?.map((child: Block, index: number) => {
        const Component = COMPONENT_REGISTRY[child.type as keyof typeof COMPONENT_REGISTRY];
        if (!Component) return null;
        
        const ClientComp = Component.ClientComponent as React.FC<BlockProps<typeof child.data>>;
        return <ClientComp key={child.id || index} id={child.id} data={child.data} />;
      })}
    </div>
  );
}