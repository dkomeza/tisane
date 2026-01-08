/**
 * This is the admin component used to edit the component's data in the CMS.
 */

"use client";

import { RowProps } from "./index";
import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { useCMSStore } from "@/components/registry/CMSStore";

import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Maximize2,
  Minimize2,
  Layout,
  Plus,
  Trash2,
  WrapText,
} from "lucide-react";

import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RowAdminVisual({
  id,
  useStore,
}: AdminBlockProps<RowProps>) {
  const { getBlock, updateBlock, removeBlock, addBlock } = useStore();

  const block = getBlock(id) as Block<"row">;
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
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Row Container</span>
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

      {/* Controls */}
      {isExpanded && (
        <div className="p-3 grid grid-cols-2 gap-4">
          {/* Gap Slider */}
          <div className="space-y-3 col-span-2 bg-muted/30 p-2 rounded-md">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Gap (Spacing)
              </label>
              <span className="text-xs font-mono bg-background px-1.5 rounded border">
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

          {/* Justify */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlignHorizontalDistributeCenter className="w-3 h-3" /> Justify
            </label>
            <Select
              value={data.justify}
              onValueChange={(v) =>
                updateBlock(id, { justify: v as RowProps["justify"] })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["start", "center", "end", "between", "around", "evenly"].map(
                  (v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Align */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlignVerticalDistributeCenter className="w-3 h-3" /> Align
            </label>
            <Select
              value={data.align}
              onValueChange={(v) =>
                updateBlock(id, { align: v as RowProps["align"] })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["start", "center", "end", "stretch", "baseline"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* wrap */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <WrapText className="w-3 h-3" /> Wrap
            </label>
            <Select
              value={data.wrap}
              onValueChange={(v) =>
                updateBlock(id, { wrap: v as RowProps["wrap"] })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["nowrap", "wrap", "wrap-reverse"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Children Area */}
      {isExpanded && (
        <div className="p-3 bg-muted/10 min-h-[100px] space-y-3 border-t">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Row Items
          </div>
          <div
            className={cn(
              "flex gap-4 p-2 min-h-[50px] border-2 border-dashed border-border/40 rounded-lg transition-all",
              "flex-row overflow-x-auto items-start"
            )}
          >
            {block.data.children?.map((child, index) => {
              const Component = COMPONENT_REGISTRY[child.type];
              const childId = (child as Block).id || nanoid();

              if (!Component) {
                return (
                  <div key={index} className="text-red-500 text-xs">
                    Unknown Component
                  </div>
                );
              }

              const AdminComp = Component.AdminComponent as React.FC<
                AdminBlockProps<typeof child.data>
              >;

              return (
                <div
                  key={childId}
                  className="relative group shrink-0 min-w-[200px]"
                >
                  <AdminComp
                    id={childId}
                    data={child.data}
                    useStore={useCMSStore}
                  />
                  <button
                    type="button"
                    onClick={() => removeBlock(childId)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* Add Button */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-12 h-12 shrink-0 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2">
                <div className="space-y-2">
                  <div className="font-medium text-sm px-2">Add Element</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COMPONENT_REGISTRY).map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() =>
                          addBlock(
                            {
                              id: nanoid(),
                              type: comp.id,
                              data: comp.Schema.parse({}),
                            },
                            id,
                            "children"
                          )
                        }
                        className="text-xs flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent border border-transparent hover:border-border transition-all"
                      >
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <Plus className="w-4 h-4 opacity-50" />
                        </div>
                        {comp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
