import { CMSComponent, Block, BlockSchema } from "@/components/registry";
import z from "zod";
import { SpeakerAdmin } from "./speaker-admin";
import { nanoid } from "nanoid";
import { CmsLink } from "@/components/registry/elements/cms-link";

export type PrelegenciSpeakerProps = {
  mediaId: string;
  name: string;
  description: string;
  link?: Block<"cms-link">;
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
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "cms-link", {
        message: "Link must be of type 'cms-link'",
      })
      .default({
        id: nanoid(),
        type: "cms-link",
        data: CmsLink.Schema.parse({}),
      })
      .optional() as z.ZodType<Block<"cms-link"> | undefined>,
  }),
};
