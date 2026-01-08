/**
 * Component: Bordered Container
 */

import {
  BlockProps,
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import z from "zod";
import { BorderedContainerAdmin } from "./BorderedContainerAdmin";
import { Heading } from "@/components/registry/typography/heading";
import { Typography } from "@/components/registry/typography/typography";
import { ButtonComponent } from "@/components/registry/elements/button";
import { cn } from "@/lib/utils";

export type BorderedContainerProps = {
  heading: DBComponent<"heading">;
  typography: DBComponent<"typography">;
  button: DBComponent<"button">;
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
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "heading", {
        message: "Content must be of type 'heading'",
      })
      .default({
        type: "heading",
        data: Heading.Schema.parse({ text: "Heading" }),
      }) as z.ZodType<DBComponent<"heading">>,
    typography: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "typography", {
        message: "Content must be of type 'typography'",
      })
      .default({
        type: "typography",
        data: Typography.Schema.parse({ text: "Example content" }),
      }) as z.ZodType<DBComponent<"typography">>,
    button: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "button", {
        message: "Content must be of type 'button'",
      })
      .default({
        type: "button",
        data: ButtonComponent.Schema.parse({ text: "Click Me" }),
      }) as z.ZodType<DBComponent<"button">>,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function BorderedContainerClient({ data }: BlockProps<BorderedContainerProps>) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 text-white gap-8 relative overflow-hidden group hover:border-[#A27BF6] transition-colors duration-300">
      <div className="space-y-6">
        <div className="text-white">
          <Heading.ClientComponent id="heading" data={data.heading.data} />
        </div>
        <div className="text-gray-300 font-light leading-relaxed">
          <Typography.ClientComponent
            id="typography"
            data={data.typography.data}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <ButtonComponent.ClientComponent id="button" data={data.button.data} />
      </div>
    </div>
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
