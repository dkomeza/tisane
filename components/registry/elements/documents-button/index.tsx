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
import { ButtonSchema } from "../button";

export const DocumentsButtonSchema = ButtonSchema.extend({
  mediaId: z.string().default(""),
});

export type DocumentsButtonProps = z.infer<typeof DocumentsButtonSchema>;

export const DocumentsButton: CMSComponent<
  "documents-button",
  DocumentsButtonProps
> = {
  id: "documents-button" as const,
  label: "Documents Button",

  ClientComponent: DocumentsButtonClient,
  AdminComponent: DocumentsButtonAdmin,
  PreviewComponent: DocumentsButtonPreview,

  Schema: DocumentsButtonSchema,
};