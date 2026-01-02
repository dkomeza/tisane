/**
 * This file is a template for generating component registry entries.
 * It provides a consistent structure for defining components, including
 * their client-side rendering, admin interface, preview, and schema validation.
 */

import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
} from "@/components/registry";
import z from "zod";

type ComponentProps = {
  example: string;
};

export const ComponentTemplate: CMSComponent<
  "component-template",
  ComponentProps
> = {
  id: "component-template" as const,
  label: "Component Template",

  ClientComponent: ComponentClientComponent,
  AdminComponent: ComponentAdminComponent,
  PreviewComponent: ComponentPreviewComponent,

  Schema: z.object({
    example: z.string().min(1).max(100).default("Example content"),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ComponentClientComponent({ data }: BlockProps<ComponentProps>) {
  return <div>{data.example}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ComponentAdminComponent({
  id,
  useStore,
}: AdminBlockProps<ComponentProps>) {
  const { blocks, updateBlock } = useStore();

  // @ts-expect-error This component is a template
  const block = blocks.find((b) => b.id === id) as Block<"component-template">;

  if (!block) return null;

  return (
    <textarea
      // @ts-expect-error This component is a template
      value={block.data.example}
      // @ts-expect-error This component is a template
      onChange={(e) => updateBlock(id, { example: e.target.value })}
    ></textarea>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ComponentPreviewComponent() {
  return <div>Component Preview</div>;
}
