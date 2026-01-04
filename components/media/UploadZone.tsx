"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadMedia } from "@/app/actions/media/media";

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: { "image/*": [] },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      setError(null);

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);

          await uploadMedia(formData as any);
        }

        onUploadComplete?.();
      } catch (err: any) {
        setError(err.message || "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete]
  );

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500"
    >
      <input {...getInputProps()} />
      {isUploading && <p className="text-blue-500">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {isDragActive ? (
        <p>Drop your files here...</p>
      ) : (
        <p>Drag & drop images here, or click to select files</p>
      )}
    </div>
  );
}
