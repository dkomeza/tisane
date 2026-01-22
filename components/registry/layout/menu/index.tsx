/**
 * Component: Menu
 */

import {
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import z from "zod";
import { MenuAdmin } from "./AdminComponent";

export type MenuProps = {
  left: DBComponent[];
  center: DBComponent[];
  right: DBComponent[];
};

export const Menu: CMSComponent<"menu", MenuProps> = {
  id: "menu" as const,
  label: "Menu",

  ClientComponent: MenuClient,
  AdminComponent: MenuAdmin,
  PreviewComponent: MenuPreview,

  Schema: z.object({
    left: z.lazy(() => z.array(DBComponentSchema)).default([]),
    center: z.lazy(() => z.array(DBComponentSchema)).default([]),
    right: z.lazy(() => z.array(DBComponentSchema)).default([]),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function MenuClient({ data }: BlockProps<MenuProps>) {
  return <div></div>;
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function MenuPreview() {
  return <div>Menu Preview</div>;
}
