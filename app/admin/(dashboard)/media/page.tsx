"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { UploadZone } from "@/components/media/UploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  getMediaList,
  deleteMedia,
  renameMedia,
  moveMedia,
} from "@/app/actions/media/media";
import { getFileUrl } from "@/app/actions/media/view-action";
import {
  createFolder,
  renameFolder,
  deleteFolder,
  moveFolder,
  getFolderTree,
  getFolderBreadcrumb,
} from "@/app/actions/media/folders";
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
  FolderPlus,
  Folder,
  FolderOpen,
  ChevronRight,
  Home,
  MoreVertical,
  Pencil,
  FolderInput,
  ArrowLeft,
} from "lucide-react";
import { Media } from "@/lib/prisma";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FolderWithCounts = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { media: number; children: number };
};

type BreadcrumbItem = { id: string; name: string };

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [folders, setFolders] = useState<FolderWithCounts[]>([]);
  const [allFolders, setAllFolders] = useState<FolderWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "images" | "documents">("all");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);

  // Dialog states
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingItem, setRenamingItem] = useState<{
    id: string;
    name: string;
    type: "folder" | "media";
  } | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [movingItem, setMovingItem] = useState<{
    id: string;
    name: string;
    type: "folder" | "media";
  } | null>(null);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState<string | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
    type: "folder" | "media";
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [mediaRes, folderRes] = await Promise.all([
        getMediaList({
          page: 1,
          pageSize: 100,
          folderId: currentFolderId,
        }),
        getFolderTree(),
      ]);

      const safeItems = mediaRes.items as Media[];
      setMedia(safeItems);

      const allFolderData = (folderRes.data || []) as FolderWithCounts[];
      setAllFolders(allFolderData);

      // Filter to show only folders in the current directory
      const currentFolders = allFolderData.filter(
        (f) => f.parentId === currentFolderId,
      );
      setFolders(currentFolders);

      // Fetch breadcrumb
      if (currentFolderId) {
        const bcRes = await getFolderBreadcrumb(currentFolderId);
        setBreadcrumb(bcRes.data || []);
      } else {
        setBreadcrumb([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load media.");
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      const displayName = item.name || item.key;
      const matchesSearch = displayName
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

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [folders, searchQuery]);

  // Navigation
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchQuery("");
    setFilter("all");
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const result = await createFolder(newFolderName.trim(), currentFolderId);
    if (result.success) {
      toast.success(`Folder "${newFolderName}" created`);
      setNewFolderName("");
      setNewFolderDialogOpen(false);
      fetchData();
    } else {
      toast.error(result.error || "Failed to create folder");
    }
  };

  // Rename
  const handleRename = async () => {
    if (!renamingItem || !renamingItem.name.trim()) return;
    const result =
      renamingItem.type === "folder"
        ? await renameFolder(renamingItem.id, renamingItem.name.trim())
        : await renameMedia(renamingItem.id, renamingItem.name.trim());

    if (result.success) {
      toast.success("Renamed successfully");
      setRenamingItem(null);
      fetchData();
    } else {
      toast.error(
        "error" in result ? result.error || "Rename failed" : "Rename failed",
      );
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(deleteConfirm.id);

    const result =
      deleteConfirm.type === "folder"
        ? await deleteFolder(deleteConfirm.id)
        : await deleteMedia(deleteConfirm.id);

    if (result.success) {
      toast.success(
        `${deleteConfirm.type === "folder" ? "Folder" : "File"} deleted`,
      );
      fetchData();
    } else {
      toast.error(
        "error" in result ? result.error || "Delete failed" : "Delete failed",
      );
    }
    setIsDeleting(null);
    setDeleteConfirm(null);
  };

  // Move
  const handleMove = async () => {
    if (!movingItem) return;
    const result =
      movingItem.type === "folder"
        ? await moveFolder(movingItem.id, moveTargetFolderId)
        : await moveMedia(movingItem.id, moveTargetFolderId);

    if (result.success) {
      toast.success("Moved successfully");
      setMoveDialogOpen(false);
      setMovingItem(null);
      fetchData();
    } else {
      toast.error(
        "error" in result ? result.error || "Move failed" : "Move failed",
      );
    }
  };

  const copyToClipboard = async (key: string) => {
    try {
      const result = await getFileUrl(key);
      if (result.success && result.url) {
        await navigator.clipboard.writeText(result.url);
        toast.success("URL copied to clipboard");
      } else {
        throw new Error("Could not generate URL");
      }
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const getDisplayName = (item: Media) => {
    return item.name || item.key.replace(/^\d+-/, "") || item.key;
  };

  return (
    <div className="text-zinc-100 min-h-full">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Media
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setNewFolderDialogOpen(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
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

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm flex-wrap">
          <button
            onClick={() => navigateToFolder(null)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
              currentFolderId === null
                ? "text-white bg-zinc-800"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
            )}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Media</span>
          </button>
          {breadcrumb.map((item, i) => (
            <div key={item.id} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <button
                onClick={() => navigateToFolder(item.id)}
                className={cn(
                  "px-2 py-1 rounded-md transition-colors",
                  i === breadcrumb.length - 1
                    ? "text-white bg-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                )}
              >
                {item.name}
              </button>
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-zinc-800 shadow-2xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="dark">
                  <UploadZone
                    onUploadComplete={fetchData}
                    folderId={currentFolderId}
                  />
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
                  count={media.length + folders.length}
                />
                <FilterButton
                  active={filter === "images"}
                  onClick={() => setFilter("images")}
                  icon={<ImageIcon className="w-4 h-4" />}
                  label="Images"
                  count={
                    media.filter((m) => m.mimeType?.startsWith("image/")).length
                  }
                />
                <FilterButton
                  active={filter === "documents"}
                  onClick={() => setFilter("documents")}
                  icon={<FileText className="w-4 h-4" />}
                  label="Documents"
                  count={
                    media.filter((m) => !m.mimeType?.startsWith("image/"))
                      .length
                  }
                />
              </CardContent>
            </Card>

            {/* Folder Tree in Sidebar */}
            {allFolders.length > 0 && (
              <Card className="border-zinc-800 shadow-xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Folders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <button
                    onClick={() => navigateToFolder(null)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      currentFolderId === null
                        ? "bg-brand-purple-300 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Home className="w-4 h-4" />
                    Root
                  </button>
                  <FolderTreeView
                    folders={allFolders}
                    parentId={null}
                    level={0}
                    currentFolderId={currentFolderId}
                    onNavigate={navigateToFolder}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Grid Section */}
          <div className="lg:col-span-3">
            <Card className="border-zinc-800 shadow-2xl bg-zinc-900/50 backdrop-blur-xl min-h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 py-4 px-6">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-brand-purple-200 rounded-full animate-pulse shadow-[0_0_10px_rgba(144,97,245,0.5)]" />
                  <span className="text-sm font-medium text-zinc-400">
                    {loading
                      ? "Refreshing..."
                      : `${filteredFolders.length + filteredMedia.length} items`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {currentFolderId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white hover:bg-white/5"
                      onClick={() => {
                        const parent = allFolders.find(
                          (f) => f.id === currentFolderId,
                        );
                        navigateToFolder(parent?.parentId || null);
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-white/5"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    <RefreshCwIcon
                      className={cn(
                        "w-4 h-4 text-zinc-500",
                        loading && "animate-spin",
                      )}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[700px]">
                  {filteredFolders.length === 0 &&
                  filteredMedia.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-600 px-6">
                      <div className="p-4 bg-zinc-800/50 rounded-full mb-4 border border-zinc-700/50">
                        <File className="w-12 h-12 text-zinc-700" />
                      </div>
                      <p className="text-lg font-medium text-zinc-400">
                        {currentFolderId
                          ? "This folder is empty"
                          : "No assets found"}
                      </p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search query."
                          : "Upload files or create a folder to get started."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
                      {/* Folders first */}
                      {filteredFolders.map((folder) => (
                        <FolderCard
                          key={folder.id}
                          folder={folder}
                          onOpen={() => navigateToFolder(folder.id)}
                          onRename={() =>
                            setRenamingItem({
                              id: folder.id,
                              name: folder.name,
                              type: "folder",
                            })
                          }
                          onMove={() => {
                            setMovingItem({
                              id: folder.id,
                              name: folder.name,
                              type: "folder",
                            });
                            setMoveTargetFolderId(folder.parentId);
                            setMoveDialogOpen(true);
                          }}
                          onDelete={() =>
                            setDeleteConfirm({
                              id: folder.id,
                              name: folder.name,
                              type: "folder",
                            })
                          }
                        />
                      ))}
                      {/* Then media */}
                      {filteredMedia.map((item) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          displayTitle={getDisplayName(item)}
                          onCopy={() => copyToClipboard(item.key)}
                          onRename={() =>
                            setRenamingItem({
                              id: item.id,
                              name: getDisplayName(item),
                              type: "media",
                            })
                          }
                          onMove={() => {
                            setMovingItem({
                              id: item.id,
                              name: getDisplayName(item),
                              type: "media",
                            });
                            setMoveTargetFolderId(item.folderId || null);
                            setMoveDialogOpen(true);
                          }}
                          onDelete={() =>
                            setDeleteConfirm({
                              id: item.id,
                              name: getDisplayName(item),
                              type: "media",
                            })
                          }
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

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            className="bg-zinc-800 border-zinc-700 text-white"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewFolderDialogOpen(false)}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renamingItem !== null}
        onOpenChange={(open) => !open && setRenamingItem(null)}
      >
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              Rename {renamingItem?.type === "folder" ? "Folder" : "File"}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="New name"
            value={renamingItem?.name || ""}
            onChange={(e) =>
              setRenamingItem((prev) =>
                prev ? { ...prev, name: e.target.value } : null,
              )
            }
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="bg-zinc-800 border-zinc-700 text-white"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenamingItem(null)}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renamingItem?.name.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Move &ldquo;{movingItem?.name}&rdquo;</DialogTitle>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto space-y-1">
            <button
              onClick={() => setMoveTargetFolderId(null)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                moveTargetFolderId === null
                  ? "bg-brand-purple-300 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Home className="w-4 h-4" />
              Root
            </button>
            {allFolders
              .filter((f) => f.id !== movingItem?.id)
              .map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setMoveTargetFolderId(folder.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    moveTargetFolderId === folder.id
                      ? "bg-brand-purple-300 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                    folder.parentId && "ml-4",
                  )}
                >
                  <Folder className="w-4 h-4" />
                  {folder.name}
                </button>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMoveDialogOpen(false)}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button onClick={handleMove}>Move Here</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteConfirm?.type === "folder" ? "Folder" : "File"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {deleteConfirm?.type === "folder" ? (
                <>
                  Are you sure you want to delete the folder &ldquo;
                  <span className="text-white font-medium">
                    {deleteConfirm?.name}
                  </span>
                  &rdquo;?{" "}
                  <span className="text-red-400 font-medium">
                    This will permanently delete all files and subfolders inside
                    it.
                  </span>
                </>
              ) : (
                <>
                  Are you sure you want to delete &ldquo;
                  <span className="text-white font-medium">
                    {deleteConfirm?.name}
                  </span>
                  &rdquo;? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Folder Tree (Sidebar) ---
function FolderTreeView({
  folders,
  parentId,
  level,
  currentFolderId,
  onNavigate,
}: {
  folders: FolderWithCounts[];
  parentId: string | null;
  level: number;
  currentFolderId: string | null;
  onNavigate: (id: string | null) => void;
}) {
  const children = folders.filter((f) => f.parentId === parentId);
  if (children.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {children.map((folder) => (
        <div key={folder.id}>
          <button
            onClick={() => onNavigate(folder.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              currentFolderId === folder.id
                ? "bg-brand-purple-300 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            )}
            style={{ paddingLeft: `${(level + 1) * 12 + 12}px` }}
          >
            {currentFolderId === folder.id ? (
              <FolderOpen className="w-4 h-4 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">{folder.name}</span>
            {(folder._count.media > 0 || folder._count.children > 0) && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500 shrink-0">
                {folder._count.media + folder._count.children}
              </span>
            )}
          </button>
          <FolderTreeView
            folders={folders}
            parentId={folder.id}
            level={level + 1}
            currentFolderId={currentFolderId}
            onNavigate={onNavigate}
          />
        </div>
      ))}
    </div>
  );
}

// --- Filter Button ---
function FilterButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm font-medium",
        active
          ? "bg-brand-purple-300 text-white shadow-lg shadow-brand-purple-300/20 translate-x-1"
          : "text-zinc-400 hover:bg-white/5 hover:text-white",
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <span
        className={cn(
          "text-[10px] px-1.5 py-0.5 rounded-md",
          active ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-500",
        )}
      >
        {count}
      </span>
    </button>
  );
}

// --- Folder Card ---
function FolderCard({
  folder,
  onOpen,
  onRename,
  onMove,
  onDelete,
}: {
  folder: FolderWithCounts;
  onOpen: () => void;
  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex flex-col gap-3">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-purple-300/10 group-hover:-translate-y-1 cursor-pointer flex items-center justify-center"
        onDoubleClick={onOpen}
        onClick={onOpen}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-5 bg-brand-purple-300/10 rounded-2xl border border-brand-purple-300/20 transition-all duration-300 group-hover:bg-brand-purple-300/20 group-hover:scale-110">
            <FolderOpen className="w-12 h-12 text-brand-purple-200" />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            {folder._count.media > 0 && (
              <span>{folder._count.media} files</span>
            )}
            {folder._count.children > 0 && (
              <span>{folder._count.children} folders</span>
            )}
            {folder._count.media === 0 && folder._count.children === 0 && (
              <span>Empty</span>
            )}
          </div>
        </div>

        {/* Actions menu */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full backdrop-blur-sm"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800 text-zinc-100"
            >
              <DropdownMenuItem onClick={onOpen}>
                <FolderOpen className="w-4 h-4 mr-2" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRename}>
                <Pencil className="w-4 h-4 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMove}>
                <FolderInput className="w-4 h-4 mr-2" /> Move
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-1">
        <p
          className="text-xs font-bold text-zinc-100 line-clamp-1 mb-0.5"
          title={folder.name}
        >
          {folder.name}
        </p>
        <p className="text-[10px] font-medium text-zinc-500">Folder</p>
      </div>
    </div>
  );
}

// --- Media Card ---
function MediaCard({
  item,
  displayTitle,
  onCopy,
  onRename,
  onMove,
  onDelete,
}: {
  item: Media;
  displayTitle: string;
  onCopy: () => void;
  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
}) {
  const isImage = item.mimeType?.startsWith("image/");

  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-purple-300/20 group-hover:-translate-y-1">
        {isImage ? (
          <Image
            src={item.url || ""}
            alt={item.alt || item.key}
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
            <Button
              size="icon"
              variant="ghost"
              className="size-9 bg-white text-brand-purple-300 hover:bg-brand-purple-50 rounded-full"
              onClick={() => window.open(item.url || "", "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-9 bg-white text-brand-purple-300 hover:bg-brand-purple-50 rounded-full"
              onClick={onCopy}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full backdrop-blur-sm"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800 text-zinc-100"
            >
              <DropdownMenuItem
                onClick={() => window.open(item.url || "", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="w-4 h-4 mr-2" /> Copy URL
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={onRename}>
                <Pencil className="w-4 h-4 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMove}>
                <FolderInput className="w-4 h-4 mr-2" /> Move to Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-1">
        <p
          className="text-xs font-bold text-zinc-100 line-clamp-1 mb-0.5 capitalize"
          title={displayTitle}
        >
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
