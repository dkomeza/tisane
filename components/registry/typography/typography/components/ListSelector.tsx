import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Editor, useEditorState } from "@tiptap/react";
import { List, ListOrdered } from "lucide-react";
import MarkerColorSelector from "./MarkerColorSelector";

export default function ListSelector({ editor }: { editor: Editor }) {
  const { isBulletList, isOrderedList } = useEditorState({
    editor,
    selector: (state) => ({
      isBulletList: state.editor.isActive("bulletList"),
      isOrderedList: state.editor.isActive("orderedList"),
    }),
  });

  return (
    <ButtonGroup>
      <Button
        size="sm"
        type="button"
        variant={isBulletList ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
        <span className="sr-only">Bullet List</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isOrderedList ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
        <span className="sr-only">Ordered List</span>
      </Button>
      <MarkerColorSelector editor={editor} />
    </ButtonGroup>
  );
}
