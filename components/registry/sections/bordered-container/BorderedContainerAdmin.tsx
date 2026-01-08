import React from "react";
import type { AdminBlockProps, Block } from "@/components/registry";
import type { BorderedContainerProps } from ".";

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
export function BorderedContainerAdmin({
  id,
  useStore,
}: AdminBlockProps<BorderedContainerProps>) {
  const { getBlock, updateBlock } = useStore();
  const block = getBlock(id) as Block<"bordered-container">;

  if (!block) return null;

  return (
    <textarea
      value={block.data.example}
      onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}
