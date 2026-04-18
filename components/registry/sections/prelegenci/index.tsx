/**
 * Component: Prelegenci
 */

import {
  BlockProps,
  CMSComponent,
  Block,
  BlockSchema,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import z from "zod";
import { PrelegenciAdmin } from "./PrelegenciAdmin";
import { Users } from "lucide-react";
import { ImageClient } from "@/components/registry/items/image/ImageClient";
import { Typography } from "@/components/registry/typography/typography";
import { Container } from "@/components/registry/layout/container";
import { nanoid } from "nanoid";

export type PrelegenciProps = {
  header?: Block<"typography">;
  speakers?: Block<"prelegenci-speaker">[];
};

export const Prelegenci: CMSComponent<"prelegenci", PrelegenciProps> = {
  id: "prelegenci" as const,
  label: "Prelegenci",

  ClientComponent: PrelegenciClient,
  AdminComponent: PrelegenciAdmin,
  PreviewComponent: PrelegenciPreview,

  Schema: z.object({
    header: z
      .lazy(() => BlockSchema)
      .refine((data) => data.type === "typography", {
        message: "Header must be of type 'typography'",
      })
      .optional() as z.ZodType<Block<"typography"> | undefined>,
    speakers: z.array(z.lazy(() => BlockSchema)).default([]) as z.ZodType<
      Block<"prelegenci-speaker">[] | undefined
    >,
  }),
};

/**
 * This is the client-side component that will be rendered in the application.
 */
function PrelegenciClient({ data }: BlockProps<PrelegenciProps>) {
  const speakers = data.speakers || [];
  const LinkComponent = COMPONENT_REGISTRY["cms-link"].ClientComponent;
  const headerData = data.header?.data;

  return (
    <Container.ClientComponent
      id={nanoid()}
      data={{
        background: null,
        content: null,
        paddingBottom: "minimal",
        paddingTop: "minimal",
        variant: "root",
      }}
    >
      <div className="flex w-full border-b-2 border-brand-purple-300 pb-1 justify-end mb-4">
        <h3 className="text-brand-purple-300 text-2xl">Prelegenci</h3>
      </div>

      {headerData && (
        <div className="mb-8">
          <Typography.ClientComponent
            id="prelegenci-header"
            data={headerData}
          />
        </div>
      )}

      {speakers.length === 0 ? (
        <div className="w-full py-12 text-center text-brand-grey-400 italic">
          No speakers added yet
        </div>
      ) : (
        <div className="flex flex-row gap-8 w-full">
          {speakers.map((speaker, idx) => {
            const speakerData = speaker.data;
            const linkData = speakerData.link?.data;

            return (
              <div key={idx} className="flex flex-col min-w-0 w-64">
                {/* Full-width image */}
                <div className="w-full overflow-hidden mb-4 aspect-3/4 [&>img]:object-cover">
                  {speakerData.mediaId ? (
                    <ImageClient
                      id={`speaker-img-${idx}`}
                      data={{ mediaId: speakerData.mediaId }}
                    />
                  ) : (
                    <div className="w-full aspect-3/4 bg-brand-grey-200 flex items-center justify-center text-brand-grey-400 italic text-sm">
                      No image
                    </div>
                  )}
                </div>
                {/* Right-aligned content */}
                <div className="flex flex-col items-end text-right">
                  <h3 className="text-lg font-bold text-brand-grey-100 mb-1">
                    {speakerData.name}
                  </h3>
                  <p className="text-sm text-brand-grey-400 mb-3">
                    {speakerData.description}
                  </p>
                  {linkData && (
                    <LinkComponent id={`speaker-link-${idx}`} data={linkData} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container.ClientComponent>
  );
}

/**
 * The preview component is used in the editor UI,
 * when displaying all available components.
 */
function PrelegenciPreview() {
  return (
    <div className="p-8 border border-dashed border-zinc-300 rounded-xl flex items-center justify-center bg-brand-grey-100">
      <div className="text-center">
        <div className="bg-brand-purple-100 p-3 rounded-full inline-block mb-3">
          <Users className="text-brand-purple-300" size={24} />
        </div>
        <div className="text-xs font-black text-brand-grey-600 uppercase tracking-widest">
          Prelegenci
        </div>
        <div className="text-[10px] text-brand-grey-400 mt-1 uppercase">
          Speaker Cards
        </div>
      </div>
    </div>
  );
}
