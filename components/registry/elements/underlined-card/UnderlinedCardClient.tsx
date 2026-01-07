"use client";

import { BlockProps } from "@/components/registry";
import { UnderlinedCardProps } from "./index";
import { ImageClient } from "@/components/registry/items/image/ImageClient";

export function UnderlinedCardClient({
  data,
  id,
}: BlockProps<UnderlinedCardProps>) {
  return (
    <div
      className="w-full border-b"
      style={{
        borderBottomColor: data.underlineColor,
        width: data.width,
      }}
    >
      <div className="overflow-hidden flex items-center justify-center gap-24">
        {data.mediaId ? (
          <ImageClient data={{ mediaId: data.mediaId }} id={`${id}-image`} />
        ) : (
          <div className=" h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Text Part & Description */}
      <div className="flex flex-col gap-8">
        <div className="text-[26px] text-[#D2CFCB]">{data.text}</div>
        <div className="text-[16px] text-[#D2CFCB]">{data.description}</div>
      </div>
    </div>
  );
}