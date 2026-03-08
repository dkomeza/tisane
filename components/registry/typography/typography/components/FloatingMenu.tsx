import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

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
    <ButtonGroup className="bg-muted/20 backdrop-blur-md">
      <Button
        size="sm"
        type="button"
        variant={isBold ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
        <span className="sr-only">Bold</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isItalic ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
        <span className="sr-only">Italic</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isUnderline ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
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
    >
      <TextStyleButtons editor={editor} />
    </BubbleMenu>
  );
}

export default FloatingMenu;
