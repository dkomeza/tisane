import { faker } from "@faker-js/faker";
import { getUsedSlugs, makePage, Page } from "./page";
import { getUsedTags, makeTag } from "./tag";

faker.seed(43); // IMPORTANT: reproducible seeds

export const TAG_COUNT = 40;
export const PAGE_COUNT = 100;

await getUsedSlugs();
await getUsedTags();

export const tags = Array.from({ length: TAG_COUNT }, makeTag);

export const pages: Page[] = [];

for (let i = 0; i < PAGE_COUNT; i++) {
  const root = makePage({ parent_id: null, order: i });
  pages.push(root);
}
