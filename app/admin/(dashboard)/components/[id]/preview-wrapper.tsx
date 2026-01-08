"use client";

import { useEffect, useState } from "react";
import {
  COMPONENT_REGISTRY,
  ComponentRegistry,
  ComponentType,
} from "@/components/registry";
import {
  Block,
  BlockProps,
  AdminBlockProps,
} from "@/components/registry/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Monitor, Shield } from "lucide-react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCMSStore } from "@/components/registry/CMSStore";

interface Props<T extends ComponentType> {
  componentType: T;
}

export function ComponentPreviewWrapper<T extends ComponentType>({
  componentType,
}: Props<T>) {
  const component = COMPONENT_REGISTRY[componentType] as ComponentRegistry[T];

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const defaultTab = searchParams.get("tab") || "client";
  const { blocks, setBlocks } = useCMSStore();

  type TABS = "client" | "admin";
  const [activeTab, setActiveTab] = useState<TABS>(defaultTab as TABS);

  useEffect(() => {
    const initialBlock: Block<T> = {
      id: nanoid(8),
      type: componentType,
      data: { ...component.Schema.parse({}) } as Block<T>["data"],
    };
    setBlocks([initialBlock]);
  }, [componentType, setBlocks, component.Schema]);

  if (!component || blocks.length === 0) return null;
  const block = blocks[0] as Block<T>;

  const ClientComponent = component.ClientComponent as React.FC<
    BlockProps<typeof block.data>
  >;
  const AdminComponent = component.AdminComponent as React.FC<
    AdminBlockProps<typeof block.data>
  >;

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
      <Tabs
        className="flex-1"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as TABS);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("tab", value);
          router.replace(`${pathname}?${newParams.toString()}`, {
            scroll: false,
          });
        }}
      >
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
          <div className="flex-1 p-8 min-h-[400px] flex justify-center items-center relative">
            <TabsContent value="client">
              <ClientComponent id={block.id} data={block.data} />
            </TabsContent>
            <TabsContent
              value="admin"
              className="w-xl overflow-hidden flex flex-col"
            >
              <AdminComponent
                id={block.id}
                data={block.data}
                useStore={useCMSStore}
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
