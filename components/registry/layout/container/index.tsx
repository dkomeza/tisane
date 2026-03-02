import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  COMPONENT_REGISTRY,
  createBlock,
  DBComponent,
  DBComponentSchema,
  getComponentByType,
  ReactAdminComponent,
} from "@/components/registry";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import z from "zod";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrashIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageComponent } from "../../items/image";
import { nanoid } from "nanoid";

type Color = string;

export type ContainerProps = {
  background: Color | DBComponent<"imageComponent"> | null;
  content: DBComponent | null;
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
          .lazy(() => DBComponentSchema)
          .refine((data) => data.type === "imageComponent", {
            message: "Background must be of type 'imageComponent'",
          })
          .nullable() as z.ZodType<DBComponent<"imageComponent">>,
      ])
      .default(null),
    content: z
      .lazy(() => DBComponentSchema)
      .nullable()
      .default(null),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ContainerClient({ data }: BlockProps<ContainerProps>) {
  const ContentComponent = data.content
    ? (getComponentByType(data.content.type).ClientComponent as React.FC<
        BlockProps<typeof data.content.data>
      >)
    : null;

  const content = data.content ? (data.content as Block) : null;

  return (
    <section className="pt-48 pb-8 block @container/block w-full relative isolate">
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
      <div className="px-8 @md/block:px-12 @lg/block:px-20 @xl/block:px-28 @2xl/block:px-32">
        {content && ContentComponent && (
          <ContentComponent id={content.id} data={content.data} />
        )}
      </div>
    </section>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ContainerAdmin({ id, useStore }: AdminBlockProps<ContainerProps>) {
  const { getBlock, addBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"container">;

  if (!block) return null;

  return (
    <div className="p-2 hover:border-secondary border border-transparent rounded-sm w-full relative group overflow-visible isolate">
      <>
        {block.data.background && typeof block.data.background === "string" && (
          <div
            className="absolute inset-0 -z-10"
            style={{ backgroundColor: block.data.background }}
          />
        )}
        {block.data.background && typeof block.data.background !== "string" && (
          <div className="absolute inset-0 -z-10 [&>img]:object-cover [&>img]:w-full [&>img]:h-full">
            <ImageComponent.ClientComponent
              id={nanoid()}
              data={block.data.background.data}
            />
          </div>
        )}
      </>
      <div className="p-2 w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h3 className="font-semibold">Container</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" type="button">
                Edit Background
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Tabs
                defaultValue="none"
                // className="w-[300px]"
                onValueChange={(val) => {
                  if (val === "none") {
                    if (
                      block.data.background &&
                      (block.data.background as DBComponent).type ===
                        "imageComponent"
                    ) {
                      const backgroundId = (block.data.background as Block).id;
                      removeBlock(backgroundId);
                    } else {
                      updateBlock(id, {
                        background: null,
                      });
                    }
                  } else if (val === "color") {
                    if (
                      block.data.background &&
                      (block.data.background as DBComponent).type ===
                        "imageComponent"
                    ) {
                      const backgroundId = (block.data.background as Block).id;
                      removeBlock(backgroundId);
                    }
                    updateBlock(id, {
                      background: "#000000",
                    });
                  } else if (val === "image") {
                    const newBlock = createBlock("imageComponent");
                    addBlock(newBlock, id, "background");
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="none">None</TabsTrigger>
                  <TabsTrigger value="color">Color</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>
                <TabsContent value="color" className="p-4"></TabsContent>
                <TabsContent value="image" className="p-4">
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
                <TabsContent value="none" className="p-4"></TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={() => {
            removeBlock(id);
          }}
        >
          <TrashIcon />
        </Button>
      </div>
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
            <Button
              type="button"
              variant="outline"
              className="w-full py-16 text-xl"
            >
              Add Content
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-2 gap-2 h-full overflow-hidden">
                {Object.entries(COMPONENT_REGISTRY).map(([key, component]) => {
                  return (
                    <button
                      key={key}
                      type="button"
                      className="text-left text-sm hover:bg-accent/10 rounded-md px-2 py-1"
                      onClick={() => {
                        addBlock(createBlock(component.id), id, "content");
                      }}
                    >
                      <component.PreviewComponent />
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
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
