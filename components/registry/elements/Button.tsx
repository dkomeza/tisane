import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

type ButtonProps = {
  content: string;
  variant: "small" | "large";
  color: "primary" | "dark" | "white" | "violet" | "pink";
  isDisabled: boolean;
};

export const Button: CMSComponent<"button", ButtonProps> = {
  id: "button" as const,
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: z.object({
    content: z.string().min(1).max(100).default("Click me"),
    variant: z.enum(["small", "large"]).default("large"),
    color: z.enum(["primary", "dark", "white", "violet", "pink"]).default("primary"),
    isDisabled: z.boolean().default(false),
  }),
};

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
  return <button disabled={data.isDisabled}>{data.content}</button>;
}

function ButtonAdminComponent({ id, useStore }: AdminBlockProps<ButtonProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"button">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.content}
      onChange={(e) => updateBlock(id, { content: e.target.value })}
    ></textarea>
  );
}

function ButtonPreviewComponent() {
  return <button disabled>Button Preview</button>;
}
