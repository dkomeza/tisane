import { faker } from "@faker-js/faker";
import { pages, pageStatus, pageVisibility } from "@/src/db/schema/pages";
import { db } from "@/src/db/drizzle";

export type Page = Omit<typeof pages.$inferSelect, "id">;
const usedSlugs = new Map<string, number>();

export async function getUsedSlugs(): Promise<void> {
  const existingPages = await db.select().from(pages);
  existingPages.forEach((page) => {
    const key = page.slug.toLowerCase();
    const count = usedSlugs.get(key) ?? 0;
    usedSlugs.set(key, count + 1);
  });

  console.log(`Loaded ${existingPages.length} existing slugs`);
  console.log(usedSlugs);
}

function uniqueSlug(base: string) {
  const key = base.toLowerCase();

  const count = usedSlugs.get(key) ?? 0;
  usedSlugs.set(key, count + 1);

  return count === 0 ? key : `${key}-${count}`;
}

export function makePage(overrides: Partial<Page> = {}): Page {
  const title = faker.book.title();
  const status = faker.helpers.arrayElement(pageStatus.enumValues);
  const publishedAt = status === "published" ? faker.date.past() : null;

  return {
    title: title,
    slug: uniqueSlug(faker.word.noun()).replace(/\s+/g, "-"),
    status: status,
    visibility: faker.helpers.arrayElement(pageVisibility.enumValues),
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: publishedAt,
    deletedAt: null,
    content: faker.lorem.paragraphs(3),
    metaTitle: title,
    metaDescription: faker.lorem.sentences(2),
    openGraphImage: null,
    canonicalUrl: null,
    order: 0,
    parentId: null,
    ...overrides,
  };
}
