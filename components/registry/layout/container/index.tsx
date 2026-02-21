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
    <section className="p-4 block @container/block w-full">
      <div className="@2xl/block:px-32">
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
  const { getBlock, addBlock } = useStore();
  const block = getBlock(id) as Block<"container">;

  if (!block) return null;

  return (
    <div className="p-8 hover:border-secondary border border-transparent rounded-sm w-full">
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
            <div className="grid grid-cols-2 gap-2">
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
