import { unstable_cache } from "next/cache";
import prisma, { Page } from "@/lib/prisma";

export type CachedPage = Pick<
  Page,
  | "id"
  | "title"
  | "slug"
  | "content"
  | "status"
  | "visibility"
  | "created_at"
  | "updated_at"
  | "seo_description"
  | "seo_title"
  | "open_graph_image"
  | "canonical_url"
> & {
  tags: {
    name: string;
  }[];
};

async function fetchPageBySlug(slug: string): Promise<CachedPage | null> {
  return prisma.page.findUnique({
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      status: true,
      visibility: true,
      created_at: true,
      updated_at: true,
      seo_description: true,
      seo_title: true,
      open_graph_image: true,
      canonical_url: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
    where: { slug, status: "published", visibility: "public" },
  });
}

export function getPageBySlug(slug: string): Promise<CachedPage | null> {
  const realSlug = !slug || slug === "/" ? "home" : slug;
  return fetchPageBySlug(realSlug);
}

export function getCachedPageBySlug(slug: string): Promise<CachedPage | null> {
  return unstable_cache(
    async () => {
      return getPageBySlug(slug);
    },
    [`slug-${slug}`],
    {
      revalidate: false,
      tags: [`page[${slug}]`],
    }
  )();
}
