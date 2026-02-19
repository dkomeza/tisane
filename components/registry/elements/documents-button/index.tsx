/**
 * Component: DocumentsButton
 */

import { CMSComponent } from "@/components/registry";
import z from "zod";
import { DocumentsButtonAdmin } from "./DocumentsButtonAdmin";
import {
  DocumentsButtonClient,
  DocumentsButtonPreview,
} from "./DocumentsButtonClient";

export type DocumentsButtonProps = {
  example: string;
};

export const DocumentsButton: CMSComponent<
  "documents-button",
  DocumentsButtonProps
> = {
  id: "documents-button" as const,
  label: "DocumentsButton",

  ClientComponent: DocumentsButtonClient,
  AdminComponent: DocumentsButtonAdmin,
  PreviewComponent: DocumentsButtonPreview,

  Schema: z.object({
    example: z.string().min(1).max(500).default("Example text"),
  }),
};