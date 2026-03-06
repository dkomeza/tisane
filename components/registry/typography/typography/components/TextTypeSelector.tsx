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
import { Editor, useEditorState } from "@tiptap/react";
import { useRef } from "react";

export default function TextTypeSelector({ editor }: { editor: Editor }) {
  // Track whether the dropdown was opened by user interaction.
  // This prevents onValueChange from firing when the controlled
  // value changes due to editor selection changes (e.g. CMD+A).
  const userOpenedRef = useRef(false);

  const current = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return "body-md";

      if (editor.isActive("heading")) {
        return `h${editor.getAttributes("heading").level}`;
      }

      if (editor.isActive("paragraph")) {
        return editor.getAttributes("paragraph").variant || "body-md";
      }

      return "body-md";
    },
  });

  return (
    <Tooltip>
      <Select
        value={current}
        onOpenChange={(open) => {
          if (open) userOpenedRef.current = true;
          if (!open) {
            // Reset after a tick so onValueChange can still read it
            setTimeout(() => {
              userOpenedRef.current = false;
            }, 0);
          }
        }}
        onValueChange={(value) => {
          if (!userOpenedRef.current) return;
          setTimeout(() => {
            if (value.startsWith("h")) {
              editor
                .chain()
                .focus()
                .setHeading({
                  level: Number(value.replace("h", "")) as
                    | 1
                    | 2
                    | 3
                    | 4
                    | 5
                    | 6,
                })
                .run();
            } else {
              editor
                .chain()
                .focus()
                .setNode("paragraph", { variant: value })
                .run();
            }
          }, 0);
        }}
      >
        <TooltipTrigger asChild>
          <SelectTrigger className="h-8!">
            <SelectValue />
          </SelectTrigger>
        </TooltipTrigger>

        <TooltipContent side="top">Select Text Type</TooltipContent>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Headings</SelectLabel>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
            <SelectItem value="h4">H4</SelectItem>
            <SelectItem value="h5">H5</SelectItem>
            <SelectItem value="h6">H6</SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>Body</SelectLabel>
            <SelectItem value="body-l">L</SelectItem>
            <SelectItem value="body-m">M</SelectItem>
            <SelectItem value="body-s">S</SelectItem>
            <SelectItem value="body-micro">Micro</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Tooltip>
  );
}
