/**
 * Component: ListItem
 */

import {
  AdminBlockProps,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

export type ListItemProps = {
  markerColor?: string | null;
};

export const ListItem: CMSComponent<"list-item", ListItemProps> = {
  id: "list-item" as const,
  label: "List Item",

  ClientComponent: ListItemClient,
  AdminComponent: ListItemAdmin,
  PreviewComponent: ListItemPreview,

  Schema: z.object({
    markerColor: z.string().nullable().optional(),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
export function ListItemClient({
  data,
  children,
  as: Tag = "li",
  tagProps,
  className,
}: BlockProps<ListItemProps> & {
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  tagProps?: Record<string, unknown>;
}) {
  const { markerColor } = data;

  return (
    <Tag
      style={
        markerColor
          ? ({ "--marker-color": markerColor } as React.CSSProperties)
          : undefined
      }
      className={
        markerColor
          ? `marker:text-(--marker-color) ${className || ""}`.trim()
          : className || ""
      }
      {...tagProps}
    >
      {children}
    </Tag>
  );
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ListItemAdmin() {
  return null; // Operated indirectly through Typography editor
}

/**
 * The preview component is used in the editor UI.
 */
function ListItemPreview() {
  return <div>List Item Preview</div>;
}
