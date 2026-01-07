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
  text?: string;
  textAlign?: "left" | "center" | "right" | "justify";
};

export const Paragraph: CMSComponent<"paragraph", ParagraphProps> = {
  id: "paragraph" as const,
  label: "Paragraph",

  ClientComponent: ParagraphClient,
  AdminComponent: ParagraphAdmin,
  PreviewComponent: ParagraphPreview,

  Schema: z.object({
    text: z.string().optional(),
    textAlign: z
      .enum(["left", "center", "right", "justify"])
      .optional()
      .default("left"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ParagraphClient({
  data,
  children,
}: BlockProps<ParagraphProps> & { children?: React.ReactNode }) {
  return (
    <div className="text-xl" style={{ textAlign: data.textAlign }}>
      {data.text ? data.text : children}
    </div>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ParagraphAdmin({ id, useStore }: AdminBlockProps<ParagraphProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"paragraph">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.text}
      onChange={(e) => updateBlock(id, { text: e.target.value })}
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
