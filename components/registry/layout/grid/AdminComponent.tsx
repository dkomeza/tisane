/**
 * Grid Admin Component — renders children in actual CSS grid layout
 * with settings popover for grid controls.
 */

"use client";

import { GridProps } from "./index";
import { AdminBlockProps, Block } from "@/components/registry";
import { useCMSStore } from "@/components/registry/CMSStore";
import { Plus, Settings, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { GridItem } from "@/components/registry/layout/grid-item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GridAdmin({
  id,
  useStore,
}: AdminBlockProps<GridProps>) {
  const { getBlock, updateBlock, removeBlock, addBlock } = useStore();
  const block = getBlock(id) as Block<"grid">;

  useEffect(() => {
    if (!block) return;
    if (block.data.children === undefined) {
      updateBlock(id, { children: [] });
    }
  }, [block, id, updateBlock]);

  if (!block) return null;

  const data = block.data;

  const ratioMultiplier =
    data.rowAspectRatio === "square"
      ? 1
      : data.rowAspectRatio === "video"
        ? 9 / 16
        : data.rowAspectRatio === "4/3"
          ? 3 / 4
          : data.rowAspectRatio === "3/4"
            ? 4 / 3
            : null;

  return (
    <div className="relative group/grid w-full">
      {/* Settings trigger */}
      <div className="absolute -top-3 right-1 z-10 flex items-center gap-1 opacity-0 group-hover/grid:opacity-100 transition-opacity duration-200">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
              title="Grid Settings"
            >
              <Settings className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4" side="top" align="end">
            <div className="text-sm font-semibold text-foreground">
              Grid Settings
            </div>

            {/* Columns */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Columns
                </label>
                <span className="text-xs font-mono bg-muted px-1.5 rounded">
                  {data.columns}
                </span>
              </div>
              <input
                type="range"
                value={data.columns}
                min={1}
                max={12}
                step={1}
                onChange={(e) =>
                  updateBlock(id, { columns: Number(e.target.value) })
                }
                className="w-full accent-primary block h-2"
              />
            </div>

            {/* Gap */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Gap
                </label>
                <span className="text-xs font-mono bg-muted px-1.5 rounded">
                  {data.gap}
                </span>
              </div>
              <input
                type="range"
                value={data.gap}
                min={0}
                max={12}
                step={1}
                onChange={(e) =>
                  updateBlock(id, { gap: Number(e.target.value) })
                }
                className="w-full accent-primary block h-2"
              />
            </div>

            {/* Row Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Cell Aspect Ratio
              </label>
              <Select
                value={data.rowAspectRatio}
                onValueChange={(v) =>
                  updateBlock(id, {
                    rowAspectRatio: v as GridProps["rowAspectRatio"],
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="square">1:1 (Square)</SelectItem>
                  <SelectItem value="video">16:9 (Video)</SelectItem>
                  <SelectItem value="4/3">4:3</SelectItem>
                  <SelectItem value="3/4">3:4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeBlock(id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete Grid
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hover outline */}
      <div className="rounded-md ring-2 ring-transparent group-hover/grid:ring-primary/30 transition-all duration-200 p-1">
        {/* Actual grid layout matching the client */}
        <div
          className={cn("grid w-full @container", `gap-${data.gap}`)}
          style={{
            gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))`,
            // ...(ratioMultiplier && {
            //   gridAutoRows: `calc((100cqw - ${(data.columns - 1) * (data.gap * 0.25)}rem) / ${data.columns} * ${ratioMultiplier})`,
            // }),
          }}
        >
          {block.data.children?.map((child) => {
            const childId = (child as Block).id || nanoid();

            const AdminComp = GridItem.AdminComponent as React.FC<
              AdminBlockProps<unknown>
            >;

            return (
              <div
                key={childId}
                className="relative w-full h-full"
                style={{
                  gridColumn: `span ${child.data.colSpan} / span ${child.data.colSpan}`,
                  gridRow: `span ${child.data.rowSpan} / span ${child.data.rowSpan}`,
                }}
              >
                <AdminComp
                  id={childId}
                  data={child.data}
                  useStore={useCMSStore}
                />
              </div>
            );
          })}
        </div>

        {/* Add grid item button */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() =>
              addBlock(
                {
                  id: nanoid(),
                  type: "grid-item",
                  data: GridItem.Schema.parse({}),
                },
                id,
                "children",
              )
            }
            className="w-full h-10 border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all gap-2 text-muted-foreground text-sm"
          >
            <Plus className="size-4" />
            Add Grid Item
          </button>
        </div>
      </div>
    </div>
  );
}
