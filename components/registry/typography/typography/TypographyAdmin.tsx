"use client";

import { AdminBlockProps, Block } from "@/components/registry/types";
import { TypographyProps, Typography } from ".";

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TipTapListItem from "@tiptap/extension-list-item";

import { Separator } from "@/components/ui/separator";

import { Heading as CMSHeading } from "../heading";
import { ParagraphClient } from "../paragraph";
import { ListItemClient } from "../list-item";
import { BulletListClient } from "../bullet-list";
import { OrderedListClient } from "../ordered-list";
import { nanoid } from "nanoid";
import TextTypeSelector from "./components/TextTypeSelector";
import HistoryButtons from "./components/HistoryButtons";
import AlignmentSelector from "./components/AlignmentSelector";
import ListSelector from "./components/ListSelector";
import MarkerColorSelector from "./components/MarkerColorSelector";
import FloatingMenu from "./components/FloatingMenu";

import { useEffect, useRef, useState } from "react";

export const EditableHeading = (props: NodeViewProps) => {
  const { level, textAlign } = props.node.attrs;

  const data = { level, textAlign };

  return (
    <NodeViewWrapper className="heading-node-view">
      <CMSHeading.ClientComponent id={nanoid(8)} data={data}>
        <NodeViewContent />
      </CMSHeading.ClientComponent>
    </NodeViewWrapper>
  );
};

const ParagraphNodeView = (props: NodeViewProps) => {
  const { textAlign = "left", variant = "body-m" } = props.node.attrs;

  return (
    <NodeViewWrapper className="paragraph-wrapper">
      <ParagraphClient id={nanoid(8)} data={{ textAlign, variant }} as="div">
        <NodeViewContent />
      </ParagraphClient>
    </NodeViewWrapper>
  );
};

const BulletListNodeView = () => {
  return (
    <BulletListClient
      id={nanoid(8)}
      data={{}}
      as={NodeViewWrapper}
      tagProps={{ as: "ul", className: "bullet-list-node-view" }}
    >
      <NodeViewContent />
    </BulletListClient>
  );
};

const OrderedListNodeView = () => (
  <OrderedListClient
    id={nanoid(8)}
    data={{}}
    as={NodeViewWrapper}
    tagProps={{ as: "ol", className: "ordered-list-node-view" }}
  >
    <NodeViewContent />
  </OrderedListClient>
);

const ListItemNodeView = (props: NodeViewProps) => {
  console.log("dupsko");
  const markerColor = props.node.attrs.markerColor as string | null;

  return (
    <ListItemClient
      id={nanoid(8)}
      data={{ markerColor }}
      as={NodeViewWrapper}
      tagProps={{ as: "li", className: "list-item-node-view" }}
    >
      <NodeViewContent />
    </ListItemClient>
  );
};

const ListItem = TipTapListItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      markerColor: {
        default: null,
        parseHTML: (element) =>
          element.style.getPropertyValue("--marker-color"),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ListItemNodeView);
  },
});

/**
 * This is the admin component used to edit the component's data in the CMS.
 * It renders the client typography by default, and swaps to a TipTap editor on click.
 */
export function TypographyAdmin({
  id,
  useStore,
}: AdminBlockProps<TypographyProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"typography">;
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialContent =
    block?.data?.content ||
    '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Start writing your text here..."}]}]}';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
        link: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.extend({
        addNodeView() {
          return ReactNodeViewRenderer(BulletListNodeView);
        },
      }),
      OrderedList.extend({
        addNodeView() {
          return ReactNodeViewRenderer(OrderedListNodeView);
        },
      }),
      ListItem,
      Color,
      TextStyle,
      Heading.extend({
        addNodeView() {
          return ReactNodeViewRenderer(EditableHeading);
        },
      }),
      Paragraph.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            textAlign: {
              default: "left",
            },
            variant: {
              default: "body-m",
            },
          };
        },
        addNodeView() {
          return ReactNodeViewRenderer(ParagraphNodeView);
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: JSON.parse(initialContent),
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateBlock(id, {
        ...block.data,
        content: JSON.stringify(editor.getJSON()),
      });
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[50px] h-full outline-none prose max-w-none prose marker:text-(--marker-color)",
      },
    },
  });

  // Click-outside handler to exit editing mode
  useEffect(() => {
    if (!isEditing) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element | null;

      // Ignore clicks on Radix popups (Select, Tooltip, DropdownMenu) and Tippy.js (BubbleMenu)
      if (
        target?.closest("[data-radix-popper-content-wrapper]") ||
        target?.closest("[role='dialog']") ||
        target?.closest("[role='listbox']") ||
        target?.closest("[role='menu']") ||
        target?.closest("[role='tooltip']") ||
        target?.closest("[data-tippy-root]") ||
        target?.closest(".tippy-box")
      ) {
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(target as Node)
      ) {
        setIsEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  // Focus editor when entering edit mode (deferred to avoid flushSync during render)
  useEffect(() => {
    if (isEditing && editor) {
      const timer = setTimeout(() => editor.commands.focus("end"), 0);
      return () => clearTimeout(timer);
    }
  }, [isEditing, editor]);

  if (!block) return null;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col">
      {/* Read-only: render client component with hover hint */}
      {!isEditing && (
        <div
          className="relative group/typography cursor-text"
          onClick={() => setIsEditing(true)}
        >
          <div className="transition-all duration-200 opacity-100 group-hover/typography:opacity-50">
            <Typography.ClientComponent id={id} data={block.data} />
          </div>
        </div>
      )}

      {/* Editing: render TipTap editor (always mounted, hidden when not editing) */}
      <div className={isEditing ? "flex-1 flex flex-col" : "hidden"}>
        {editor && (
          <>
            <div className="border border-border bg-muted/50 rounded-lg rounded-b-sm mb-2 p-4 py-3 flex items-center gap-4">
              <HistoryButtons editor={editor} />
              <Separator orientation="vertical" className="h-7!" />
              <TextTypeSelector editor={editor} />
              <Separator orientation="vertical" className="h-7!" />
              <AlignmentSelector editor={editor} />
              <Separator orientation="vertical" className="h-7!" />
              <ListSelector editor={editor} />
            </div>

            <FloatingMenu editor={editor} />
          </>
        )}
        <EditorContent className="rounded-t-sm flex-1" editor={editor} />
      </div>
    </div>
  );
}
