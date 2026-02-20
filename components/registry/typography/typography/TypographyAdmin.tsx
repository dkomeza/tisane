"use client";

import { AdminBlockProps, Block } from "@/components/registry/types";
import { TypographyProps } from ".";

import {
  useEditor,
  EditorContent,
  Editor,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Heading as CMSHeading } from "../heading";
import { Paragraph as CMSParagraph } from "../paragraph";
import { nanoid } from "nanoid";
import TextTypeSelector from "./components/TextTypeSelector";
import HistoryButtons from "./components/HistoryButtons";
import AlignmentSelector from "./components/AlignmentSelector";
import FloatingMenu from "./components/FloatingMenu";

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
      <CMSParagraph.ClientComponent
        id={nanoid(8)}
        data={{ textAlign, variant }}
      >
        <NodeViewContent />
      </CMSParagraph.ClientComponent>
    </NodeViewWrapper>
  );
};



function ColorSelector({ editor }: { editor: Editor }) {
  const colorToBrandName = (color: string, variant: number) => {
    return `--color-brand-${color.toLowerCase()}-${variant}`;
  };

  const colors: {
    name: string;
    values: number[];
    primary: number;
  }[] = [
    {
      name: "Orange",
      values: [100, 200, 300, 400, 500],
      primary: 3,
    },
    {
      name: "Pink",
      values: [100, 200, 300, 400, 500],
      primary: 3,
    },
    {
      name: "Purple",
      values: [100, 200, 300, 400, 500],
      primary: 3,
    },
    {
      name: "Grey",
      values: [100, 200, 300, 400, 500, 600],
      primary: 5,
    },
  ];

  return (
    <div className="flex item-center gap-2">
      {colors.map((colorGroup) => (
        <Popover key={colorGroup.name}>
          <PopoverTrigger asChild>
            <button
              type="button"
              key={colorGroup.name}
              className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group"
              style={{
                backgroundColor: `var(${colorToBrandName(
                  colorGroup.name,
                  colorGroup.values[colorGroup.primary],
                )})`,
              }}
            >
              <ChevronDownIcon className="mt-0.5 size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid grid-cols-3 gap-2 p-2">
              {colorGroup.values.map((variant) => (
                <button
                  type="button"
                  key={variant}
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{
                    backgroundColor: `var(${colorToBrandName(
                      colorGroup.name,
                      variant,
                    )})`,
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <button
        type="button"
        className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group"
      >
        <ChevronDownIcon className="mt-0.5 size-4" />
      </button>
    </div>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function TypographyAdmin({
  id,
  useStore,
}: AdminBlockProps<TypographyProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"typography">;

  const initialContent =
    block?.data?.content ||
    '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Start writing your text here..."}]}]}';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
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
        class: "min-h-[150px] h-full outline-none prose max-w-none prose",
      },
    },
  });

  if (!block) return null;

  return (
    <div className="flex-1 flex flex-col">
      {editor && (
        <>
          <div className="border border-border bg-muted/50 rounded-lg rounded-b-sm mb-2 p-4 py-3 flex items-center gap-4">
            <HistoryButtons editor={editor} />
            <Separator orientation="vertical" className="h-7!" />
            <TextTypeSelector editor={editor} />
            <Separator orientation="vertical" className="h-7!" />
            <AlignmentSelector editor={editor} />
          </div>

          <FloatingMenu editor={editor} />
        </>
      )}
      <EditorContent
        className="border border-border bg-muted/30 p-4 rounded-lg rounded-t-sm flex-1"
        editor={editor}
      />
    </div>
  );
}
