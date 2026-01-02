import {
  AdminBlockProps,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

type ButtonProps = {
  content: string;
};

export const Button: CMSComponent<"button", ButtonProps> = {
  id: "button" as const,
  label: "Button",

  ClientComponent: ButtonClientComponent,
  AdminComponent: ButtonAdminComponent,
  PreviewComponent: ButtonPreviewComponent,

  Schema: z.object({
    content: z.string().min(1).max(100).default("Click me"),
  }),
};

function ButtonClientComponent({ data }: BlockProps<ButtonProps>) {
  return <button>{data.content}</button>;
}

function ButtonAdminComponent({
  id,
  data,
  useStore,
}: AdminBlockProps<ButtonProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id);

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
