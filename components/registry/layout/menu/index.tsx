/**
 * Component: Menu
 */

import {
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import z from "zod";
import { MenuAdmin } from "./AdminComponent";

import { MenuClient } from "./ClientComponent";

export type MenuProps = {
  left: DBComponent[];
  center: DBComponent[];
  right: DBComponent[];

  m_top: DBComponent[];
  m_center: DBComponent[];
  m_bottom: DBComponent[];
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

    m_top: z.lazy(() => z.array(DBComponentSchema)).default([]),
    m_center: z.lazy(() => z.array(DBComponentSchema)).default([]),
    m_bottom: z.lazy(() => z.array(DBComponentSchema)).default([]),
  }),
};

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function MenuPreview() {
  return <div>Menu Preview</div>;
}
