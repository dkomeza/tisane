/**
 * Component: Bordered Container
 */

import {
  BlockProps,
  CMSComponent,
  Block,
  BlockSchema,
  createBlock,
} from "@/components/registry";
import z from "zod";
import { BorderedContainerAdmin } from "./BorderedContainerAdmin";
import { Heading } from "@/components/registry/typography/heading";
import { Typography } from "@/components/registry/typography/typography";
import { ButtonComponent } from "@/components/registry/elements/button";

export type BorderedContainerProps = {
  heading: Block<"heading">;
  typography: Block<"typography">;
  button: Block<"button">;
};

export const BorderedContainer: CMSComponent<
  "bordered-container",
  BorderedContainerProps
> = {
  id: "bordered-container" as const,
  label: "Bordered Container",

  ClientComponent: BorderedContainerClient,
  AdminComponent: BorderedContainerAdmin,
  PreviewComponent: BorderedContainerPreview,

  Schema: z.object({
    heading: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "heading", {
        message: "Content must be of type 'heading'",
      })
      .default(createBlock("heading")) as z.ZodType<Block<"heading">>,
    typography: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "typography", {
        message: "Content must be of type 'typography'",
      })
      .default(createBlock("typography")) as z.ZodType<Block<"typography">>,
    button: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "button", {
        message: "Content must be of type 'button'",
      })
      .default(createBlock("button")) as z.ZodType<Block<"button">>,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function BorderedContainerClient({ data }: BlockProps<BorderedContainerProps>) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="pr-8 border-b border-brand-purple-400 pb-2 text-nowrap">
            <Heading.ClientComponent id="heading" data={data.heading.data} />
          </th>
          <th className="border-b border-brand-purple-400 pb-2 hidden md:table-cell"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="hidden md:table-cell"></td>
          <td className="pt-8">
            <div className="flex flex-col gap-6 md:gap-8">
              <Typography.ClientComponent
                id="typography"
                data={data.typography.data}
              />
              <div className="self-end">
                <ButtonComponent.ClientComponent
                  id="button"
                  data={data.button.data}
                />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function BorderedContainerPreview() {
  return (
    <div className="p-4 border border-brand-purple-300 bg-black/50 text-white rounded">
      <div className="h-4 w-1/3 bg-brand-purple-300/50 mb-2 rounded" />
      <div className="h-10 w-full bg-gray-800/50 mb-4 rounded" />
      <div className="h-8 w-24 bg-brand-purple-300 rounded ml-auto" />
    </div>
  );
}
