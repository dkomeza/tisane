"use client";

import { COMPONENT_REGISTRY, REGISTRY_CATEGORIES } from "@/components/registry";
import { Block } from "@/components/registry/types";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type InsertionLineProps = {
  /** Called with the newly created block when the user picks a component */
  onInsert: (block: Block) => void;
  /** Which registry categories to show. If true, only root-level categories. */
  rootOnly?: boolean;
  /** "horizontal" renders a full-width line (for vertical lists like Column / root).
   *  "vertical" renders a tall line (for horizontal lists like Row). */
  orientation?: "horizontal" | "vertical";
};

export function InsertionLine({
  onInsert,
  rootOnly = false,
  orientation = "horizontal",
}: InsertionLineProps) {
  const isHorizontal = orientation === "horizontal";

  const categories = rootOnly
    ? REGISTRY_CATEGORIES.filter((c) => {
        const components = c.componentIds.map(
          (componentId) => COMPONENT_REGISTRY[componentId],
        );
        return components.some((component) => component.isRootLevel);
      })
    : REGISTRY_CATEGORIES;

  return (
    <div
      className={cn(
        "group/insert relative flex items-center justify-center shrink-0",
        isHorizontal ? "w-full h-3 -my-1" : "h-full w-3 -mx-1",
      )}
    >
      {/* The line */}
      <div
        className={cn(
          "bg-primary/40 rounded-full opacity-0 group-hover/insert:opacity-100 transition-opacity duration-200",
          isHorizontal
            ? "absolute inset-x-0 h-[2px] top-1/2 -translate-y-1/2"
            : "absolute inset-y-0 w-[2px] left-1/2 -translate-x-1/2",
        )}
      />

      {/* The + button */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative z-10 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover/insert:opacity-100 transition-all duration-200 hover:scale-110 shadow-sm cursor-pointer"
          >
            <Plus className="size-3" strokeWidth={2.5} />
          </button>
        </PopoverTrigger>
        <PopoverContent asChild side={isHorizontal ? "bottom" : "right"}>
          {rootOnly ? (
            <Card className="w-md">
              <ScrollArea className="h-96">
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h3 className="mb-2">{category.label}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {category.componentIds.map((componentId) => {
                        const comp = COMPONENT_REGISTRY[componentId];
                        if (!comp.isRootLevel) return null;
                        const Preview = comp.PreviewComponent;
                        return (
                          <button
                            key={componentId}
                            className="border border-border/50 rounded-md p-2"
                            onClick={() => {
                              onInsert({
                                id: nanoid(8),
                                type: componentId,
                                data: comp.Schema.parse({}),
                              });
                            }}
                          >
                            <Preview />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          ) : (
            <Card className="w-80 p-0 overflow-hidden">
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
                            onInsert({
                              id: nanoid(),
                              type: comp.id,
                              data: comp.Schema.parse({}),
                            })
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
            </Card>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
