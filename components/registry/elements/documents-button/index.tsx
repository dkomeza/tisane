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

export const DocumentsButtonSchema = z.object({
  content: z.string().min(1).max(100).default("Download Document"),
  variant: z.enum(["small", "large"]).default("large"),
  color: z
    .enum(["primary", "dark", "white", "violet", "pink"])
    .default("primary"),
  isDisabled: z.boolean().default(false),
  iconLeft: z.string().optional(),
  iconRight: z.string().optional(),
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