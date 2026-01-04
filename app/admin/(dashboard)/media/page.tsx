import { UploadZone } from "@/components/media/UploadZone";
import { useState } from "react";

export default function AdminMediaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-8">
      <UploadZone onUploadComplete={() => setRefreshKey((k) => k + 1)} />
    </div>
  );
}
