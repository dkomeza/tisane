import {
  Block,
  BlockProps,
  CMSComponent,
  BlockSchema,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import z from "zod";
import { GridItemAdmin } from "./admin";
import { cn } from "@/lib/utils";

export type GridItemProps = {
  colSpan: number;
  rowSpan: number;
  aspectRatio: "auto" | "square" | "video" | "4/3" | "3/4";
  content?: Block;
};

export const GridItem: CMSComponent<"grid-item", GridItemProps> = {
  id: "grid-item" as const,
  label: "Grid Item",

  ClientComponent: GridItemClient,
  AdminComponent: GridItemAdmin,
  PreviewComponent: () => null,

  Schema: z.object({
    colSpan: z.number().min(1).max(12).default(1),
    rowSpan: z.number().min(1).max(12).default(1),
    aspectRatio: z
      .enum(["auto", "square", "video", "4/3", "3/4"])
      .default("auto"),
    content: z.lazy(() => BlockSchema).optional(),
  }),
};

/**
 * GridItemClient acts as a pass-through on the client.
 * The actual CSS Grid styles for colSpan and rowSpan need to be applied here
 * so it places perfectly in the Grid component.
 */
function GridItemClient({ data }: BlockProps<GridItemProps>) {
  if (!data.content) return null;

  const contentBlock = data.content as Block;
  const Component =
    COMPONENT_REGISTRY[contentBlock.type as keyof typeof COMPONENT_REGISTRY];

  if (!Component) return null;

  const ContentClient = Component.ClientComponent as React.FC<
    BlockProps<unknown>
  >;

  const aspectRatioClass =
    data.aspectRatio === "auto"
      ? ""
      : data.aspectRatio === "square"
        ? "aspect-square"
        : data.aspectRatio === "video"
          ? "aspect-video"
          : data.aspectRatio === "4/3"
            ? "aspect-[4/3]"
            : data.aspectRatio === "3/4"
              ? "aspect-[3/4]"
              : "";

  return (
    <div
      className={cn(
        "w-full h-full relative overflow-hidden",
        aspectRatioClass,
        data.aspectRatio !== "auto" &&
          "[&_img]:absolute [&_img]:inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover",
      )}
      style={{
        gridColumn: `span ${data.colSpan} / span ${data.colSpan}`,
        gridRow: `span ${data.rowSpan} / span ${data.rowSpan}`,
      }}
    >
      <ContentClient id={contentBlock.id} data={contentBlock.data} />
    </div>
  );
}
