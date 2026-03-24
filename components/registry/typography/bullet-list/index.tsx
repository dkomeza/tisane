/**
 * Component: BulletList
 */

import {
  AdminBlockProps,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type BulletListProps = Record<string, never>;

export const BulletList: CMSComponent<"bullet-list", BulletListProps> = {
  id: "bullet-list" as const,
  label: "Bullet List",

  ClientComponent: BulletListClient,
  AdminComponent: BulletListAdmin,
  PreviewComponent: BulletListPreview,

  Schema: z.object({}),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
export function BulletListClient({
  children,
  as: Tag = "ul",
  tagProps,
  className,
}: BlockProps<BulletListProps> & {
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  tagProps?: Record<string, unknown>;
}) {
  return (
    <Tag 
      className={`pl-6 space-y-1 my-4 ${className || ""}`.trim()} 
      style={{ listStyleType: '"✓ "' }}
      {...tagProps}
    >
      {children}
    </Tag>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function BulletListAdmin() {
  return null; // Operated indirectly through Typography editor
}

/**
 * The preview component is used in the editor UI.
 */
function BulletListPreview() {
  return <div>Bullet List Preview</div>;
}
