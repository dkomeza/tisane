/**
 * Component: Underlined Card
 */

import { CMSComponent } from "@/components/registry";
import z from "zod";
import { UnderlinedCardClient } from "./UnderlinedCardClient";
import { UnderlinedCardAdmin } from "./UnderlinedCardAdmin";

export type UnderlinedCardProps = {
  mediaId: string;
  text: string;
  description: string;
  underlineColor: string;
  width?: number;
  height?: number;
};

export const UnderlinedCard: CMSComponent<
  "underlined-card",
  UnderlinedCardProps
> = {
  id: "underlined-card" as const,
  label: "Underlined Card",

  ClientComponent: UnderlinedCardClient,
  AdminComponent: UnderlinedCardAdmin,
  PreviewComponent: UnderlinedCardPreview,

  Schema: z.object({
    mediaId: z.string().default(""),
    text: z.string().min(1).default("Card Title"),
    description: z.string().min(1).default("Card Description"),
    underlineColor: z.string().default("#372773"),
    width: z.number().min(1).optional(),
    height: z.number().min(1).optional(),
  }),
};

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function UnderlinedCardPreview() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-md">
      <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
      <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
      <div className="w-full h-1 bg-black rounded-full mt-1"></div>
    </div>
  );
}
