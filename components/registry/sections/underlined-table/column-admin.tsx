import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
  createBlock,
  DBComponent,
} from "@/components/registry";
import { UnderlinedTableColumnProps } from "./column";
import { Heading } from "@/components/registry/typography/heading";
import { Trash2, Plus, Columns } from "lucide-react";
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

export function UnderlinedTableColumnAdmin({
  id,
  useStore,
}: AdminBlockProps<UnderlinedTableColumnProps>) {
  const { getBlock, updateBlock, removeBlock, addBlock } = useStore();
  const block = getBlock(id) as Block<"underlined-table-column">;

  if (!block) return null;

  const data = block.data;

  return (
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm mb-4 relative group">
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Table Column</span>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={data.width}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(v) => updateBlock(id, { width: v as any })}
          >
            <SelectTrigger className="h-7 text-xs w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1/3">1/3</SelectItem>
              <SelectItem value="1/2">1/2</SelectItem>
              <SelectItem value="2/3">2/3</SelectItem>
            </SelectContent>
          </Select>
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

      <div className="p-3 space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Header
          </div>
          {data.header ? (
            <div className="relative group/header border border-border/40 rounded-lg bg-background p-2">
              <Heading.AdminComponent
                id={(data.header as Block).id}
                data={data.header.data}
                useStore={useStore}
              />
              <button
                type="button"
                onClick={() => updateBlock(id, { header: undefined })}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/header:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => {
                const block = createBlock("heading");
                addBlock(block, id, "header");
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Header
            </Button>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Content
          </div>
          {data.content ? (
            <div className="relative group/content border border-border/40 rounded-lg bg-background p-2">
              {(() => {
                const Component =
                  COMPONENT_REGISTRY[
                    data.content.type as keyof typeof COMPONENT_REGISTRY
                  ];
                if (!Component)
                  return (
                    <div className="text-red-500 text-xs">
                      Unknown Component
                    </div>
                  );

                const AdminComp = Component.AdminComponent as any;
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
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Content Block
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-80 p-0 overflow-hidden"
              >
                <div className="flex flex-col h-[400px]">
                  <div className="p-3 border-b bg-muted/30">
                    <div className="font-semibold text-sm">Add Content</div>
                    <div className="text-[10px] text-muted-foreground opacity-70">
                      Select a component
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(COMPONENT_REGISTRY)
                        .filter((c) => c.id !== "underlined-table-column")
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((comp) => (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() =>
                              updateBlock(id, {
                                content: {
                                  id: nanoid(),
                                  type: comp.id,
                                  data: comp.Schema.parse({}),
                                } as unknown as DBComponent,
                              })
                            }
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
    </div>
  );
}
