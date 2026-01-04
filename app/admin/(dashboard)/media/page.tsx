"use client";

import { useState } from "react";
import { UploadZone } from "@/components/media/UploadZone";

export default function AdminMediaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Upload Media</h1>

      <UploadZone onUploadComplete={() => setRefreshKey(k => k + 1)} />

      <p className="text-gray-500 mt-4">
        Files uploaded successfully will be available in the system.
      </p>
    </div>
  );
}
