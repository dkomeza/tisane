/**
 * Component: Partnerzy
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type PartnerzyProps = {
  example: string;
};

export const Partnerzy: CMSComponent<"partnerzy", PartnerzyProps> = {
  id: "partnerzy" as const,
  label: "Partnerzy",

  ClientComponent: PartnerzyClient,
  AdminComponent: PartnerzyAdmin,
  PreviewComponent: PartnerzyPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function PartnerzyClient({ data }: BlockProps<PartnerzyProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function PartnerzyAdmin({
  id,
  useStore,
}: AdminBlockProps<PartnerzyProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"partnerzy">;

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
function PartnerzyPreview() {
  return <div>Partnerzy Preview</div>;
}