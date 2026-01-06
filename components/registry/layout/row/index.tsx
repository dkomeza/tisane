/**
 * Component: Row
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CreateComponent,
} from "@/components/registry";
import z from "zod";

export const Schema = z.object({
  text: z.string().default("Row Content"),
  
  layout: z.enum(["flex", "grid"]).default("flex"),
  direction: z.enum(["row", "row-reverse", "col", "col-reverse"]).default("row"),
  justify: z.enum(["start", "center", "end", "between", "around"]).default("start"),
  align: z.enum(["start", "center", "end", "stretch", "baseline"]).default("start"),
  flexWrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).default("wrap"),
  gap: z.enum(["0", "1", "2", "4", "6", "8", "10"]).default("4"),
  
  width: z.enum(["full", "container", "max-w-screen-md"]).default("full"),
  padding: z.enum(["0", "2", "4", "8", "12", "16"]).default("4"),
  
  backgroundColor: z.string().optional(),
});

export type RowProps = z.infer<typeof Schema>;

export const Row = CreateComponent({
  id: "row" as const,
  label: "Row",

  ClientComponent: RowClient,
  AdminComponent: RowAdmin,
  PreviewComponent: RowPreview,

  Schema,
});
//

/**
 * This is the client-side component that will be rendered in the application.
 */
function RowClient({ data }: BlockProps<RowProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function RowAdmin({
  id,
  useStore,
}: AdminBlockProps<RowProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"row">;

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
function RowPreview() {
  return <div>Row Preview</div>;
}