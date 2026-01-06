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
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMediaList } from "@/app/actions/media/media";
import { getFileUrl } from "@/app/actions/media/view-action";

export type ImageProps = {
  mediaId: string;
  alt: string;
};

export const ImageComponent: CMSComponent<"imageComponent", ImageProps> = {
  id: "imageComponent" as const,
  label: "Image",

  ClientComponent: ImageClient,
  AdminComponent: ImageAdmin,
  PreviewComponent: ImagePreview,

  Schema: z.object({
    mediaId: z.string().min(1),
    alt: z.string().min(1).default("Image"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ImageClient({ data }: BlockProps<ImageProps>) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getFileUrl(data.mediaId).then((res) => {
      if (res.success) setUrl(res.url!);
    });
  }, [data.mediaId]);

  if (!url) return null;

  return (
    <Image
      src={url}
      alt={data.alt}
      width={data.}
      height={800}
      className="w-full h-auto"
      priority={false}
    />
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ImageAdmin({ id, useStore }: AdminBlockProps<ImageProps>) {
  const { getBlock, updateBlock } = useStore();
  // const block = getBlock(id) as Block<"image">;

  // if (!block) return null;

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
  return (
    <div className="p-3 text-center text-sm text-gray-600">
      Image
    </div>
  );
}
