/**
 * Component: Row
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CreateComponent,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import z from "zod";

export const Schema = z.object({
  text: z.string().default("Row Content"),

  layout: z.enum(["flex", "grid"]).default("flex"),
  direction: z
    .enum(["row", "row-reverse", "col", "col-reverse"])
    .default("row"),
  justify: z
    .enum(["start", "center", "end", "between", "around"])
    .default("start"),
  align: z
    .enum(["start", "center", "end", "stretch", "baseline"])
    .default("start"),
  flexWrap: z.enum(["nowrap", "wrap", "wrap-reverse"]).default("wrap"),
  gap: z.enum(["0", "1", "2", "4", "6", "8", "10"]).default("4"),

  width: z.enum(["full", "container", "max-w-screen-md"]).default("full"),
  padding: z.enum(["0", "2", "4", "8", "12", "16"]).default("4"),

  backgroundColor: z.string().optional(),
});

export type RowProps = z.infer<typeof Schema>;

export const Row = CreateComponent({
  id: "row" as const,
  label: "Row",

  ClientComponent: RowClient,
  AdminComponent: RowAdmin,
  PreviewComponent: RowPreview,

  Schema,
});

/**
 * This is the client-side component that will be rendered in the application.
 */
const getLayoutClasses = (data: RowProps) => {
  const map = {
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    gap: {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "10": "gap-10",
    },
    padding: {
      "0": "p-0",
      "2": "p-2",
      "4": "p-4",
      "8": "p-8",
      "12": "p-12",
      "16": "p-16",
    },
    width: {
      full: "w-full",
      container: "container mx-auto",
      "max-w-screen-md": "max-w-screen-md mx-auto",
    },
  };

  return cn(
    data.layout === "flex" ? "flex" : "grid",
    data.layout === "flex" &&
      (data.direction === "col" ? "flex-col" : "flex-row"),
    data.layout === "flex" &&
      (data.flexWrap === "wrap" ? "flex-wrap" : "flex-nowrap"),
    map.justify[data.justify],
    map.align[data.align],
    map.gap[data.gap],
    map.padding[data.padding],
    map.width[data.width],
    data.backgroundColor && `bg-[${data.backgroundColor}]`
  );
};

function RowClient({
  data,
  children,
}: BlockProps<RowProps> & { children?: React.ReactNode }) {
  return (
    <div
      className={getLayoutClasses(data)}
      style={{ backgroundColor: data.backgroundColor }}
    >
      {children ? (
        children
      ) : (
        <div className="w-full min-h-[50px] border border-dashed border-gray-300 rounded p-4 text-muted-foreground">
          {data.text}
        </div>
      )}
    </div>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function RowAdmin({ id, useStore }: AdminBlockProps<RowProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"row">;

  if (!block) return null;

  const { data } = block;

  const handleChange = (key: keyof RowProps, value: string) => {
    updateBlock(id, { ...data, [key]: value });
  };

  const SelectControl = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof RowProps;
    options: string[];
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </label>
      <select
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        value={String(data[field])}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-md border">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Row Label / Content
        </label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={data.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Label for empty row..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectControl
          label="Width"
          field="width"
          options={["full", "container", "max-w-screen-md"]}
        />
        <SelectControl
          label="Gap"
          field="gap"
          options={["0", "2", "4", "8", "10"]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectControl
          label="Align Items"
          field="align"
          options={["start", "center", "end", "stretch"]}
        />
        <SelectControl
          label="Justify"
          field="justify"
          options={["start", "center", "end", "between"]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectControl
          label="Padding"
          field="padding"
          options={["0", "2", "4", "8", "12"]}
        />
        <SelectControl
          label="Wrap"
          field="flexWrap"
          options={["wrap", "nowrap"]}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Background Color (Hex/Name)
        </label>
        <input
          type="text"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          placeholder="#ffffff or red"
          value={data.backgroundColor || ""}
          onChange={(e) => handleChange("backgroundColor", e.target.value)}
        />
      </div>
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function RowPreview() {
  return <div>Row Preview</div>;
}
