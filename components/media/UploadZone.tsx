"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getPresignedUploadUrl,
  registerMediaInDb,
} from "@/app/actions/media/media";
import { toast } from "sonner";

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      setError(null);

      const processFile = async (file: File) => {
        const presignedData = await getPresignedUploadUrl(file.name, file.type);

        if (
          !presignedData.success ||
          !presignedData.url ||
          !presignedData.fields
        ) {
          throw new Error(`Failed to get upload URL for ${file.name}`);
        }

        const formData = new FormData();
        Object.entries(presignedData.fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append("file", file);

        const uploadResponse = await fetch(presignedData.url, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.error("S3 Error:", await uploadResponse.text());
          throw new Error(`Upload failed for ${file.name}`);
        }

        await registerMediaInDb(presignedData.key!, file.type, file.size);
      };

      try {
        await Promise.all(acceptedFiles.map(processFile));

        toast.success("Upload successful!");
        if (onUploadComplete) {
          onUploadComplete();
        }
      } catch (err: any) {
        console.error(err);
        const msg = err.message || "Upload failed";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDropRejected: (rejections) => {
      const msg = rejections
        .map((r) => r.errors.map((e) => e.message).join(", "))
        .join("; ");
      setError(msg);
      toast.error(msg);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-500"
      }`}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <p className="text-blue-600 font-medium animate-pulse">
          Uploading directly to S3...
        </p>
      ) : error ? (
        <p className="text-red-500 mb-2">{error}</p>
      ) : isDragActive ? (
        <p className="text-blue-500 font-medium">Drop files here...</p>
      ) : (
        <div className="space-y-1">
          <p className="text-gray-700 font-medium">Drag & drop images here</p>
          <p className="text-gray-500 text-sm">or click to select files</p>
        </div>
      )}
    </div>
  );
}
