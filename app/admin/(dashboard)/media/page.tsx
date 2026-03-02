"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { UploadZone } from "@/components/media/UploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getMediaList, deleteMedia } from "@/app/actions/media/media";
import { getFileUrl } from "@/app/actions/media/view-action";
import {
  Trash2,
  Copy,
  Loader2,
  FileText,
  Search,
  Grid,
  Filter,
  Image as ImageIcon,
  File,
  ExternalLink,
  RefreshCw as RefreshCwIcon,
} from "lucide-react";
import { Media } from "@/lib/prisma";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "images" | "documents">("all");

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMediaList({ page: 1, pageSize: 100 });
      const safeItems = (response.items as any[]).map((item) => ({
        ...item,
        id: item.id || item._id,
      })) as Media[];
      setMedia(safeItems);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load media list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      const matchesSearch = item.key
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isImage = item.mimeType?.startsWith("image/");
      const matchesFilter =
        filter === "all" ||
        (filter === "images" && isImage) ||
        (filter === "documents" && !isImage);
      return matchesSearch && matchesFilter;
    });
  }, [media, searchQuery, filter]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    setIsDeleting(id);
    try {
      const result = await deleteMedia(id);
      if (result.success) {
        setMedia((prev) => prev.filter((item) => item.id !== id));
        toast.success("Media deleted successfully");
      } else {
        toast.error("Failed to delete media: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = async (key: string) => {
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
    return parts.length > 1 ? parts.slice(1).join("-") : key;
  };

  return (
    <div className="min-h-screen bg-[#09090B] p-4 lg:p-8 text-zinc-100">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Media</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search assets..."
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-brand-purple-200 focus:border-brand-purple-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-zinc-800 shadow-2xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="dark">
                  <UploadZone onUploadComplete={fetchMedia} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 shadow-xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  icon={<Grid className="w-4 h-4" />}
                  label="All Assets"
                  count={media.length}
                />
                <FilterButton
                  active={filter === "images"}
                  onClick={() => setFilter("images")}
                  icon={<ImageIcon className="w-4 h-4" />}
                  label="Images"
                  count={media.filter(m => m.mimeType?.startsWith("image/")).length}
                />
                <FilterButton
                  active={filter === "documents"}
                  onClick={() => setFilter("documents")}
                  icon={<FileText className="w-4 h-4" />}
                  label="Documents"
                  count={media.filter(m => !m.mimeType?.startsWith("image/")).length}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Grid Section */}
          <div className="lg:col-span-3">
            <Card className="border-zinc-800 shadow-2xl bg-zinc-900/50 backdrop-blur-xl min-h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 py-4 px-6">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-brand-purple-200 rounded-full animate-pulse shadow-[0_0_10px_rgba(144,97,245,0.5)]" />
                  <span className="text-sm font-medium text-zinc-400">
                    {loading ? "Refreshing..." : `${filteredMedia.length} results found`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-8 hover:bg-white/5" onClick={fetchMedia} disabled={loading}>
                    <RefreshCwIcon className={cn("w-4 h-4 text-zinc-500", loading && "animate-spin")} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[700px]">
                  {filteredMedia.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-600 px-6">
                      <div className="p-4 bg-zinc-800/50 rounded-full mb-4 border border-zinc-700/50">
                        <File className="w-12 h-12 text-zinc-700" />
                      </div>
                      <p className="text-lg font-medium text-zinc-400">No assets found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
                      {filteredMedia.map((item) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          onCopy={() => copyToClipboard(item.key)}
                          onDelete={() => handleDelete(item.id)}
                          isDeleting={isDeleting === item.id}
                          displayTitle={formatFileName(item.key)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, icon, label, count }: {
  active: boolean,
  onClick: () => void,
  icon: React.ReactNode,
  label: string,
  count: number
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm font-medium",
        active
          ? "bg-brand-purple-300 text-white shadow-lg shadow-brand-purple-300/20 translate-x-1"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <span className={cn(
        "text-[10px] px-1.5 py-0.5 rounded-md",
        active ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500"
      )}>{count}</span>
    </button>
  );
}

function MediaCard({ item, onCopy, onDelete, isDeleting, displayTitle }: {
  item: Media,
  onCopy: () => void,
  onDelete: () => void,
  isDeleting: boolean,
  displayTitle: string
}) {
  const isImage = item.mimeType?.startsWith("image/");

  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-purple-300/20 group-hover:-translate-y-1">
        {isImage ? (
          <Image
            src={item.url || ""}
            alt={item.key}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 gap-3">
            <div className="p-4 bg-brand-purple-300/10 rounded-2xl border border-brand-purple-300/20">
              <FileText className="w-10 h-10 text-brand-purple-300" />
            </div>
            <span className="text-[10px] font-black uppercase text-brand-purple-200 tracking-widest bg-brand-purple-300/5 px-2 py-0.5 rounded">
              {item.mimeType?.split("/")[1] || "DOC"}
            </span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-brand-purple-400/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-md translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="size-9 bg-white text-brand-purple-300 hover:bg-brand-purple-50 rounded-full" onClick={() => window.open(item.url || "", "_blank")}>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="size-9 bg-white text-brand-purple-300 hover:bg-brand-purple-50 rounded-full" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="size-9 bg-red-500 text-white hover:bg-red-600 rounded-full" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-1">
        <p className="text-xs font-bold text-zinc-100 line-clamp-1 mb-0.5 capitalize" title={displayTitle}>
          {displayTitle}
        </p>
        <p className="text-[10px] font-medium text-zinc-500 flex items-center justify-between">
          <span>{isImage ? "Image" : "Document"}</span>
          <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
        </p>
      </div>
    </div>
  );
}
