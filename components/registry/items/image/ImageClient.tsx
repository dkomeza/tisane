"use client";

import { use, useEffect, useState } from "react";
import { getMedia } from "@/app/actions/media/view-action";
import Image from "next/image";
import { ImageProps } from ".";
import { BlockProps } from "@/components/registry";
import { Media } from "@/lib/prisma";

/**
 * This is the client-side component that will be rendered in the application.
 */

export function ImageClient({ data }: BlockProps<ImageProps>) {
  const [media, setMedia] = useState<Media | null>();

  useEffect(() => {
    if (!data.mediaId) {
      setMedia(null);
      return;
    }

    let isMounted = true;
    getMedia(data.mediaId).then((m) => {
      if (isMounted) setMedia(m);
    });

    return () => { isMounted = false; };
  }, [data.mediaId]);

  if (!media?.url) return null;

  return (
    <Image
      src={media.url}
      alt={media.alt || ""}
      width={media.width || 800}
      height={media.height || 600}
      className="w-full h-auto"
      priority={false}
    />
  );
}
