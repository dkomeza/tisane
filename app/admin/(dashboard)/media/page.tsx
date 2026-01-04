"use client";

import { useState, useEffect } from "react";
import { UploadZone } from "@/components/media/UploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getMediaList, deleteMedia } from "@/app/actions/media/media";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt?: string | null;
  mimeType?: string;
  size?: number;
  bucket?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMediaList();
      const mapped = data.items.map((item: any) => ({
        id: item.id,
        name: item.key,
        url: item.url,
        alt: item.alt,
        mimeType: item.mimeType,
        size: item.size,
        bucket: item.bucket,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      setMedia(mapped);
    } catch (err: any) {
      toast.error("Failed to load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?"
    );
    if (!confirmed) return;

    try {
      await deleteMedia(id);
      setMedia((prev) => prev.filter((item) => item.id !== id));
      toast.success("Media deleted!");
    } catch (err: any) {
      toast.error("Failed to delete media.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Media Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone onUploadComplete={fetchMedia} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Media</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-blue-500">Loading media...</p>
          ) : media.length === 0 ? (
            <p className="text-gray-500">No media uploaded yet.</p>
          ) : (
            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item) => (
                  <Card
                    key={item.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={item.alt || item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 flex justify-between items-center">
                      <p className="text-sm truncate">{item.name}</p>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
