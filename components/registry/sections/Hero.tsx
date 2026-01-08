import { COMPONENT_REGISTRY, DBComponentSchema } from "@/components/registry";
import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  ReactClientComponent,
  ReactAdminComponent,
} from "@/components/registry/types";
import z from "zod";
import { Typography } from "../typography/typography";
import { nanoid } from "nanoid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type HeroProps = {
  content?: DBComponent<"typography">;
  cta?: DBComponent;
  backgroundImage?: DBComponent<"imageComponent">;
};

export const Hero: CMSComponent<"hero", HeroProps> = {
  id: "hero" as const,
  label: "Hero",

  ClientComponent: HeroClientComponent,
  AdminComponent: HeroAdminComponent,
  PreviewComponent: HeroPreviewComponent,

  Schema: z.object({
    content: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "typography", {
        message: "Content must be of type 'typography'",
      })
      .optional() as z.ZodType<DBComponent<"typography">>,
    cta: z.lazy(() => DBComponentSchema).optional(),
    backgroundImage: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "imageComponent", {
        message: "Background Image must be of type 'imageComponent'",
      })
      .optional() as z.ZodType<DBComponent<"imageComponent">>,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeroClientComponent({ data }: BlockProps<HeroProps>) {
  const ImageComponent = COMPONENT_REGISTRY["imageComponent"].ClientComponent;
  const imageData = data.backgroundImage?.data;

  const TypographyComponent = COMPONENT_REGISTRY["typography"].ClientComponent;
  const typographyData = data.content?.data;

  const ctaData = data.cta?.data;
  const CTAComponent =
    data.cta && ctaData
      ? (COMPONENT_REGISTRY[data.cta.type]
          .ClientComponent as ReactClientComponent<typeof ctaData>)
      : null;

  return (
    <section className="relative h-screen">
      {imageData && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <ImageComponent id="hero-background" data={imageData} />
        </div>
      )}
      <div className="h-full flex flex-col md:flex-row justify-end md:justify-between items-end md:items-center gap-20 md:gap-0 py-8">
        {typographyData && (
          <div className="max-w-4xl mx-6 sm:mx-12 md:mr-0 md:ml-16 lg:ml-20 xl:ml-24 2xl:ml-32">
            <TypographyComponent id="hero-content" data={typographyData} />
          </div>
        )}
        {CTAComponent && ctaData && (
          <div className="shrink-0 md:self-end md:pb-8">
            <CTAComponent id="hero-cta" data={ctaData} />
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeroAdminComponent({ id, useStore }: AdminBlockProps<HeroProps>) {
  const { blocks, updateBlock, addBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"hero">;

  if (!block) return null;

  const TypographyComponent = COMPONENT_REGISTRY["typography"].AdminComponent;
  const ImageComponent = COMPONENT_REGISTRY["imageComponent"].AdminComponent;

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Hero Component</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 p-3 rounded-xl col-span-2">
          <p className="mb-2">Content:</p>
          {block.data.content ? (
            <TypographyComponent
              id={(block.data.content as Block).id}
              data={block.data.content!.data}
              useStore={useStore}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              <button
                type="button"
                className="w-full py-12 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => {
                  addBlock(
                    {
                      id: nanoid(),
                      type: "typography",
                      data: Typography.Schema.parse({}),
                    },
                    id,
                    "content"
                  );
                }}
              >
                Add Typography Content
              </button>
            </div>
          )}
        </div>
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="mb-2">CTA:</p>
          {block.data.cta ? (
            (() => {
              const ctaBlock = block.data.cta as Block;
              const CTAAdminComponent = COMPONENT_REGISTRY[ctaBlock.type]
                .AdminComponent as ReactAdminComponent<typeof ctaBlock.data>;

              return (
                <CTAAdminComponent
                  id={ctaBlock.id}
                  data={ctaBlock.data}
                  useStore={useStore}
                />
              );
            })()
          ) : (
            <div className="text-sm text-muted-foreground">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full py-12 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={() => {}}
                  >
                    Add CTA Component
                  </button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-2 gap-3 w-[300px] max-h-96 overflow-y-auto">
                  {Object.values(COMPONENT_REGISTRY).map((component) => (
                    <div
                      key={component.id}
                      className="p-2 border border-transparent hover:border-primary rounded-lg cursor-pointer text-center bg-muted/50 hover:bg-muted transition overflow-hidden"
                      onClick={() => {
                        addBlock(
                          {
                            id: nanoid(),
                            type: component.id,
                            data: component.Schema.parse({}),
                          },
                          id,
                          "cta"
                        );
                      }}
                    >
                      <component.PreviewComponent />
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="mb-2">Background Image:</p>
          {block.data.backgroundImage ? (
            <ImageComponent
              id={(block.data.backgroundImage as Block).id}
              data={block.data.backgroundImage!.data}
              useStore={useStore}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              <button
                type="button"
                className="w-full py-12 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => {
                  addBlock(
                    {
                      id: nanoid(),
                      type: "imageComponent",
                      data: COMPONENT_REGISTRY["imageComponent"].Schema.parse(
                        {}
                      ),
                    },
                    id,
                    "backgroundImage"
                  );
                }}
              >
                Add Background Image Component
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function HeroPreviewComponent() {
  return <div>Hero</div>;
}
