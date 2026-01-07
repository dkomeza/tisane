/**
 * Component: Underlined Card
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type UnderlinedCardProps = {
  example: string;
};

export const UnderlinedCard: CMSComponent<"underlined-card", UnderlinedCardProps> = {
  id: "underlined-card" as const,
  label: "Underlined Card",

  ClientComponent: UnderlinedCardClient,
  AdminComponent: UnderlinedCardAdmin,
  PreviewComponent: UnderlinedCardPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function UnderlinedCardClient({ data }: BlockProps<UnderlinedCardProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function UnderlinedCardAdmin({
  id,
  useStore,
}: AdminBlockProps<UnderlinedCardProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"underlined-card">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.example}
      onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function UnderlinedCardPreview() {
  return <div>Underlined Card Preview</div>;
}