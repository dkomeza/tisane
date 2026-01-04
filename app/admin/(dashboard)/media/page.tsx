"use client";

import { UploadZone } from "@/components/media/UploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getMediaList } from "@/app/actions/media/media";

interface MediaItem {
  id: string;
  key: string;
  url: string;
  mimeType: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  const refreshMedia = async () => {
    setLoadingMedia(true);
    try {
      const response = await getMediaList({ page: 1, pageSize: 50 });

      setMedia(response.items as MediaItem[]);
    } catch (err: any) {
      console.error(err);
      toast.error("Nie udało się pobrać listy plików.");
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    refreshMedia();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Biblioteka Mediów</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dodaj nowe media</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone onUploadComplete={refreshMedia} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twoje pliki</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMedia ? (
            <div className="flex justify-center py-8">
              <p className="text-blue-500 animate-pulse">Ładowanie...</p>
            </div>
          ) : media.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Brak plików.</p>
          ) : (
            <ScrollArea className="h-96 pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="group border rounded-lg p-2 hover:shadow-md transition-all bg-white"
                  >
                    <div className="relative aspect-square mb-2 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={item.url}
                        alt={item.key}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p
                      className="text-xs text-gray-500 truncate"
                      title={item.key}
                    >
                      {item.key.split("-").slice(1).join("-")}
                    </p>
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
