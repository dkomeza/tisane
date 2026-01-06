"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getPresignedUploadUrl,
  registerMediaInDb,
} from "@/app/actions/media/media";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      setError(null);
      setProgress(0);

      let completedFiles = 0;
      const totalFiles = acceptedFiles.length;

      const processFile = async (file: File) => {
        return new Promise<void>(async (resolve, reject) => {
          try {
            // Get image dimensions
            let width = 0;
            let height = 0;
            if (file.type.startsWith("image/")) {
              const img = new Image();
              const objectUrl = URL.createObjectURL(file);
              img.src = objectUrl;
              await new Promise<void>((r) => {
                img.onload = () => {
                  width = img.width;
                  height = img.height;
                  r();
                };
                img.onerror = () => r(); // proceed even if fails
              });
              URL.revokeObjectURL(objectUrl);
            }

            const presignedData = await getPresignedUploadUrl(
              file.name,
              file.type
            );

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

            const xhr = new XMLHttpRequest();
            xhr.open("POST", presignedData.url);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const filePercent = event.loaded / event.total;
                const totalProgress = Math.round(
                  ((completedFiles + filePercent) / totalFiles) * 100
                );
                setProgress(totalProgress);
              }
            };

            xhr.onload = async () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                await registerMediaInDb(
                  presignedData.key!,
                  file.type,
                  file.size,
                  width,
                  height
                );
                completedFiles++;
                resolve();
              } else {
                console.error("S3 Upload Error:", xhr.responseText);
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            };

            xhr.onerror = () =>
              reject(new Error("Network error during upload"));
            xhr.send(formData);
          } catch (err) {
            reject(err);
          }
        });
      };

      try {
        for (const file of acceptedFiles) {
          await processFile(file);
        }
        toast.success("Upload successful!");
        if (onUploadComplete) onUploadComplete();
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Upload failed");
        toast.error("Upload failed");
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
    maxSize: 50 * 1024 * 1024,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 
        ${isDragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"}
        ${isUploading ? "cursor-not-allowed opacity-90" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-3">
        {isUploading ? (
          <div className="w-full max-w-xs space-y-4">
            <div className="flex items-center justify-between text-sm text-blue-600 mb-1">
              <span className="font-medium">Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? "Drop files now" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-500">Max 50MB</p>
            </div>
          </>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
