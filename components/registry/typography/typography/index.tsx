/**
 * Component: Typography
 */

import { BlockProps, CMSComponent } from "@/components/registry";
import z from "zod";
import { TypographyAdmin } from "./TypographyAdmin";

export type TypographyProps = {
  content: string;
};

export const Typography = {
  id: "typography" as const,
  label: "Typography",

  ClientComponent: TypographyClient,
  AdminComponent: TypographyAdmin,
  PreviewComponent: TypographyPreview,

  Schema: z.object({
    content: z.string().default("<p>Start typing...</p>"),
  }),
} as CMSComponent<"typography", TypographyProps>;

/**
 * This is the client-side component that will be rendered in the application.
 */
function TypographyClient({ data }: BlockProps<TypographyProps>) {
  return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function TypographyPreview() {
  return <div>Typography Preview</div>;
}
