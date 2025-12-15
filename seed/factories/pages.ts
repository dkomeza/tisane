import { faker } from "@faker-js/faker";
import { getUsedSlugs, makePage, Page } from "./page";
import { getUsedTags, makeTag } from "./tag";

faker.seed(43); // IMPORTANT: reproducible seeds

export const TAG_COUNT = 40;
export const ROOT_PAGE_COUNT = 10;
export const CHILD_PAGES_PER_ROOT = 10;

await getUsedSlugs();
await getUsedTags();

export const tags = Array.from({ length: TAG_COUNT }, makeTag);

function generateChildren(parentSlug: string, depth: number, maxDepth: number) {
  if (depth >= maxDepth) return;

  const count = faker.number.int({ min: 0, max: 4 });

  for (let i = 0; i < count; i++) {
    const page = makePage({
      parentId: parentSlug,
      order: i,
    });

    pages.push(page);
    generateChildren(page.slug, depth + 1, maxDepth);
  }
}

export const pages: Page[] = [];

for (let i = 0; i < ROOT_PAGE_COUNT; i++) {
  const root = makePage({ parentId: null, order: i });
  pages.push(root);
  generateChildren(root.slug, 0, 3);
}
