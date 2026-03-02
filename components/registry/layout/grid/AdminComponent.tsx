"use client";

import { GridProps } from "./index";
import { AdminBlockProps, Block } from "@/components/registry";
import { useCMSStore } from "@/components/registry/CMSStore";
import { LayoutGrid, Maximize2, Minimize2, Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GridItem } from "@/components/registry/layout/grid-item";

export default function GridAdmin({
  id,
  useStore,
}: AdminBlockProps<GridProps>) {
  const { getBlock, updateBlock, removeBlock, addBlock } = useStore();
  const block = getBlock(id) as Block<"grid">;
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!block) return;
    if (block.data.children === undefined) {
      updateBlock(id, { children: [] });
    }
  }, [block, id, updateBlock]);

  if (!block) return null;

  const data = block.data;

  return (
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm mb-4">
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Auto Grid Layout</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeBlock(id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-4">
          <div className="space-y-3 bg-muted/30 p-2 rounded-md">
            <div className="flex justify-between items-center bg-background px-2 py-1 rounded border border-border/40">
              <label className="text-xs font-medium text-muted-foreground">
                Columns
              </label>
              <span className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border border-border/40 shadow-sm">
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
              className="w-full accent-primary block h-2 pb-2"
            />
            <div className="flex justify-between items-center bg-background px-2 py-1 pt-2 border-t border-border/40">
              <label className="text-xs font-medium text-muted-foreground">
                Gap
              </label>
              <span className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border border-border/40 shadow-sm">
                {data.gap}
              </span>
            </div>
            <input
              type="range"
              value={data.gap}
              min={0}
              max={12}
              step={1}
              onChange={(e) => updateBlock(id, { gap: Number(e.target.value) })}
              className="w-full accent-primary block h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Grid Items
            </div>
            <div
              className={cn(
                "grid gap-4 p-2 min-h-[50px] border-2 border-dashed border-border/40 rounded-lg",
              )}
              style={{
                gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))`,
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
                    className="relative group w-full h-full"
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

            {/* Add Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full h-12 border-dashed gap-2"
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
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
                Add Grid Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
