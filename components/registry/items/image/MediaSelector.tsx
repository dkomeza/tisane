"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/media/UploadZone";
import { getMediaList } from "@/app/actions/media/media";
import {
  getFolderTree,
  getFolderBreadcrumb,
} from "@/app/actions/media/folders";
import Image from "next/image";
import {
  Loader2,
  FileText,
  FolderOpen,
  Home,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FolderItem = {
  id: string;
  name: string;
  parentId: string | null;
  _count: { media: number; children: number };
};

type BreadcrumbItem = { id: string; name: string };

import { Media } from "@/lib/prisma";

interface MediaSelectorProps {
  onSelect: (media: Media) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MediaSelector({
  onSelect,
  trigger,
  open,
  onOpenChange,
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [images, setImages] = useState<Media[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [allFolders, setAllFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const pageSize = 12;

  const isControlled = open !== undefined;
  const show = isControlled ? open : isOpen;
  const setShow = (val: boolean) => {
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setIsOpen(val);
    }
  };

  const fetchData = async (p: number, folderId: string | null) => {
    setLoading(true);
    try {
      const [mediaResult, folderResult] = await Promise.all([
        getMediaList({ page: p, pageSize, folderId }),
        getFolderTree(),
      ]);

      setImages(mediaResult.items);
      setTotalPages(mediaResult.totalPages);
      setPage(mediaResult.page);

      const allFolderData = (folderResult.data || []) as FolderItem[];
      setAllFolders(allFolderData);
      setFolders(allFolderData.filter((f) => f.parentId === folderId));

      if (folderId) {
        const bcRes = await getFolderBreadcrumb(folderId);
        setBreadcrumb(bcRes.data || []);
      } else {
        setBreadcrumb([]);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && activeTab === "library") {
      fetchData(page, currentFolderId);
    }
  }, [show, activeTab, page, currentFolderId]);

  const handleUploadComplete = () => {
    setActiveTab("library");
    setPage(1);
    fetchData(1, currentFolderId);
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setPage(1);
  };

  const getDisplayName = (item: Media) => {
    return item.name || item.key.split("-").slice(1).join("-") || item.key;
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <div className="text-center p-6">
          <DialogTitle>Media Library</DialogTitle>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col w-full"
        >
          <div className="border-b">
            <TabsList className="bg-transparent h-12 p-0 w-full justify-start text-gray-500 rounded-none border-b border-transparent">
              <TabsTrigger
                value="library"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary pb-3 pt-3 px-1 data-[state=active]:bg-transparent shadow-none"
              >
                Media Library
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary pb-3 pt-3 px-1 data-[state=active]:bg-transparent shadow-none"
              >
                Upload New
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="library"
            className="flex-1 overflow-hidden flex flex-col p-0 m-0 data-[state=inactive]:hidden"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 px-6 py-3 border-b bg-gray-50/50 text-sm">
              {currentFolderId && (
                <button
                  onClick={() => {
                    const parent = allFolders.find(
                      (f) => f.id === currentFolderId,
                    );
                    navigateToFolder(parent?.parentId || null);
                  }}
                  className="text-gray-400 hover:text-gray-700 mr-2 p-1 rounded hover:bg-gray-200/50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => navigateToFolder(null)}
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                  currentFolderId === null
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900",
                )}
              >
                <Home className="w-3.5 h-3.5" />
                <span>All</span>
              </button>
              {breadcrumb.map((item, i) => (
                <div key={item.id} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <button
                    onClick={() => navigateToFolder(item.id)}
                    className={cn(
                      "px-1.5 py-0.5 rounded transition-colors",
                      i === breadcrumb.length - 1
                        ? "text-gray-900 font-medium"
                        : "text-gray-500 hover:text-gray-900",
                    )}
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading && images.length === 0 && folders.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Folders first */}
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex flex-col gap-2 group cursor-pointer"
                        onClick={() => navigateToFolder(folder.id)}
                      >
                        <div className="relative aspect-square border rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-gray-50 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <FolderOpen className="w-12 h-12 text-amber-500 transition-transform group-hover:scale-110" />
                            <span className="text-[10px] text-gray-400">
                              {folder._count.media} files
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate text-center px-1">
                          {folder.name}
                        </p>
                      </div>
                    ))}

                    {/* Media items */}
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="flex flex-col gap-2 group cursor-pointer"
                        onClick={() => {
                          onSelect(img);
                          setShow(false);
                        }}
                      >
                        <div className="relative aspect-square border rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all bg-gray-50 flex items-center justify-center">
                          {img.mimeType?.startsWith("image/") ? (
                            <Image
                              src={img.url}
                              alt={img.alt || img.key}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <FileText className="w-10 h-10" />
                              <span className="text-[10px] font-bold uppercase">
                                {img.mimeType?.split("/")[1] || "DOC"}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="shadow-md"
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                        <p
                          className="text-[10px] text-gray-500 truncate text-center px-1"
                          title={img.key}
                        >
                          {getDisplayName(img)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {images.length === 0 && folders.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                      <p>
                        {currentFolderId
                          ? "This folder is empty"
                          : "No media found"}
                      </p>
                      <Button
                        variant="link"
                        onClick={() => setActiveTab("upload")}
                      >
                        Upload one now
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="upload"
            className="flex-1 overflow-y-auto p-6 m-0 data-[state=inactive]:hidden"
          >
            <UploadZone
              onUploadComplete={handleUploadComplete}
              folderId={currentFolderId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
