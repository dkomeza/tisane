/**
 * Component: Heading
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import { JSX } from "react";
import z from "zod";

export type HeadingProps = {
  level: number;
  text?: string;
  textAlign?: "left" | "center" | "right" | "justify";
};

export const Heading: CMSComponent<"heading", HeadingProps> = {
  id: "heading" as const,
  label: "Heading",

  ClientComponent: HeadingClient,
  AdminComponent: HeadingAdmin,
  PreviewComponent: HeadingPreview,

  Schema: z.object({
    level: z.number().min(1).max(6).default(1),
    text: z.string().min(1).max(200).optional(),
    textAlign: z
      .enum(["left", "center", "right", "justify"])
      .optional()
      .default("left"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeadingClient({
  data,
  children,
}: BlockProps<HeadingProps> & { children?: React.ReactNode }) {
  const { text, level, textAlign } = data;

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag className="text-4xl" style={{ textAlign: textAlign }}>
      {text ? text : children}
    </Tag>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeadingAdmin({ id, useStore }: AdminBlockProps<HeadingProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"heading">;

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
function HeadingPreview() {
  return <div>Heading Preview</div>;
}
