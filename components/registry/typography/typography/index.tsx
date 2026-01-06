/**
 * Component: Typography
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

export type TypographyProps = z.infer<typeof Schema>;

export const Typography = CreateComponent({
  id: "typography" as const,
  label: "Typography",

  ClientComponent: TypographyClient,
  AdminComponent: TypographyAdmin,
  PreviewComponent: TypographyPreview,

  Schema,
});

/**
 * This is the client-side component that will be rendered in the application.
 */
function TypographyClient({ data }: BlockProps<TypographyProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function TypographyAdmin({
  id,
  useStore,
}: AdminBlockProps<TypographyProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"typography">;

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
function TypographyPreview() {
  return <div>Typography Preview</div>;
}