import { AdminBlockProps, Block, CMSComponent } from "@/components/registry";
import z from "zod";
import { ButtonClient } from "./ButtonClient";
import { ButtonAdmin } from "./ButtonAdmin";

export const ButtonActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }),
  z.object({
    type: z.literal("link"),
    linkType: z.enum(["internal", "external"]).default("external"),
    url: z.string().optional(),
    pageId: z.string().optional(),
    newTab: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("download"),
    mediaId: z.string().default(""),
  }),
  z.object({
    type: z.literal("scroll"),
    targetId: z.string().default(""),
  }),
]);

export type ButtonAction = z.infer<typeof ButtonActionSchema>;

export const ButtonSchema = z.object({
  content: z.string().min(1).max(100).default("Click me"),
  variant: z.enum(["small", "large"]).default("large"),
  color: z
    .enum(["primary", "dark", "white", "violet", "pink"])
    .default("primary"),
  iconLeft: z.string().optional(),
  iconRight: z.string().optional(),
  action: ButtonActionSchema.default({ type: "none" }),
});

export type ButtonProps = z.infer<typeof ButtonSchema>;

export const ButtonComponent = {
  id: "button",
  label: "Button",

  ClientComponent: ButtonClient,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: ButtonSchema,
} as CMSComponent<"button", ButtonProps>;

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"button"> | null;

  if (!block) return null;

  return (
    <ButtonAdmin
      id={id}
      data={block.data}
      updateBlock={updateBlock}
      removeBlock={removeBlock}
    />
  );
}

function ButtonPreviewComponent() {
  return <div>Button Preview</div>;
}
