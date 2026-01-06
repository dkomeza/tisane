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
  example: z.string().min(1).max(100).default("Example content"),
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