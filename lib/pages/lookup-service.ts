"use server";

import { cacheTag } from "next/cache";
import prisma, { Page } from "@/lib/prisma";
import { DBComponent, DBComponentsArraySchema } from "@/components/registry";

export type CachedPage = Pick<
  Page,
  | "id"
  | "title"
  | "slug"
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
} & {
  content: DBComponent[];
};

async function fetchPageBySlug(slug: string): Promise<CachedPage | null> {
  const page = await prisma.page.findUnique({
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
    where: { slug, deleted_at: null },
  });

  if (!page) {
    return null;
  }

  try {
    if (typeof page.content === "string") {
      page.content = JSON.parse(page.content);
    }
  } catch (e) {
    console.error("Failed to parse page content JSON:", e);
    return null;
  }

  const { success, data } = DBComponentsArraySchema.safeParse(page.content);
  if (!success) {
    console.error("Failed to parse page components:", data);
    return null;
  }

  return {
    ...page,
    content: data,
  };
}

function normalizeSlug(slug: string[]): string {
  if (slug.length === 0 || (slug.length === 1 && slug[0] === "")) {
    return "home";
  }
  return slug.join("/");
}

/**
 * Fetches a page by its slug.
 *
 * An empty slug or "/" is treated as the "home" page slug.
 *
 * @param slug - The URL slug segments for the page (e.g. ["about"], ["blog", "post-1"], or [] for home).
 * @returns A promise that resolves to the matching cached page, or `null` if no page exists.
 */
export async function getPageBySlug(
  slug: string[]
): Promise<CachedPage | null> {
  const realSlug = normalizeSlug(slug);
  return fetchPageBySlug(realSlug);
}

/**
 * Returns a cached version of {@link getPageBySlug} for the given slug.
 *
 * Uses Next.js `unstable_cache` to cache the result keyed by the slug. The cache
 * is tagged with `page[slug]` so it can be revalidated or invalidated elsewhere.
 *
 * @param slug - The URL slug for the page to retrieve from cache.
 * @returns A promise that resolves to the cached page data, or `null` if not found.
 */
export async function getCachedPageBySlug(
  slug: string[]
): Promise<CachedPage | null> {
  "use cache";
  const realSlug = normalizeSlug(slug);
  cacheTag(`page[${realSlug}]`);

  return await fetchPageBySlug(realSlug);
}
