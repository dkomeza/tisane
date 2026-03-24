/**
 * Component: OrderedList
 */

import {
  AdminBlockProps,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type OrderedListProps = Record<string, never>;

export const OrderedList: CMSComponent<"ordered-list", OrderedListProps> = {
  id: "ordered-list" as const,
  label: "Ordered List",

  ClientComponent: OrderedListClient,
  AdminComponent: OrderedListAdmin,
  PreviewComponent: OrderedListPreview,

  Schema: z.object({}),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
export function OrderedListClient({
  children,
  as: Tag = "ol",
  tagProps,
  className,
}: BlockProps<OrderedListProps> & {
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  tagProps?: Record<string, unknown>;
}) {
  return (
    <Tag
      className={`list-decimal pl-6 space-y-1 my-4 ${className || ""}`.trim()}
      {...tagProps}
    >
      {children}
    </Tag>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function OrderedListAdmin() {
  return null; // Operated indirectly through Typography editor
}

/**
 * The preview component is used in the editor UI.
 */
function OrderedListPreview() {
  return <div>Ordered List Preview</div>;
}
