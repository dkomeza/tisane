"use client";

import { AlignItems, ComponentProps, JustifyContent } from "../FlexContainer";

import {
  AdminBlockProps,
  Block,
  CMSStore,
  COMPONENT_REGISTRY,
} from "@/components/registry";

import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  ArrowDownWideNarrow,
  ArrowRight,
  Layout,
  Maximize2,
  Minimize2,
  Move,
  Plus,
  Trash2,
} from "lucide-react";

import { nanoid } from "nanoid";
import { useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";

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

export default function FlexContainerAdminComponent({
  id,
  useStore,
}: AdminBlockProps<ComponentProps>) {
  const { blocks, updateBlock } = useStore();
  const block = blocks.find((b) => b.id === id) as Block<"flex-container">;
  const [isExpanded, setIsExpanded] = useState(true);

  if (!block) return null;

  const data = block.data;

  // We construct a derived state for the children
  const childState: CMSStore = {
    blocks:
      data.children?.map((child) => ({
        ...child,
        id: (child as Block).id || nanoid(), // Ensure ID exists for UI keys
      })) || [],
    setBlocks: (newBlocks) => {
      updateBlock(id, { children: newBlocks });
    },
    updateBlock: (childId, patch) => {
      const currentChildren = data.children || [];
      const newChildren = currentChildren.map((child) => {
        if ((child as Block).id === childId) {
          return {
            ...child,
            data: { ...child.data, ...patch },
          };
        }
        return child;
      });
      updateBlock(id, { children: newChildren });
    },
    addBlock: (newBlock) => {
      const currentChildren = data.children || [];
      updateBlock(id, { children: [...currentChildren, newBlock] });
    },
    removeBlock: (childId) => {
      const currentChildren = data.children || [];
      updateBlock(id, {
        children: currentChildren.filter((c) => (c as Block).id !== childId),
      });
    },
  };

  // Create the adapter function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapterImpl = (selector?: (state: CMSStore) => any) => {
    return selector ? selector(childState) : childState;
  };

  // Attach store methods to mock a real Zustand store
  adapterImpl.getState = () => childState;
  adapterImpl.setState = () => {
    console.warn("setState is not implemented for nested child store adapter");
  };
  adapterImpl.subscribe = () => {
    return () => {}; // Unsubscribe mock
  };
  adapterImpl.destroy = () => {};

  const childStoreAdapter = adapterImpl as unknown as UseBoundStore<
    StoreApi<CMSStore>
  >;

  // Use the adapter to get functions for local use
  const { addBlock: addChild } = childStoreAdapter((s) => s);

  return (
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header / Controls */}
      <div className="p-3 border-b bg-muted/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">Flex Container</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
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
              onClick={() => useStore.getState().removeBlock?.(id)}
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-4">
            {/* Direction */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Move className="w-3 h-3" /> Direction
              </label>
              <div className="flex bg-muted rounded-md p-1 gap-1">
                <button
                type="button"
                  onClick={() => updateBlock(id, { direction: "row" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 text-xs py-1.5 rounded-sm transition-all",
                    data.direction === "row"
                      ? "bg-background shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowRight className="w-3 h-3" /> Row
                </button>
                <button
                type="button"
                  onClick={() => updateBlock(id, { direction: "column" })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 text-xs py-1.5 rounded-sm transition-all",
                    data.direction === "column"
                      ? "bg-background shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowDownWideNarrow className="w-3 h-3" /> Col
                </button>
              </div>
            </div>

            {/* Gap */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
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
                className="w-full accent-primary"
              />
            </div>

            {/* Justify */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlignHorizontalDistributeCenter className="w-3 h-3" /> Justify
              </label>
              <Select
                value={data.justify}
                onValueChange={(val) =>
                  updateBlock(id, { justify: val as JustifyContent })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                  <SelectItem value="between">Space Between</SelectItem>
                  <SelectItem value="around">Space Around</SelectItem>
                  <SelectItem value="evenly">Space Evenly</SelectItem>
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
                onValueChange={(val) =>
                  updateBlock(id, { align: val as AlignItems })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Children Area */}
      {isExpanded && (
        <div className="p-3 bg-muted/10 min-h-[100px] space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Items
          </div>

          <div
            className={cn(
              "flex gap-4 p-2 min-h-[50px] border-2 border-dashed border-border/40 rounded-lg transition-all",
              data.direction === "column"
                ? "flex-col"
                : "flex-row overflow-x-auto"
            )}
          >
            {data.children?.map((child, index) => {
              const childId = (child as Block).id || `temp-${index}`;
              const Component = COMPONENT_REGISTRY[child.type];
              if (!Component) return null;

              const AdminComp = Component.AdminComponent as React.FC<
                AdminBlockProps<typeof child.data>
              >;

              // Ensure child has an ID property for the adapter to find it
              if (!(child as Block).id) {
                (child as Block).id = childId;
              }

              return (
                <div key={childId} className="relative group shrink-0">
                  <AdminComp
                    id={childId}
                    data={child.data}
                    useStore={childStoreAdapter}
                  />
                  {/* Quick remove for children */}
                  <button
                  type="button"
                    onClick={() => {
                      childStoreAdapter.getState().removeBlock?.(childId);
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  className={cn(
                    "flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group",
                    data.direction === "column"
                      ? "w-full h-12"
                      : "w-12 h-auto aspect-square"
                  )}
                >
                  <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="space-y-2">
                  <div className="font-medium text-sm px-2">Add Element</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COMPONENT_REGISTRY).map((comp) => (
                      <button
                      type="button"
                        key={comp.id}
                        onClick={() => {
                          const newBlock = {
                            id: nanoid(),
                            type: comp.id,
                            data: comp.Schema.parse({}),
                          };
                          addChild?.(newBlock as Block);
                        }}
                        className="text-xs flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent border border-transparent hover:border-border transition-all"
                      >
                        {/* We could add an icon to the registry later */}
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
