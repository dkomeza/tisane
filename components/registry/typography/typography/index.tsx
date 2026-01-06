/**
 * Component: Typography
 */

import { BlockProps, CreateComponent } from "@/components/registry";
import z from "zod";
import { TypographyAdmin } from "./TypographyAdmin";

export const Schema = z.object({
  example: z.string().min(1).max(100).default("Example content"),
});

export type TypographyProps = z.infer<typeof Schema>;

export const Typography = CreateComponent({
  id: "typography" as const,
  label: "Typography",

  ClientComponent: TypographyClient,
  AdminComponent: TypographyAdmin,
  PreviewComponent: TypographyPreview,

  Schema,
});

/**
 * This is the client-side component that will be rendered in the application.
 */
function TypographyClient({ data }: BlockProps<TypographyProps>) {
  return <div>{data.example}</div>;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function TypographyPreview() {
  return <div>Typography Preview</div>;
}
