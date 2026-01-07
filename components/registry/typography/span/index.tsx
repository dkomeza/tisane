/**
 * Component: Span
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

type MarkType = "bold" | "italic" | "underline";

export type SpanProps = {
  text: string;
  marks?: { type: MarkType }[];
};

export const Span: CMSComponent<"span", SpanProps> = {
  id: "span" as const,
  label: "Span",

  ClientComponent: SpanClient,
  AdminComponent: SpanAdmin,
  PreviewComponent: SpanPreview,

  Schema: z.object({
    text: z.string().min(1).max(2000).default("Example span text"),
    marks: z
      .array(
        z.object({
          type: z.enum(["bold", "italic", "underline"]),
        })
      )
      .optional(),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function SpanClient({ data }: BlockProps<SpanProps>) {
  if (data.marks?.length) {
    let content: React.ReactNode = data.text;
    data.marks.forEach((mark) => {
      if (mark.type === "bold") {
        content = <strong>{content}</strong>;
      } else if (mark.type === "italic") {
        content = <em>{content}</em>;
      } else if (mark.type === "underline") {
        content = <u>{content}</u>;
      }
    });
    return <>{content}</>;
  }

  return <>{data.text}</>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function SpanAdmin({ id, useStore }: AdminBlockProps<SpanProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"span">;

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
function SpanPreview() {
  return <div>Span Preview</div>;
}
