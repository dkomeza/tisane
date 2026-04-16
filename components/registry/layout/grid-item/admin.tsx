import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { GridItemProps } from ".";
import { Trash2, Plus, GripHorizontal, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { nanoid } from "nanoid";

export function GridItemAdmin({
  id,
  useStore,
}: AdminBlockProps<GridItemProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"grid-item">;

  if (!block) return null;

  const data = block.data;

  return (
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm mb-4 relative group">
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Grid Item</span>
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Grid Settings</h4>
                <p className="text-xs text-muted-foreground">
                  Configure the dimensions of this item.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-xs font-medium">Col Span</span>
                  <Select
                    value={String(data.colSpan)}
                    onValueChange={(v) =>
                      updateBlock(id, { colSpan: Number(v) })
                    }
                  >
                    <SelectTrigger className="h-8 col-span-2 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (val) => (
                          <SelectItem key={val} value={String(val)}>
                            {val}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-xs font-medium">Row Span</span>
                  <Select
                    value={String(data.rowSpan)}
                    onValueChange={(v) =>
                      updateBlock(id, { rowSpan: Number(v) })
                    }
                  >
                    <SelectTrigger className="h-8 col-span-2 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 4 }, (_, i) => i + 1).map((val) => (
                        <SelectItem key={val} value={String(val)}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-xs font-medium">Aspect</span>
                  <Select
                    value={data.aspectRatio || "auto"}
                    onValueChange={(v) =>
                      updateBlock(id, {
                        aspectRatio: v as GridItemProps["aspectRatio"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8 col-span-2 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="square">1:1</SelectItem>
                      <SelectItem value="video">16:9</SelectItem>
                      <SelectItem value="4/3">4:3</SelectItem>
                      <SelectItem value="3/4">3:4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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

      <div className="p-3">
        {/* Content Section */}
        {data.content ? (
          <div className="relative group/content border border-border/40 rounded-lg bg-background p-2">
            {(() => {
              const Component =
                COMPONENT_REGISTRY[
                  data.content.type as keyof typeof COMPONENT_REGISTRY
                ];
              if (!Component)
                return (
                  <div className="text-red-500 text-xs">Unknown Component</div>
                );

              const AdminComp = Component.AdminComponent as React.FC<
                AdminBlockProps<unknown>
              >;
              return (
                <AdminComp
                  id={(data.content as Block).id}
                  data={data.content.data}
                  useStore={useStore}
                />
              );
            })()}
            <button
              type="button"
              onClick={() => updateBlock(id, { content: undefined })}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/content:opacity-100 transition-opacity z-10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed h-20"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Content Block
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-[320px] p-0 overflow-hidden"
            >
              <div className="flex flex-col h-[400px]">
                <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">Add Content</div>
                    <div className="text-[10px] text-muted-foreground opacity-70">
                      Select a component to add to the grid item
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COMPONENT_REGISTRY)
                      .filter((c) => c.id !== "grid-item" && c.id !== "grid") // Prevent nesting grids inside items trivially, though can be allowed if wanted. For now, we block them to avoid recursive confusion unless requested
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((comp) => (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            updateBlock(id, {
                              content: {
                                id: nanoid(),
                                type: comp.id,
                                data: comp.Schema.parse({}),
                              } as unknown as Block,
                            });
                          }}
                          className="text-xs flex flex-col items-center gap-2 p-3 rounded-md hover:bg-accent border border-border/40 hover:border-primary/30 transition-all bg-card/50 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border/20 shadow-inner">
                            <Plus className="w-4 h-4 opacity-50 font-bold" />
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
        )}
      </div>
    </div>
  );
}
