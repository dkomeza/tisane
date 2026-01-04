import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry/types";
import z from "zod";

type HeadingProps = {
  level: "1" | "2" | "3" | "4" | "5" | "6";
  text: string;
};

export const Heading: CMSComponent<"heading", HeadingProps> = {
  id: "heading" as const,
  label: "Heading",
  ClientComponent: HeadingClientComponent,
  AdminComponent: HeadingAdminComponent,
  PreviewComponent: HeadingPreviewComponent,

  Schema: z.object({
    level: z.enum(["1", "2", "3", "4", "5", "6"] as const).default("2"),
    text: z.string().min(1).max(200).default("Heading Text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function HeadingClientComponent({ data }: BlockProps<HeadingProps>) {
  return <div>{data.text}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function HeadingAdminComponent({
  id,
  useStore,
}: AdminBlockProps<HeadingProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"heading">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.text}
      onChange={(e) => updateBlock(id, { text: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function HeadingPreviewComponent() {
  return <div>Component Preview</div>;
}
