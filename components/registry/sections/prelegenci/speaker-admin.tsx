"use client";

import { useEffect, useState } from "react";
import {
  AdminBlockProps,
  Block,
  COMPONENT_REGISTRY,
} from "@/components/registry";
import { DBComponent } from "@/components/registry/types";
import { PrelegenciSpeakerProps } from "./speaker";
import { CmsLink } from "@/components/registry/elements/cms-link";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";
import { getMedia } from "@/app/actions/media/view-action";
import { Media } from "@/lib/prisma";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Trash2, Plus } from "lucide-react";
import { nanoid } from "nanoid";

export function SpeakerAdmin({
  id,
  useStore,
}: AdminBlockProps<PrelegenciSpeakerProps>) {
  const { getBlock, updateBlock, removeBlock } = useStore();
  const block = getBlock(id) as Block<"prelegenci-speaker">;

  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!block?.data.mediaId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMedia(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    getMedia(block.data.mediaId)
      .then((media) => {
        if (isMounted) setSelectedMedia(media);
      })
      .catch((err) => console.error("Failed to fetch media", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [block?.data.mediaId]);

  if (!block) return null;

  const data = block.data;

  const handleSelectMedia = (media: Media) => {
    updateBlock(id, { mediaId: media.id });
    setSelectedMedia(media);
  };

  const handleRemoveMedia = () => {
    updateBlock(id, { mediaId: "" });
    setSelectedMedia(null);
  };

  const linkData = data.link?.data;
  const LinkAdminComponent = COMPONENT_REGISTRY["cms-link"].AdminComponent;

  return (
    <div className="w-full border border-border rounded-lg bg-card text-card-foreground shadow-sm mb-4 relative group">
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <span className="font-medium text-sm">Speaker</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeBlock(id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-3 space-y-4">
        {/* Image Selection */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Photo
          </div>
          {data.mediaId && selectedMedia ? (
            <div className="relative group/img rounded-md overflow-hidden border border-border w-full">
              <div className="aspect-3/4 relative">
                <Image
                  src={selectedMedia.url || ""}
                  alt="Speaker photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <MediaSelector
                  trigger={
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="size-6"
                    >
                      <ImageIcon className="size-3" />
                    </Button>
                  }
                  onSelect={handleSelectMedia}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-6"
                  onClick={handleRemoveMedia}
                >
                  <X className="size-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-border border-dashed rounded-lg p-4 text-center transition-colors w-full bg-muted/20">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-muted rounded-full shadow-sm">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <MediaSelector
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                    >
                      Select Photo
                    </Button>
                  }
                  onSelect={handleSelectMedia}
                />
              </div>
            </div>
          )}
          {loading && (
            <div className="text-[9px] text-muted-foreground animate-pulse font-medium">
              Loading image...
            </div>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Name
          </div>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateBlock(id, { name: e.target.value })}
            className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Description
          </div>
          <textarea
            value={data.description}
            onChange={(e) => updateBlock(id, { description: e.target.value })}
            rows={2}
            className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Link */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Link
          </div>
          {data.link && linkData ? (
            <div className="relative group/link border border-border/40 rounded-lg bg-background p-2">
              <LinkAdminComponent
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                id={(data.link as any).id}
                data={linkData}
                useStore={useStore}
              />
              <button
                type="button"
                onClick={() => updateBlock(id, { link: undefined })}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/link:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() =>
                updateBlock(id, {
                  link: {
                    id: nanoid(),
                    type: "cms-link",
                    data: CmsLink.Schema.parse({ text: "Więcej" }),
                  } as unknown as DBComponent<"cms-link">,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
