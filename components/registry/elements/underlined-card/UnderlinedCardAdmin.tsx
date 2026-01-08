"use client";

import { AdminBlockProps } from "@/components/registry";
import { UnderlinedCardProps } from "./index";
import { useEffect, useState } from "react";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";
import { Button } from "@/components/ui/button";
import { getMedia } from "@/app/actions/media/view-action";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Media } from "@/lib/prisma";

export function UnderlinedCardAdmin({
  id,
  data,
  useStore,
}: AdminBlockProps<UnderlinedCardProps>) {
  const { updateBlock } = useStore();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
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

  const handleSelectMedia = (media: Media) => {
    updateBlock(id, { mediaId: media.id });
    setSelectedMedia(media);
  };

  const handleRemoveMedia = () => {
    updateBlock(id, { mediaId: "" });
    setSelectedMedia(null);
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="space-y-6 p-0 w-full">
        {/* Image Selection */}
        <div className="space-y-4">
          <Label>Card Image</Label>
          {data.mediaId && selectedMedia ? (
            <div className="relative group rounded-md overflow-hidden border w-full">
              <div className="aspect-video relative">
                <Image
                  src={selectedMedia.url || ""}
                  alt="Selected image"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MediaSelector
                  trigger={
                    <Button size="sm" variant="secondary">
                      Change
                    </Button>
                  }
                  onSelect={handleSelectMedia}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveMedia}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 text-cente transition-colors w-full">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  No image selected
                </div>
                <MediaSelector
                  trigger={<Button variant="outline">Select Image</Button>}
                  onSelect={handleSelectMedia}
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

        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor={`text-${id}`}>Card Text</Label>
          <Input
            id={`text-${id}`}
            type="text"
            value={data.text || ""}
            onChange={(e) => updateBlock(id, { text: e.target.value })}
            placeholder="Enter card text"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor={`description-${id}`}>Description</Label>
          <Input
            id={`description-${id}`}
            type="text"
            value={data.description || ""}
            onChange={(e) => updateBlock(id, { description: e.target.value })}
            placeholder="Enter description"
          />
        </div>

        {/* Width Input */}
        <div className="space-y-2">
          <Label htmlFor={`width-${id}`}>Width</Label>
          <Input
            id={`width-${id}`}
            type="number"
            min={1}
            value={data.width ?? ""}
            onChange={(e) =>
              updateBlock(id, {
                width: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Enter width"
          />
        </div>

        {/* Height Input */}
        <div className="space-y-2">
          <Label htmlFor={`height-${id}`}>Height</Label>
          <Input
            id={`height-${id}`}
            type="number"
            min={1}
            value={data.height ?? ""}
            onChange={(e) =>
              updateBlock(id, {
                height: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Enter height"
          />
        </div>

        {/* Underline Color Selection */}
        <div className="space-y-2">
          <Label htmlFor={`color-${id}`}>Underline Color</Label>
          <div className="flex items-center gap-4">
            <Input
              id={`color-${id}`}
              type="color"
              value={data.underlineColor || "#372773"}
              onChange={(e) =>
                updateBlock(id, { underlineColor: e.target.value })
              }
              className="w-12 h-12 p-1 rounded-md cursor-pointer"
            />
            <Input
              type="text"
              value={data.underlineColor || ""}
              onChange={(e) =>
                updateBlock(id, { underlineColor: e.target.value })
              }
              placeholder="#D2CFCB"
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
