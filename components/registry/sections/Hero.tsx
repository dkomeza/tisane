import {
  COMPONENT_REGISTRY,
  createBlock,
  DBComponentSchema,
} from "@/components/registry";
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

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
    <main className="relative h-screen isolate">
      {imageData && (
        <div className="absolute inset-0 -z-10 overflow-hidden [&>img]:object-cover [&>img]:object-top">
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
    </main>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeroAdminComponent({ id, useStore }: AdminBlockProps<HeroProps>) {
  const { blocks, addBlock, removeBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"hero">;

  if (!block) return null;

  const TypographyComponent = COMPONENT_REGISTRY["typography"].AdminComponent;
  const ImageComponent = COMPONENT_REGISTRY["imageComponent"].ClientComponent;
  const ImageAdminComponent =
    COMPONENT_REGISTRY["imageComponent"].AdminComponent;

  const ctaData = block.data.cta?.data;
  const CTARegistryComponent = block.data.cta?.type
    ? COMPONENT_REGISTRY[block.data.cta.type]
    : null;
  const CTAComponent = CTARegistryComponent
    ? CTARegistryComponent.ClientComponent
    : null;
  const CTAAdminComponent = CTARegistryComponent
    ? CTARegistryComponent.AdminComponent
    : null;

  console.log("CTA Registry Component:", CTARegistryComponent);

  const imageData = block.data.backgroundImage?.data;

  return (
    <main className="w-full relative aspect-video isolate group border border-dashed border-transparent hover:border-primary/30 rounded-sm overflow-hidden">
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Edit background
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {block.data.backgroundImage ? (
              <ImageAdminComponent
                id={(block.data.backgroundImage as Block).id}
                data={block.data.backgroundImage!.data}
                useStore={useStore}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                <button
                  type="button"
                  className="w-full py-8 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => {
                    const newBlock = createBlock("imageComponent");
                    addBlock(newBlock, block.id, "backgroundImage");
                  }}
                >
                  Add Background Image
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeBlock(block.id)}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>

      {imageData && (
        <div className="absolute inset-0 -z-10 overflow-hidden [&>img]:object-cover [&>img]:object-top">
          <ImageComponent id="hero-background" data={imageData} />
        </div>
      )}
      <div className="h-full flex flex-col @md:flex-row justify-end @md:justify-between items-end @md:items-center gap-20 @md:gap-0 py-8">
        <div className="max-w-4xl mx-6 @sm:mx-12 @md:mr-0 @md:ml-16 @lg:ml-20 @xl:ml-24 @2xl:ml-32 z-10">
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
                className="w-full py-12 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => {
                  const newBlock = createBlock("typography");
                  addBlock(newBlock, block.id, "content");
                }}
              >
                Add Typography Content
              </button>
            </div>
          )}
        </div>
        <div className="shrink-0 @md:self-end @md:pb-8">
          {CTAAdminComponent && ctaData ? (
            <>
              <CTAAdminComponent
                id={(block.data.cta as Block).id}
                // @ts-expect-error - The type is not correctly inferred here, but it will work at runtime
                data={ctaData}
                useStore={useStore}
              />
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" type="button">
                    Add Call to Action
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    {Object.values(COMPONENT_REGISTRY)
                      .filter((comp) => comp.id !== "hero")
                      .map((comp) => (
                        <Button
                          key={comp.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newBlock = createBlock(comp.id);
                            addBlock(newBlock, block.id, "cta");
                          }}
                        >
                          {comp.label}
                        </Button>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function HeroPreviewComponent() {
  return <div>Hero</div>;
}
