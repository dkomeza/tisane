"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadZone } from "@/components/media/UploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMediaList, deleteMedia } from "@/app/actions/media/media";
import { getFileUrl } from "@/app/actions/media/view-action";
import { Trash2, Copy, RefreshCw, Loader2, FileImage } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string | Date;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMediaList({ page: 1, pageSize: 50 });

      const safeItems = (response.items as any[]).map((item) => ({
        ...item,
        id: item.id || item._id,
      })) as MediaItem[];

      setMedia(safeItems);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load media list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) {
      toast.error("Error: Cannot delete, missing Image ID");
      console.error("Attempted to delete item with null ID");
      return;
    }

    setIsDeleting(id);
    try {
      const result = await deleteMedia(id);
      if (result.success) {
        setMedia((prev) => prev.filter((item) => item.id !== id));
        toast.success("Image deleted successfully");
      } else {
        toast.error(
          "Failed to delete image: " + (result.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = async (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await getFileUrl(key);

      if (result.success && result.url) {
        await navigator.clipboard.writeText(result.url);
        toast.success("Fresh URL copied to clipboard");
      } else {
        throw new Error("Could not generate URL");
      }
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const formatFileName = (key: string) => {
    const parts = key.split("-");
    if (parts.length > 1) {
      return parts.slice(1).join("-");
    }
    return key;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Media Management</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMedia}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone onUploadComplete={fetchMedia} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Library ({media.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && media.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              No media files found. Upload some above!
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {item.url ? (
                        <Image
                          src={item.url}
                          alt={item.key}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <FileImage className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p
                        className="text-xs font-medium truncate mb-2 text-gray-700"
                        title={item.key}
                      >
                        {formatFileName(item.key)}
                      </p>

                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={(e) => copyToClipboard(e, item.key)}
                          title="Copy Fresh URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => handleDelete(e, item.id)}
                          disabled={isDeleting === item.id}
                          title="Delete Image"
                        >
                          {isDeleting === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
