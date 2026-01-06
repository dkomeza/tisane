/**
 * Component: Image
 */

import {
  CMSComponent,
} from "@/components/registry";
import z from "zod";
import { ImageClient } from "./ImageClient";
import { ImageAdmin } from "./ImageAdmin";

export type ImageProps = {
  mediaId: string;
};

export const ImageComponent: CMSComponent<"imageComponent", ImageProps> = {
  id: "imageComponent" as const,
  label: "Image",

  ClientComponent: ImageClient,
  AdminComponent: ImageAdmin,
  PreviewComponent: ImagePreview,

  Schema: z.object({
    mediaId: z.string().min(1),
  }),
};

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ImagePreview() {
  return <div className="p-3 text-center text-sm text-gray-600">Image</div>;
}
