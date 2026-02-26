import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Editor, useEditorState } from "@tiptap/react";

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";

export default function AlignmentSelector({ editor }: { editor: Editor }) {
  const isCenter = useEditorState({
    editor,
    selector: (state) => state.editor.isActive({ textAlign: "center" }),
  });

  const isRight = useEditorState({
    editor,
    selector: (state) => state.editor.isActive({ textAlign: "right" }),
  });

  const isJustify = useEditorState({
    editor,
    selector: (state) => state.editor.isActive({ textAlign: "justify" }),
  });

  const isLeft =
    useEditorState({
      editor,
      selector: (state) => state.editor.isActive({ textAlign: "left" }),
    }) ||
    (!isCenter && !isRight && !isJustify);

  return (
    <ButtonGroup>
      <Button
        size="sm"
        type="button"
        variant={isLeft ? "default" : "outline"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeftIcon />
        <span className="sr-only">Align Left</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isCenter ? "default" : "outline"}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenterIcon />
        <span className="sr-only">Align Center</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isRight ? "default" : "outline"}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRightIcon />
        <span className="sr-only">Align Right</span>
      </Button>
      <Button
        size="sm"
        type="button"
        variant={isJustify ? "default" : "outline"}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustifyIcon />
        <span className="sr-only">Justify</span>
      </Button>
    </ButtonGroup>
  );
}
