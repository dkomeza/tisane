/**
 * Component: Menu
 */

import { CMSComponent, Block, BlockSchema } from "@/components/registry";
import z from "zod";
import { MenuAdmin } from "./AdminComponent";

import { MenuClient } from "./ClientComponent";

export type MenuProps = {
  left: Block[];
  center: Block[];
  right: Block[];

  m_top: Block[];
  m_center: Block[];
  m_bottom: Block[];
};

export const Menu: CMSComponent<"menu", MenuProps> = {
  id: "menu" as const,
  label: "Menu",

  ClientComponent: MenuClient,
  AdminComponent: MenuAdmin,
  PreviewComponent: MenuPreview,

  Schema: z.object({
    left: z.lazy(() => z.array(BlockSchema)).default([]),
    center: z.lazy(() => z.array(BlockSchema)).default([]),
    right: z.lazy(() => z.array(BlockSchema)).default([]),

    m_top: z.lazy(() => z.array(BlockSchema)).default([]),
    m_center: z.lazy(() => z.array(BlockSchema)).default([]),
    m_bottom: z.lazy(() => z.array(BlockSchema)).default([]),
  }),
};

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function MenuPreview() {
  return <div>Menu Preview</div>;
}
