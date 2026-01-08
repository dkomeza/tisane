import { COMPONENT_REGISTRY, DBComponentSchema } from "@/components/registry";
import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  ReactClientComponent,
} from "@/components/registry/types";
import z from "zod";
import { Typography } from "../typography/typography";
import { nanoid } from "nanoid";

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
  const CTAComponent = (
    data.cta && ctaData
      ? COMPONENT_REGISTRY[data.cta.type].ClientComponent
      : null
  ) as ReactClientComponent<any> | null;

  return (
    <section className="relative">
      {imageData && (
        <div className="absolute inset-0 -z-10">
          {/* Render background image component */}
          <ImageComponent id="hero-background" data={imageData} />
        </div>
      )}
      <div className="container mx-auto py-20 text-center text-white">
        {typographyData && (
          <div className="mb-6">
            {/* Render typography component */}
            <TypographyComponent id="hero-content" data={typographyData} />
          </div>
        )}
        {CTAComponent && ctaData && (
          <CTAComponent id="hero-cta" data={ctaData} />
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
            <div></div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <button
                className="w-full py-12 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => {}}
              >
                Add CTA Component
              </button>
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
