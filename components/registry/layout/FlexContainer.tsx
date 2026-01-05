import {
  AdminBlockProps,
  Block,
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import { cn } from "@/lib/utils";
import z from "zod";

type ComponentProps = {
  direction: "row" | "column";
  children?: DBComponent[];
};

export const FlexContainer: CMSComponent<"flex-container", ComponentProps> = {
  id: "flex-container" as const,
  label: "Flex Container",

  ClientComponent: ComponentClientComponent,
  AdminComponent: ComponentAdminComponent,
  PreviewComponent: ComponentPreviewComponent,

  Schema: z.object({
    direction: z.enum(["row", "column"]).default("row"),
    children: z
      .array(z.lazy(() => DBComponentSchema))
      .optional()
      .default([]),
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function ComponentClientComponent({ data }: BlockProps<ComponentProps>) {
  return <div>{data.children?.length}</div>;
}

/**
 * This is the admin component used to edit the component's data in the CMS.
 */
function ComponentAdminComponent({
  id,
  useStore,
}: AdminBlockProps<ComponentProps>) {
  const { blocks, updateBlock } = useStore();

  const block = blocks.find((b) => b.id === id) as Block<"flex-container">;

  if (!block) return null;

  return (
    <div
      className={cn(
        "flex border border-dashed border-border p-4 rounded-md",
        `flex-${block.data.direction}`
      )}
    ></div>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function ComponentPreviewComponent() {
  return <div>Flex</div>;
}
