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
  variant?: "body-l" | "body-m" | "body-s" | "body-micro";
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
    variant: z
      .enum(["body-l", "body-m", "body-s", "body-micro"])
      .optional()
      .default("body-m"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
export function ParagraphClient({
  data,
  children,
  as = "p",
}: BlockProps<ParagraphProps> & {
  children?: React.ReactNode;
  as?: "p" | "div";
}) {
  const typography = {
    "body-l": "text-body-l",
    "body-m": "text-body-m",
    "body-s": "text-body-s",
    "body-micro": "text-body-micro",

    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };
  const variantClass = typography[data.variant || "body-m"];
  const textAlignClass = typography[data.textAlign || "left"];

  const Tag = as;

  return (
    <Tag className={`${variantClass} ${textAlignClass}`}>
      {data.text ? data.text : children}
    </Tag>
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
