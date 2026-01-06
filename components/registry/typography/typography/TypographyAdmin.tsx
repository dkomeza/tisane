"use client";

import { AdminBlockProps, Block } from "@/components/registry/types";
import { TypographyProps } from ".";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function TypographyAdmin({
  id,
  useStore,
}: AdminBlockProps<TypographyProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"typography">;

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      console.log("Editor content:", editor.getText());
    },
    editorProps: {
      attributes: {
        class: "min-h-[150px] h-full outline-none",
      },
    },
  });

  if (!block) return null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="border border-border bg-muted/60 rounded-lg rounded-b-sm mb-2 p-4 py-3"></div>
      <EditorContent
        className="border border-border bg-muted/30 p-4 rounded-lg rounded-t-sm flex-1"
        editor={editor}
      />
    </div>
  );
}
