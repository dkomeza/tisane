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
      className="w-full border-b flex flex-col gap-6 pb-4"
      style={{
        borderBottomColor: data.underlineColor,
        width: data.width,
      }}
    >
      <div className="overflow-hidden flex">
        {data.mediaId ? (
          <ImageClient data={{ mediaId: data.mediaId }} id={`${id}-image`} />
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400 border border-dashed border-gray-600 p-20">
            No Image
          </div>
        )}
      </div>

      {/* Text Part & Description */}
      <div className="flex flex-col gap-2">
        <div className="text-[26px] text-[#D2CFCB]">{data.text}</div>
        <div className="text-[16px] text-[#D2CFCB]">{data.description}</div>
      </div>
    </div>
  );
}
