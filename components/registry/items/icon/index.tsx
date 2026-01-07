/**
 * Component: Icon
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type IconProps = {
  example: string;
};

export const Icon: CMSComponent<"icon", IconProps> = {
  id: "icon" as const,
  label: "Icon",

  ClientComponent: IconClient,
  AdminComponent: IconAdmin,
  PreviewComponent: IconPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function IconClient({ data }: BlockProps<IconProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function IconAdmin({
  id,
  useStore,
}: AdminBlockProps<IconProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"icon">;

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
function IconPreview() {
  return <div>Icon Preview</div>;
}