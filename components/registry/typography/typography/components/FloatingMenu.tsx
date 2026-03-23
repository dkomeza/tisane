import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { ColorPickerPopover } from "./ColorPickerPopover";

function TextStyleButtons({ editor }: { editor: Editor }) {
  const { isBold, isItalic, isUnderline } = useEditorState({
    editor,
    selector: (state) => ({
      isBold: state.editor.isActive("bold"),
      isItalic: state.editor.isActive("italic"),
      isUnderline: state.editor.isActive("underline"),
    }),
  });

  return (
    <ButtonGroup className="bg-muted/20 backdrop-blur-md z-20">
      <Button
        size="sm"
        type="button"
        variant={isBold ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="w-8 h-8 p-0 text-md font-serif"
      >
        <strong>B</strong>
        <span className="sr-only">Bold</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isItalic ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="w-8 h-8 p-0 text-md font-serif"
      >
        <em>I</em>
        <span className="sr-only">Italic</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isUnderline ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="w-8 h-8 p-0 text-md font-serif"
      >
        <u>U</u>
        <span className="sr-only">Underline</span>
      </Button>
    </ButtonGroup>
  );
}

function FloatingMenu({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu
      editor={editor}
      options={{ offset: 8, placement: "bottom", flip: true }}
      className="flex items-center gap-1.5 p-1 bg-background/50 border border-border shadow-md backdrop-blur-md rounded-md"
    >
      <TextStyleButtons editor={editor} />
      <ColorPickerPopover editor={editor} />
    </BubbleMenu>
  );
}

export default FloatingMenu;
