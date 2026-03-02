"use cache";

import { notFound } from "next/navigation";
import { getCachedPageBySlug } from "@/lib/pages/lookup-service";
import { Metadata } from "next";
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { PageContentRenderer } from "./PageContentRenderer";
import { Menu } from "@/components/Menu";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = await getCachedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  if (page.visibility !== "public" || page.status !== "published") {
    const { session } = await authorize();
    if (!hasPermission(session, "content.read")) {
      notFound();
    }
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || undefined,
      url: page.canonical_url || undefined,
      images: page.open_graph_image ? [page.open_graph_image] : [],
    },
    alternates: {
      canonical: page.canonical_url,
    },
  };
}

/**
 * Renders a CMS page based on the provided slug.
 * It is
 * @returns
 */
export default async function CMSPage({ params }: PageProps) {
  const { slug = [] } = await params;

  const page = await getCachedPageBySlug(slug);
  if (!page) {
    notFound();
  }

  if (page.visibility !== "public" || page.status !== "published") {
    const { session } = await authorize();
    if (!hasPermission(session, "content.read")) {
      notFound();
    }
  }

  return (
    <>
      <Menu slug={"main-menu"} />
      <PageContentRenderer blocks={page.content} />
    </>
  );
}
