"use client";

import { use } from "react";
import { getMedia } from "@/app/actions/media/view-action";
import Image from "next/image";
import { ImageProps } from ".";
import { BlockProps } from "@/components/registry";

/**
 * This is the client-side component that will be rendered in the application.
 */

export function ImageClient({ data }: BlockProps<ImageProps>) {
  const media = use(getMedia(data.mediaId));

  if (!media?.url) return null;

  return (
    <Image
      src={media.url}
      alt={media.alt || ""}
      width={media.width}
      height={media.height}
      className="w-full h-auto"
      priority={false}
    />
  );
}
