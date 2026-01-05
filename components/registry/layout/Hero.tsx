import { DBComponentSchema } from "@/components/registry";
import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
} from "@/components/registry/types";
import z from "zod";

type ComponentProps = {
  content?: DBComponent<"heading">;
  //   cta: DBComponent<"button">;
};

export const Hero: CMSComponent<"hero", ComponentProps> = {
  id: "hero" as const,
  label: "Hero",

  ClientComponent: HeroClientComponent,
  AdminComponent: HeroAdminComponent,
  PreviewComponent: HeroPreviewComponent,

  Schema: z.object({
    content: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "heading", {
        message: "Content must be of type 'heading'",
      })
      .optional() as z.ZodType<DBComponent<"heading">>,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeroClientComponent({ data }: BlockProps<ComponentProps>) {
  return <div>{data.content?.data.text}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeroAdminComponent({ id, useStore }: AdminBlockProps<ComponentProps>) {
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
