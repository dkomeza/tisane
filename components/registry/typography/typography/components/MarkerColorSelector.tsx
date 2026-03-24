import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { Editor, useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";

const PREDEFINED_COLORS = [
  "#000000",
  "#737373",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

export default function MarkerColorSelector({ editor }: { editor: Editor }) {
  const { isListItem, markerColor } = useEditorState({
    editor,
    selector: (state) => {
      return {
        isListItem: state.editor.isActive("listItem"),
        markerColor:
          state.editor.getAttributes("listItem").markerColor || "#000000",
      };
    },
  });

  const handleMarkerChange = useCallback(
    (color: string) => {
      const { state } = editor;
      const { from } = state.selection;
      const $pos = state.doc.resolve(from);

      for (let depth = $pos.depth; depth > 0; depth--) {
        const node = $pos.node(depth);
        if (node.type.name === "listItem") {
          const pos = $pos.before(depth);
          editor
            .chain()
            .focus()
            .command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                markerColor: color,
              });
              return true;
            })
            .run();
          break;
        }
      }
    },
    [editor],
  );

  if (!isListItem) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="w-8 h-8 p-0"
          title="Marker Color"
        >
          <Palette className="w-4 h-4 text-muted-foreground" />
          <span className="sr-only">Marker Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 z-50" align="center" sideOffset={5}>
        <div className="space-y-3 mt-0">
          <div className="grid grid-cols-6 gap-2">
            {PREDEFINED_COLORS.map((c) => (
              <button
                key={`marker-${c}`}
                type="button"
                className="w-6 h-6 rounded-sm border border-border/50 shadow-sm transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundColor: c }}
                onClick={() => handleMarkerChange(c)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={markerColor}
              onChange={(e) => handleMarkerChange(e.target.value)}
              className="w-8 h-8 p-0.5 cursor-pointer rounded-md border-border"
            />
            <Input
              type="text"
              value={markerColor}
              onChange={(e) => handleMarkerChange(e.target.value)}
              className="flex-1 h-8 text-xs font-mono lowercase"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
