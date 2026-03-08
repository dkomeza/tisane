/**
 * Row Admin Component — renders children in actual flex-row layout
 * with settings popover for layout controls.
 */

"use client";

import { RowProps } from "./index";
import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { useCMSStore } from "@/components/registry/CMSStore";
import { InsertionLine } from "@/components/registry/InsertionLine";

import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Plus,
  Settings,
  Trash2,
  WrapText,
} from "lucide-react";

import { nanoid } from "nanoid";
import { useEffect } from "react";

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
import { cn } from "@/lib/utils";

export default function RowAdmin({ id, useStore }: AdminBlockProps<RowProps>) {
  const { getBlock, updateBlock, removeBlock, addBlock, insertBlock } =
    useStore();

  const block = getBlock(id) as Block<"row">;

  useEffect(() => {
    if (!block) return;
    if (block.data.children === undefined) {
      updateBlock(id, { children: [] });
    }
  }, [block, id, updateBlock]);

  if (!block) return null;

  const data = block.data;

  return (
    <div className="relative group/row w-full">
      {/* Settings trigger — top-right corner */}
      <div className="absolute -top-3 right-1 z-10 flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
              title="Row Settings"
            >
              <Settings className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4" side="top" align="end">
            <div className="text-sm font-semibold text-foreground">
              Row Settings
            </div>

            {/* Gap Slider */}
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

            {/* Justify */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlignHorizontalDistributeCenter className="size-3" /> Justify
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
                  {[
                    "start",
                    "center",
                    "end",
                    "between",
                    "around",
                    "evenly",
                  ].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Align */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlignVerticalDistributeCenter className="size-3" /> Align
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
                  {["start", "center", "end", "stretch", "baseline"].map(
                    (v) => (
                      <SelectItem key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Wrap */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <WrapText className="size-3" /> Wrap
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

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeBlock(id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete Row
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hover outline */}
      <div className="rounded-md ring-2 ring-transparent group-hover/row:ring-primary/30 transition-all duration-200 p-1">
        {/* Actual flex-row layout matching the client */}
        <div
          className={cn(
            "flex flex-row w-full",
            `flex-${data.wrap} gap-${data.gap}`,
            `justify-${data.justify} items-${data.align}`,
          )}
        >
          {/* Child admin components */}
          {block.data.children?.map((child, index) => {
            const Component = COMPONENT_REGISTRY[child.type];
            const childId = (child as Block).id || nanoid();

            if (!Component) {
              return (
                <div key={childId} className="text-red-500 text-xs">
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
                className="relative group/child flex items-stretch"
              >
                <InsertionLine
                  orientation="vertical"
                  onInsert={(newBlock) =>
                    insertBlock(newBlock, index, id, "children")
                  }
                />
                <div className="relative">
                  <AdminComp
                    id={childId}
                    data={child.data}
                    useStore={useCMSStore}
                  />
                  <button
                    type="button"
                    onClick={() => removeBlock(childId)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/child:opacity-100 transition-opacity z-10"
                    title="Remove Item"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add child button */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="size-10 shrink-0 border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Plus className="size-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-0 overflow-hidden">
              <div className="flex flex-col h-[400px]">
                <div className="p-3 border-b bg-muted/30">
                  <div className="font-semibold text-sm">Add Element</div>
                  <div className="text-[10px] text-muted-foreground opacity-70">
                    Select a component to add
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COMPONENT_REGISTRY)
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((comp) => (
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
                              "children",
                            )
                          }
                          className="text-xs flex flex-col items-center gap-2 p-3 rounded-md hover:bg-accent border border-border/40 hover:border-primary/30 transition-all bg-card/50 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border/20 shadow-inner">
                            <Plus className="size-4 opacity-50" />
                          </div>
                          <span className="font-medium text-center leading-tight whitespace-normal">
                            {comp.label}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
