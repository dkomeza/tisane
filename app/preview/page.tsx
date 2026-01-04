"use client";

import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { usePreviewReceiver } from "@/hooks/use-preview-sync";
import { Loader2 } from "lucide-react";

export default function PreviewPage() {
  const { blocks } = usePreviewReceiver();

  if (!blocks) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Waiting for preview content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageContentRenderer blocks={blocks} />
    </div>
  );
}
