"use client";

import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { usePreviewReceiver } from "@/hooks/use-preview-sync";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function PreviewPage({ params }: PageProps) {
  const { slug = [] } = use(params);
  const parsedSlug = slug
    .filter((part) => part && part.trim() !== "")
    .join("/");

  const { blocks } = usePreviewReceiver(
    parsedSlug !== "" ? parsedSlug : undefined
  );

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
