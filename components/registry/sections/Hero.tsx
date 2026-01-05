import { BlockSchema, DBComponentSchema } from "@/components/registry";
import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry/types";
import z from "zod";

type HeroProps = {
  content?: Block<"heading">;
  //   cta: DBComponent<"button">;
};

export const Hero: CMSComponent<"hero", HeroProps> = {
  id: "hero" as const,
  label: "Hero",

  ClientComponent: HeroClientComponent,
  AdminComponent: HeroAdminComponent,
  PreviewComponent: HeroPreviewComponent,

  Schema: z.object({
    content: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "heading", {
        message: "Content must be of type 'heading'",
      })
      .optional() as z.ZodType<Block<"heading">>,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeroClientComponent({ data }: BlockProps<HeroProps>) {
  return <div>{data.content?.data.text}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeroAdminComponent({ id, useStore }: AdminBlockProps<HeroProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"hero">;

  if (!block) return null;

  return (
    <textarea
    //   value={block.data.example}
    //   onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function HeroPreviewComponent() {
  return <div>Hero</div>;
}
