"use client";

import { AdminBlockProps } from "@/components/registry";
import { ImageProps } from ".";
import { useEffect, useState } from "react";
import { MediaSelector } from "./MediaSelector";

import { Button } from "@/components/ui/button";
import { getMedia } from "@/app/actions/media/view-action";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ImageAdmin({
  id,
  data,
  useStore,
}: AdminBlockProps<ImageProps>) {
  const { updateBlock } = useStore();
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.mediaId) {
      setLoading(true);
      getMedia(data.mediaId)
        .then((media) => {
          setSelectedMedia(media);
        })
        .catch((err) => {
          console.error("Failed to fetch media", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSelectedMedia(null);
    }
  }, [data.mediaId]);

  const handleSelect = (media: any) => {
    updateBlock<"imageComponent">(id, { mediaId: media.id });
    setSelectedMedia(media);
  };

  const handleRemove = () => {
    updateBlock<"imageComponent">(id, { mediaId: "" });
    setSelectedMedia(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Image</Label>
      </div>

      {data.mediaId && selectedMedia ? (
        <div className="relative group rounded-md overflow-hidden border">
          <div className="aspect-video relative">
            <Image
              src={selectedMedia.url || ""}
              alt="Selected image"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <MediaSelector
              trigger={
                <Button size="sm" variant="secondary">
                  Change
                </Button>
              }
              onSelect={handleSelect}
            />
            <Button size="sm" variant="destructive" onClick={handleRemove}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-20 text-center transition-colors">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-sm text-gray-300 mb-2">No image selected</div>
            <MediaSelector
              trigger={
                <Button
                  variant="default"
                  className="text-black hover:text-gray-600"
                >
                  Select from Gallery
                </Button>
              }
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Loading image details...
        </div>
      )}
    </div>
  );
}
