/**
 * Component: Typography
 */

import { BlockProps, CMSComponent } from "@/components/registry";
import z from "zod";
import { TypographyAdmin } from "./TypographyAdmin";
import { useMemo } from "react";
import { Heading } from "../heading";
import { Span } from "../span";
import { Paragraph } from "../paragraph";
import { BulletList } from "../bullet-list";
import { OrderedList } from "../ordered-list";
import { ListItem } from "../list-item";

export type TypographyProps = {
  content: string;
};

export const Typography = {
  id: "typography" as const,
  label: "Typography",

  ClientComponent: TypographyClient,
  AdminComponent: TypographyAdmin,
  PreviewComponent: TypographyPreview,

  Schema: z.object({
    content: z
      .string()
      .default(
        '{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":null,"level":1},"content":[{"type":"text","text":"Example contentasdf"}]},{"type":"paragraph","attrs":{"textAlign":null}}]}',
      ),
  }),
} as CMSComponent<"typography", TypographyProps>;

function RenderSpan(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  ) {
    return null;
  }

  if (props.block.type !== "text") {
    return null;
  }

  const block = props.block as {
    type: string;
    text?: string;
    marks?: { type: string; attrs?: Record<string, string> }[];
  };

  const data = {
    text: block.text || "",
    marks: block.marks || [],
  };

  const parse = Span.Schema.safeParse(data);

  if (!parse.success) {
    return null;
  }

  return <Span.ClientComponent id="span" data={parse.data} />;
}

function RenderHeading(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  ) {
    return null;
  }

  if (props.block.type !== "heading") {
    return null;
  }

  const block = props.block as {
    type: string;
    attrs?: { level?: number; textAlign?: string };
    content?: { type: string; text?: string }[];
  };

  const level = block.attrs?.level || 1;
  const textAlign = block.attrs?.textAlign || "left";

  const data = {
    level,
    textAlign,
  };

  const parse = Heading.Schema.safeParse(data);

  if (!parse.success) {
    return null;
  }

  return (
    <Heading.ClientComponent id="heading" data={parse.data}>
      {Array.isArray(block.content)
        ? block.content.map((child, index: number) => (
            <RenderSpan key={index} block={child} />
          ))
        : null}
    </Heading.ClientComponent>
  );
}

function RenderParagraph(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  ) {
    return null;
  }

  if (props.block.type !== "paragraph") {
    return null;
  }

  const block = props.block as {
    type: string;
    attrs?: { textAlign?: string; variant?: string };
    content?: { type: string; text?: string }[];
  };

  const textAlign = block.attrs?.textAlign || "left";
  const variant = block.attrs?.variant || "body-m";
  const parse = Paragraph.Schema.safeParse({ textAlign, variant });

  if (!parse.success) {
    return null;
  }

  return (
    <Paragraph.ClientComponent id="paragraph" data={parse.data}>
      {Array.isArray(block.content)
        ? block.content.map((child, index: number) => (
            <RenderSpan key={index} block={child} />
          ))
        : null}
    </Paragraph.ClientComponent>
  );
}

function RenderListItem(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  )
    return null;
  if ((props.block as { type: string }).type !== "listItem") return null;

  const block = props.block as {
    type: string;
    attrs?: { markerColor?: string };
    content?: { type: string; text?: string }[];
  };

  const markerColor = block.attrs?.markerColor || null;
  const parse = ListItem.Schema.safeParse({ markerColor });

  if (!parse.success) return null;

  return (
    <ListItem.ClientComponent id="list-item" data={parse.data}>
      {Array.isArray(block.content)
        ? block.content.map((child, index: number) => (
            <RenderBlock key={index} block={child} />
          ))
        : null}
    </ListItem.ClientComponent>
  );
}

function RenderBulletList(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  )
    return null;
  if ((props.block as { type: string }).type !== "bulletList") return null;

  const block = props.block as {
    type: string;
    content?: { type: string; text?: string }[];
  };

  const parse = BulletList.Schema.safeParse({});
  if (!parse.success) return null;

  return (
    <BulletList.ClientComponent id="bullet-list" data={parse.data}>
      {Array.isArray(block.content)
        ? block.content.map((child, index: number) => (
            <RenderListItem key={index} block={child} />
          ))
        : null}
    </BulletList.ClientComponent>
  );
}

function RenderOrderedList(props: { block: unknown }) {
  if (
    !props.block ||
    typeof props.block !== "object" ||
    !("type" in props.block)
  )
    return null;
  if ((props.block as { type: string }).type !== "orderedList") return null;

  const block = props.block as {
    type: string;
    content?: { type: string; text?: string }[];
  };

  const parse = OrderedList.Schema.safeParse({});
  if (!parse.success) return null;

  return (
    <OrderedList.ClientComponent id="ordered-list" data={parse.data}>
      {Array.isArray(block.content)
        ? block.content.map((child, index: number) => (
            <RenderListItem key={index} block={child} />
          ))
        : null}
    </OrderedList.ClientComponent>
  );
}

function RenderBlock(props: { block: unknown }) {
  const block = props.block as { type: string; content?: unknown };

  if (!block || typeof block !== "object" || !("type" in block)) {
    return null;
  }

  switch (block.type) {
    case "doc":
      return (
        <>
          {Array.isArray(block.content) ? (
            block.content.map((child, index: number) => (
              <RenderBlock key={index} block={child} />
            ))
          ) : (
            <RenderBlock block={block.content} />
          )}
        </>
      );
    case "paragraph":
      return <RenderParagraph block={block} />;
    case "heading":
      return <RenderHeading block={block} />;
    case "bulletList":
      return <RenderBulletList block={block} />;
    case "orderedList":
      return <RenderOrderedList block={block} />;
    case "listItem":
      return <RenderListItem block={block} />;
    default:
      return <div>Unknown block type: {block.type}</div>;
  }
}

/**
 * This is the client-side component that will be rendered in the application.
 */
function TypographyClient({ data }: BlockProps<TypographyProps>) {
  const content = useMemo(() => {
    try {
      return JSON.parse(data.content);
    } catch {
      return null;
    }
  }, [data.content]);

  if (!content) {
    return <div>No content</div>;
  }

  return (
    <>
      <RenderBlock block={content} />
    </>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function TypographyPreview() {
  return <div>Typography Preview</div>;
}
