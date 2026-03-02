import { Redo2Icon, Undo2Icon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Editor, useEditorState } from "@tiptap/react";

export default function HistoryButtons({ editor }: { editor: Editor }) {
  const canUndo = useEditorState({
    editor,
    selector: (state) => state.editor.can().undo(),
  });
  const canRedo = useEditorState({
    editor,
    selector: (state) => state.editor.can().redo(),
  });

  return (
    <ButtonGroup>
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
      >
        <Undo2Icon />
        <span className="sr-only">Undo</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
      >
        <Redo2Icon />
        <span className="sr-only">Redo</span>
      </Button>
    </ButtonGroup>
  );
}
