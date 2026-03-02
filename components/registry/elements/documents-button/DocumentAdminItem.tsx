"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, X, Loader2, File } from "lucide-react";
import { MediaSelector } from "@/components/registry/items/image/MediaSelector";
import { getMedia } from "@/app/actions/media/view-action";
import { Media } from "@/lib/prisma";

interface DocumentAdminItemProps {
    mediaId: string;
    onSelect: (media: any) => void;
    onRemove: () => void;
}

export function DocumentAdminItem({
    mediaId,
    onSelect,
    onRemove,
}: DocumentAdminItemProps) {
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mediaId) {
            setLoading(true);
            getMedia(mediaId)
                .then((media) => {
                    setSelectedMedia(media);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setSelectedMedia(null);
        }
    }, [mediaId]);

    return (
        <div className="p-4 rounded-xl border border-gray-100 space-y-4">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <FileText className="w-3 h-3" />
                Document
            </label>

            {loading ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-white/5 border-white/10">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-purple-200" />
                </div>
            ) : mediaId && selectedMedia ? (
                <div className="relative group p-4 border rounded-lg bg-white/5 border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-brand-purple-200/20 rounded-lg">
                        <File className="w-6 h-6 text-brand-purple-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-sm font-medium text-white truncate max-w-[200px]"
                            title={selectedMedia.key}
                        >
                            {selectedMedia.key.split("-").slice(1).join("-") ||
                                selectedMedia.key}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            {(selectedMedia.mimeType || "document")
                                .split("/")[1]
                                ?.toUpperCase()} •{" "}
                            {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MediaSelector
                            onSelect={onSelect}
                            trigger={
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-xs text-brand-purple-200 hover:text-brand-purple-300 hover:bg-brand-purple-200/10"
                                >
                                    Change
                                </Button>
                            }
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={onRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors bg-white/5 border-white/10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-full">
                            <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-white">
                                No document selected
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 50MB</p>
                        </div>
                        <MediaSelector
                            onSelect={onSelect}
                            trigger={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent text-white border-white/20 hover:bg-white/5 mt-2"
                                >
                                    Select Document
                                </Button>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
