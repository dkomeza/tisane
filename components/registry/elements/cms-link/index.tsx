/**
 * Component: CMSLink
 */

import { BlockProps, CMSComponent } from "@/components/registry";
import z from "zod";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { CmsLinkAdmin } from "./CmsLinkAdmin";

export type CmsLinkProps = {
  text: string;
  linkType: "internal" | "external";
  url?: string;
  pageId?: string;
  newTab: boolean;
};

const Schema = z.object({
  text: z.string().min(1).default("Link Text"),
  linkType: z.enum(["internal", "external"]).default("external"),
  url: z.string().optional(),
  pageId: z.string().optional(),
  newTab: z.boolean().default(false),
});

export const CmsLink: CMSComponent<"cms-link", CmsLinkProps> = {
  id: "cms-link" as const,
  label: "CMSLink",

  ClientComponent: CmsLinkClient,
  AdminComponent: CmsLinkAdmin,
  PreviewComponent: CmsLinkPreview,

  Schema: Schema,
};

/**
 * This is the client-side component that will be rendered in the application.
 */
export function CmsLinkClient({ data }: BlockProps<CmsLinkProps>) {
  const href = data.url || "#";
  const target = data.newTab ? "_blank" : undefined;
  const rel = data.newTab ? "noopener noreferrer" : undefined;

  return (
    <Link href={href} target={target} rel={rel} className="hover:underline">
      {data.text}
    </Link>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function CmsLinkPreview() {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-center">
      <LinkIcon className="w-6 h-6 text-gray-400" />
      <span className="ml-2 font-medium text-gray-600">CMS Link</span>
    </div>
  );
}
