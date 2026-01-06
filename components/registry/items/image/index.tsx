/**
 * Component: Image
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type ImageProps = {
  mediaId: string;
  alt: string;
};

export const Image: CMSComponent<"image", ImageProps> = {
  id: "image" as const,
  label: "Image",

  ClientComponent: ImageClient,
  AdminComponent: ImageAdmin,
  PreviewComponent: ImagePreview,

  Schema: z.object({
    mediaId: z.string().min(1),
    alt: z.string().min(1),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ImageClient({ data }: BlockProps<ImageProps>) {
  return <div>{/* {data.example} */}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ImageAdmin({ id, useStore }: AdminBlockProps<ImageProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"image">;

  if (!block) return null;

  return (
    <textarea
    // value={block.data.example}
    // onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ImagePreview() {
  return <div>Image Preview</div>;
}
