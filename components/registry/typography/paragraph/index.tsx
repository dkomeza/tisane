/**
 * Component: Paragraph
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type ParagraphProps = {
  example: string;
};

export const Paragraph: CMSComponent<"paragraph", ParagraphProps> = {
  id: "paragraph" as const,
  label: "Paragraph",

  ClientComponent: ParagraphClient,
  AdminComponent: ParagraphAdmin,
  PreviewComponent: ParagraphPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ParagraphClient({ data }: BlockProps<ParagraphProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ParagraphAdmin({
  id,
  useStore,
}: AdminBlockProps<ParagraphProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"paragraph">;

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
function ParagraphPreview() {
  return <div>Paragraph Preview</div>;
}