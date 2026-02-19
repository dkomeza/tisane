import {
  AdminBlockProps,
  Block,
  CMSComponent,
} from "@/components/registry";
import z from "zod";
import { ButtonClient } from "./ButtonClient";
import { ButtonAdmin } from "./ButtonAdmin";

export const ButtonSchema = z.object({
  content: z.string().min(1).max(100).default("Click me"),
  variant: z.enum(["small", "large"]).default("large"),
  color: z
    .enum(["primary", "dark", "white", "violet", "pink"])
    .default("primary"),
  iconLeft: z.string().optional(),
  iconRight: z.string().optional(),
});

export type ButtonProps = z.infer<typeof ButtonSchema>;

export const ButtonComponent = {
  id: "button",
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: ButtonSchema,
} as CMSComponent<"button", ButtonProps>;

function ButtonClientComponent(props: any) {
  return <ButtonClient {...props} />;
}

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
