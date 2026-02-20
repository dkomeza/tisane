/**
 * Component: Grid
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type GridProps = {
  example: string;
};

export const Grid: CMSComponent<"grid", GridProps> = {
  id: "grid" as const,
  label: "Grid",

  ClientComponent: GridClient,
  AdminComponent: GridAdmin,
  PreviewComponent: GridPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function GridClient({ data }: BlockProps<GridProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function GridAdmin({
  id,
  useStore,
}: AdminBlockProps<GridProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"grid">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.example}
      onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function GridPreview() {
  return <div>Grid Preview</div>;
}