"use client";

import { AdminBlockProps, Block } from "@/components/registry/types";
import { TypographyProps } from ".";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronsDownIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";

function HistoryButtons({ editor }: { editor: Editor }) {
  return (
    <ButtonGroup>
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2Icon />
        <span className="sr-only">Undo</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2Icon />
        <span className="sr-only">Redo</span>
      </Button>
    </ButtonGroup>
  );
}

function TextStyleButtons({ editor }: { editor: Editor }) {
  return (
    <ButtonGroup>
      <Button
        size="sm"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
        <span className="sr-only">Bold</span>
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
        <span className="sr-only">Italic</span>
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("underline") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
        <span className="sr-only">Underline</span>
      </Button>
    </ButtonGroup>
  );
}

function TextTypeSelector({ editor }: { editor: Editor }) {
  // 1. Calculate the current value based on selection
  // We check if it's a heading and get the level, otherwise default to paragraph
  const getCurrentValue = () => {
    if (editor.isActive("heading")) {
      return String(editor.getAttributes("heading").level);
    }
    return "paragraph";
  };

  return (
    <Tooltip>
      <Select
        value={getCurrentValue()}
        onValueChange={(value) => {
          if (value === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .setHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
              .run();
          }
        }}
      >
        <TooltipTrigger asChild>
          <SelectTrigger className="[&>svg]:hidden h-8!">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Select Text Type</TooltipContent>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Headings</SelectLabel>
            {/* 3. Changed values to simple numeric strings to match logic */}
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Body</SelectLabel>
            <SelectItem value="paragraph">P</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Tooltip>
  );
}

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
        <button
          key={colorGroup.name}
          className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center group"
          style={{
            backgroundColor: `var(${colorToBrandName(
              colorGroup.name,
              colorGroup.values[colorGroup.primary]
            )})`,
          }}
        >
          <ChevronDownIcon className="mt-0.5 size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
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

  const initialContent = block?.data?.content || "<p>Hello World!</p>";

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      updateBlock(id, { ...block.data, content: editor.getHTML() });
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
        <div className="border border-border bg-muted/50 rounded-lg rounded-b-sm mb-2 p-4 py-3 flex items-center gap-4">
          <HistoryButtons editor={editor} />
          <Separator orientation="vertical" className="h-7!" />
          <TextTypeSelector editor={editor} />
          <Separator orientation="vertical" className="h-7!" />
          <TextStyleButtons editor={editor} />
          <Separator orientation="vertical" className="h-7!" />
          <ColorSelector editor={editor} />
        </div>
      )}
      <EditorContent
        className="border border-border bg-muted/30 p-4 rounded-lg rounded-t-sm flex-1"
        editor={editor}
      />
    </div>
  );
}
