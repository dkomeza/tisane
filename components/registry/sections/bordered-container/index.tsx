/**
 * Component: Bordered Container
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";
import { BorderedContainerAdmin } from "./BorderedContainerAdmin";

export type BorderedContainerProps = {
  example: string;
};

export const BorderedContainer: CMSComponent<"bordered-container", BorderedContainerProps> = {
  id: "bordered-container" as const,
  label: "Bordered Container",

  ClientComponent: BorderedContainerClient,
  AdminComponent: BorderedContainerAdmin,
  PreviewComponent: BorderedContainerPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function BorderedContainerClient({ data }: BlockProps<BorderedContainerProps>) {
  return <div>{data.example}</div>;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function BorderedContainerPreview() {
  return <div>Bordered Container Preview</div>;
}