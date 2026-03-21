import {
  CMSComponent,
  DBComponent,
  DBComponentSchema,
} from "@/components/registry";
import z from "zod";
import { CmsLink } from "@/components/registry/elements/cms-link";
import { SpeakerAdmin } from "./speaker-admin";

export type PrelegenciSpeakerProps = {
  mediaId: string;
  name: string;
  description: string;
  link?: DBComponent<"cms-link">;
};

export const PrelegenciSpeakerComponent: CMSComponent<
  "prelegenci-speaker",
  PrelegenciSpeakerProps
> = {
  id: "prelegenci-speaker",
  label: "Speaker",

  ClientComponent: () => null,
  AdminComponent: SpeakerAdmin,
  PreviewComponent: () => null,

  Schema: z.object({
    mediaId: z.string().default(""),
    name: z.string().default("Jan Kowalski"),
    description: z.string().default("Specjalista ds. AI"),
    link: z
      .lazy(() => DBComponentSchema)
      .refine((data) => data.type === "cms-link", {
        message: "Link must be of type 'cms-link'",
      })
      .default({
        type: "cms-link",
        data: CmsLink.Schema.parse({ text: "Więcej" }),
      })
      .optional() as z.ZodType<DBComponent<"cms-link"> | undefined>,
  }),
};
