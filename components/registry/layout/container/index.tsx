import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  COMPONENT_REGISTRY,
  createBlock,
  BlockSchema,
  getComponentByType,
  ReactAdminComponent,
} from "@/components/registry";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import z from "zod";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageComponent } from "../../items/image";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Color = string;

const PADDING_OPTIONS = [
  { value: "minimal", label: "Minimal", top: "pt-4", bottom: "pb-4" },
  { value: "medium", label: "Medium", top: "pt-16", bottom: "pb-16" },
  { value: "large", label: "Large", top: "pt-48", bottom: "pb-48" },
] as const;

type PaddingSize = (typeof PADDING_OPTIONS)[number]["value"];

function getPaddingClass(size: string, side: "t" | "b"): string {
  const option = PADDING_OPTIONS.find((o) => o.value === size);
  if (!option) return "";
  return side === "t" ? option.top : option.bottom;
}

export type ContainerProps = {
  background: Color | Block<"imageComponent"> | null;
  content: Block | null;
  paddingTop: PaddingSize;
  paddingBottom: PaddingSize;
  variant: "root" | "nested";
};

export const SectionContainerProps: ContainerProps = {
  background: null,
  content: null,
  paddingBottom: "minimal",
  paddingTop: "minimal",
  variant: "root",
};

export const Container: CMSComponent<"container", ContainerProps> = {
  id: "container" as const,
  label: "Container",

  ClientComponent: ContainerClient,
  AdminComponent: ContainerAdmin,
  PreviewComponent: ContainerPreview,

  Schema: z.object({
    background: z
      .union([
        z.string().nullable(), // For color values
        z
          .lazy(() => BlockSchema)
          .refine((data) => data.type === "imageComponent", {
            message: "Background must be of type 'imageComponent'",
          })
          .nullable() as z.ZodType<Block<"imageComponent">>,
      ])
      .default(null),
    content: z
      .lazy(() => BlockSchema)
      .nullable()
      .default(null),
    paddingTop: z.enum(["minimal", "medium", "large"]).default("medium"),
    paddingBottom: z.enum(["minimal", "medium", "large"]).default("medium"),
    variant: z.enum(["root", "nested"]).default("root"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ContainerClient({
  data,
  children,
}: BlockProps<ContainerProps> & { children?: React.ReactNode }) {
  const ContentComponent = data.content
    ? (getComponentByType(data.content.type).ClientComponent as React.FC<
        BlockProps<typeof data.content.data>
      >)
    : null;

  const content = data.content ? (data.content as Block) : null;

  return (
    <section
      className={cn(
        "w-full relative isolate",
        getPaddingClass(data.paddingTop, "t"),
        getPaddingClass(data.paddingBottom, "b"),
      )}
    >
      {data.background && typeof data.background === "string" && (
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: data.background }}
        />
      )}
      {data.background && typeof data.background !== "string" && (
        <div className="absolute inset-0 -z-10 [&>img]:object-cover [&>img]:w-full [&>img]:h-full">
          <ImageComponent.ClientComponent
            id={nanoid()}
            data={data.background.data}
          />
        </div>
      )}
      <div className="container mx-auto @container/block">
        {content && ContentComponent && (
          <ContentComponent id={content.id} data={content.data} />
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Container Admin — renders like the client component with background,
 * settings popover for background configuration, and inline content editing.
 */
function ContainerAdmin({ id, useStore }: AdminBlockProps<ContainerProps>) {
  const { getBlock, addBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"container">;

  if (!block) return null;

  return (
    <div className="relative group/container w-full isolate">
      {/* Settings trigger */}
      <div className="absolute -top-3 right-1 z-10 flex items-center gap-1 opacity-0 group-hover/container:opacity-100 transition-opacity duration-200">
        {/* Background settings */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
              title="Container Settings"
            >
              <Settings className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-3" side="top" align="end">
            <div className="text-sm font-semibold text-foreground">
              Container Settings
            </div>

            {/* Background tabs */}
            <Tabs
              defaultValue={
                block.data.background === null
                  ? "none"
                  : typeof block.data.background === "string"
                    ? "color"
                    : "image"
              }
              onValueChange={(val) => {
                if (val === "none") {
                  if (
                    block.data.background &&
                    (block.data.background as Block).type === "imageComponent"
                  ) {
                    const backgroundId = (block.data.background as Block).id;
                    removeBlock(backgroundId);
                  } else {
                    updateBlock(id, { background: null });
                  }
                } else if (val === "color") {
                  if (
                    block.data.background &&
                    (block.data.background as Block).type === "imageComponent"
                  ) {
                    const backgroundId = (block.data.background as Block).id;
                    removeBlock(backgroundId);
                  }
                  updateBlock(id, { background: "#000000" });
                } else if (val === "image") {
                  const newBlock = createBlock("imageComponent");
                  addBlock(newBlock, id, "background");
                }
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="none" className="flex-1">
                  None
                </TabsTrigger>
                <TabsTrigger value="color" className="flex-1">
                  Color
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1">
                  Image
                </TabsTrigger>
              </TabsList>
              <TabsContent value="color" className="pt-2">
                {typeof block.data.background === "string" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={block.data.background || "#000000"}
                      onChange={(e) =>
                        updateBlock(id, { background: e.target.value })
                      }
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="image" className="pt-2">
                {block.data.background &&
                  (block.data.background as Block).type && (
                    <ImageComponent.AdminComponent
                      id={(block.data.background as Block).id}
                      // @ts-expect-error - TypeScript can't infer the type here, but we know it's correct based on the checks above
                      data={(block.data.background as Block).data}
                      useStore={useStore}
                    />
                  )}
              </TabsContent>
              <TabsContent value="none" className="pt-2">
                <p className="text-xs text-muted-foreground">
                  No background applied.
                </p>
              </TabsContent>
            </Tabs>

            {/* Padding */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Top
                </label>
                <Select
                  value={block.data.paddingTop}
                  onValueChange={(v) =>
                    updateBlock(id, { paddingTop: v as PaddingSize })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PADDING_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Bottom
                </label>
                <Select
                  value={block.data.paddingBottom}
                  onValueChange={(v) =>
                    updateBlock(id, { paddingBottom: v as PaddingSize })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PADDING_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Variant */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Layout
              </label>
              <div className="flex p-1 bg-muted rounded-lg">
                {(["root", "nested"] as const).map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => updateBlock(id, { variant: v })}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                      block.data.variant === v
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeBlock(id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete Container
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Hover outline */}
      <div className="rounded-md ring-2 ring-transparent group-hover/container:ring-primary/30 transition-all duration-200">
        {/* Actual container layout matching the client */}
        <section
          className={cn(
            "block @container/block w-full relative isolate",
            getPaddingClass(block.data.paddingTop, "t"),
            getPaddingClass(block.data.paddingBottom, "b"),
          )}
        >
          {/* Background rendering (same as client) */}
          {block.data.background &&
            typeof block.data.background === "string" && (
              <div
                className="absolute inset-0 -z-10 rounded-md"
                style={{ backgroundColor: block.data.background }}
              />
            )}
          {block.data.background &&
            typeof block.data.background !== "string" && (
              <div className="absolute inset-0 -z-10 [&>img]:object-cover [&>img]:w-full [&>img]:h-full rounded-md overflow-hidden">
                <ImageComponent.ClientComponent
                  id={nanoid()}
                  data={block.data.background.data}
                />
              </div>
            )}

          {/* Content */}
          <div
            className={cn(
              block.data.variant === "root" &&
                "px-8 @md/block:px-12 @lg/block:px-20 @xl/block:px-28 @2xl/block:px-32",
            )}
          >
            {block.data.content ? (
              (() => {
                const content = block.data.content as Block<
                  typeof block.data.content.type
                >;

                const Component = getComponentByType(content.type)
                  .AdminComponent as ReactAdminComponent<typeof content.data>;

                return (
                  <Component
                    id={content.id}
                    data={content.data}
                    useStore={useStore}
                  />
                );
              })()
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-24 border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all gap-2 text-muted-foreground"
                  >
                    <Plus className="size-5" />
                    <span className="text-sm font-medium">Add Content</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <ScrollArea className="h-96">
                    <div className="grid grid-cols-2 gap-2 h-full overflow-hidden">
                      {Object.entries(COMPONENT_REGISTRY).map(
                        ([key, component]) => {
                          return (
                            <button
                              key={key}
                              type="button"
                              className="text-left text-sm hover:bg-accent/10 rounded-md px-2 py-1"
                              onClick={() => {
                                addBlock(
                                  createBlock(component.id),
                                  id,
                                  "content",
                                );
                              }}
                            >
                              <component.PreviewComponent />
                            </button>
                          );
                        },
                      )}
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ContainerPreview() {
  return <div>Container Preview</div>;
}
