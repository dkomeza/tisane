/**
 * Component: Heading
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JSX } from "react";
import z from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type HeadingProps = {
  level: number;
  text?: string;
  textAlign?: "left" | "center" | "right" | "justify";
};

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const Heading: CMSComponent<"heading", HeadingProps> = {
  id: "heading" as const,
  label: "Heading",

  ClientComponent: HeadingClient,
  AdminComponent: HeadingAdmin,
  PreviewComponent: HeadingPreview,

  Schema: z.object({
    level: z.number().min(1).max(6).default(1),
    text: z.string().min(1).max(200).optional(),
    textAlign: z
      .enum(["left", "center", "right", "justify"])
      .optional()
      .default("left"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeadingClient({
  data,
  children,
}: BlockProps<HeadingProps> & { children?: React.ReactNode }) {
  const { text, textAlign = "left" } = data;

  const typography = {
    1: "text-heading-1",
    2: "text-heading-2",
    3: "text-heading-3",
    4: "text-heading-4",
    5: "text-heading-5",
    6: "text-heading-6",

    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const level = (data.level >= 1 && data.level <= 6 ? data.level : 1) as Level;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={`${typography[level]} ${typography[textAlign]}`}>
      {text ? text : children}
    </Tag>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeadingAdmin({ id, useStore }: AdminBlockProps<HeadingProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"heading">;

  if (!block) return null;

  return (
    <Card className="p-4 grid grid-cols-2">
      <div className="space-y-2 col-span-2">
        <label className="text-sm font-medium">Text</label>
        <Input
          placeholder="Heading text…"
          value={block.data.text || ""}
          onChange={(e) => {
            updateBlock(id, { ...block.data, text: e.target.value });
          }}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Level</label>
        <Select
          value={`${block.data.level}`}
          onValueChange={(value) => {
            const level = parseInt(value, 10);
            updateBlock(id, { ...block.data, level });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select heading level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Alignment</label>
        <ToggleGroup
          type="single"
          className="justify-start"
          value={block.data.textAlign}
          onValueChange={(value) => {
            if (value) {
              updateBlock(id, {
                ...block.data,
                textAlign: value as HeadingProps["textAlign"],
              });
            }
          }}
        >
          <ToggleGroupItem value="left" variant="outline">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="center" variant="outline">
            Center
          </ToggleGroupItem>
          <ToggleGroupItem value="right" variant="outline">
            Right
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" variant="outline">
            Justify
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Card>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function HeadingPreview() {
  return <div>Heading Preview</div>;
}
