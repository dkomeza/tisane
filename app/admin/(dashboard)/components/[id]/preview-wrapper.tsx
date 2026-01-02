"use client";

import { useState, useEffect } from "react";
import { COMPONENT_REGISTRY, ComponentType } from "@/components/registry";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Monitor, Shield } from "lucide-react";
import { create } from "zustand";
import { CMSStore, Block } from "@/components/registry/store";
import { nanoid } from "nanoid";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";

interface Props {
  componentType: ComponentType;
}

const usePreviewStore = create<CMSStore>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  updateBlock: (id, data) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, data: { ...block.data, ...data } } : block
      ),
    })),
}));

export function ComponentPreviewWrapper({ componentType }: Props) {
  const component = COMPONENT_REGISTRY[componentType];
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");
  const { blocks, setBlocks } = usePreviewStore();

  useEffect(() => {
    // Initialize with a single block of the component type
    const initialBlock: Block<typeof componentType> = {
      id: nanoid(8),
      type: componentType,
      data: { ...component.Schema.parse({}) },
    };
    setBlocks([initialBlock]);
  }, [componentType, setBlocks, component.Schema]);

  if (!component || blocks.length === 0) return null;
  const block = blocks[0];

  const ClientComponent = component.ClientComponent;
  const AdminComponent = component.AdminComponent;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/admin/components">Components</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{component.label} Preview</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{component.label}</h1>
        <p className="text-muted-foreground">
          Preview ID:{" "}
          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
            {block.id}
          </span>
        </p>
      </div>
      <Tabs defaultValue="client" className="flex-1">
        <Card className="flex-1 border-muted/60 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm py-0">
          <div className="border-b border-border/50 bg-muted/20 p-3 flex items-center justify-between">
            <TabsList className="flex p-1 bg-muted rounded-lg w-fit">
              <TabsTrigger
                value="client"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  "data-[state=active]:bg-background! [data-state=active]:shadow-sm! data-[state=active]:text-primary!",
                  "data-[state=inactive]:text-muted-foreground! data-[state=inactive]:hover:text-foreground!"
                )}
              >
                <Monitor className="w-4 h-4" /> Client View
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  "data-[state=active]:bg-background! [data-state=active]:shadow-sm! data-[state=active]:text-primary!",
                  "data-[state=inactive]:text-muted-foreground! data-[state=inactive]:hover:text-foreground!"
                )}
              >
                <Shield className="w-4 h-4" /> Admin View
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 p-8 min-h-[400px] flex items-center justify-center relative">
            <TabsContent value="client">
              <ClientComponent id={block.id} data={block.data} />
            </TabsContent>
            <TabsContent value="admin">
              <AdminComponent
                id={block.id}
                data={block.data}
                useStore={usePreviewStore}
              />
            </TabsContent>
          </div>

          <div className="p-4 border-t border-border/50 bg-muted/10 text-xs text-muted-foreground font-mono">
            Code: {JSON.stringify(blocks)}
          </div>
        </Card>
      </Tabs>
    </div>
  );
}
