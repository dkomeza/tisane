/**
 * Component: DocumentsButton
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type DocumentsButtonProps = {
  example: string;
};

export const DocumentsButton: CMSComponent<"documents-button", DocumentsButtonProps> = {
  id: "documents-button" as const,
  label: "DocumentsButton",

  ClientComponent: DocumentsButtonClient,
  AdminComponent: DocumentsButtonAdmin,
  PreviewComponent: DocumentsButtonPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function DocumentsButtonClient({ data }: BlockProps<DocumentsButtonProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function DocumentsButtonAdmin({
  id,
  useStore,
}: AdminBlockProps<DocumentsButtonProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"documents-button">;

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
function DocumentsButtonPreview() {
  return <div>DocumentsButton Preview</div>;
}