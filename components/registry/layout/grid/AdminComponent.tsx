"use client";

import { GridProps } from "./index";
import {
    AdminBlockProps,
    Block,
    COMPONENT_REGISTRY,
    ComponentType,
} from "@/components/registry";
import { useCMSStore } from "@/components/registry/CMSStore";
import {
    LayoutGrid,
    Maximize2,
    Minimize2,
    Plus,
    Trash2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

                    <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            Grid Items
                        </div>
                        <div
                            className={cn(
                                "flex flex-col gap-4 p-2 min-h-[50px] border-2 border-dashed border-border/40 rounded-lg"
                            )}
                        >
                            {block.data.children?.map((child, index) => {
                                const Component = COMPONENT_REGISTRY[child.type as ComponentType];
                                const childId = (child as Block).id || nanoid();

                                if (!Component) return null;

                                const AdminComp = Component.AdminComponent as React.FC<
                                    AdminBlockProps<typeof child.data>
                                >;

                                return (
                                    <div
                                        key={childId}
                                        className="relative group w-full"
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
                                    <Button variant="outline" className="w-full h-12 border-dashed gap-2">
                                        <Plus className="w-5 h-5 text-muted-foreground" />
                                        Add Element
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="center" className="w-80 p-0 overflow-hidden">
                                    <div className="flex flex-col h-[400px]">
                                        <div className="p-3 border-b bg-muted/30">
                                            <div className="font-semibold text-sm">Add Element</div>
                                            <div className="text-[10px] text-muted-foreground opacity-70">Select a component to add to the grid</div>
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
                                                                        type: comp.id as ComponentType,
                                                                        data: comp.Schema.parse({}),
                                                                    },
                                                                    id,
                                                                    "children"
                                                                )
                                                            }
                                                            className="text-xs flex flex-col items-center gap-2 p-3 rounded-md hover:bg-accent border border-border/40 hover:border-primary/30 transition-all bg-card/50 shadow-sm"
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border/20 shadow-inner">
                                                                <Plus className="w-4 h-4 opacity-50 font-bold" />
                                                            </div>
                                                            <span className="font-medium text-center leading-tight whitespace-normal">{comp.label}</span>
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
            )}
        </div>
    );
}
