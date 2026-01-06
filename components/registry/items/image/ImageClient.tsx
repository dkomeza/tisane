"use client";

import { useState, useEffect, use } from "react";
import { getFileUrl } from "@/app/actions/media/view-action";
import Image from "next/image";
import { ImageProps } from ".";
import { BlockProps } from "@/components/registry";

/**
 * This is the client-side component that will be rendered in the application.
 */

function ImageClient({ data }: BlockProps<ImageProps>) {
    

//   const [url, setUrl] = useState<string | null>(null);
//   use(() => {
//     getFileUrl(data.mediaId).then((res) => {
//       if (res.success) setUrl(res.url!);
//     });
//   }, [data.mediaId]);

  if (!url) return null;

  return (
    <Image
      src={url}
      alt={"Image"}
      width={800}
      height={800}
      className="w-full h-auto"
      priority={false}
    />
  );
}
