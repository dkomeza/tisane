import { faker } from "@faker-js/faker";
import prisma, {
  PageStatus,
  Page as PageT,
  PageVisibility,
  Prisma,
} from "@/lib/prisma";
import { PageCreateManyInput } from "@/src/generated/prisma/models";

export type Page = Omit<PageT, "id">;
const usedSlugs = new Map<string, number>();

export async function getUsedSlugs(): Promise<void> {
  const existingPages = await prisma.page.findMany();
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

export function makePage(overrides: Partial<PageCreateManyInput> = {}): PageCreateManyInput {
  const title = faker.book.title();
  const status = faker.helpers.arrayElement(Object.values(PageStatus));
  const publishedAt = status === "published" ? faker.date.past() : null;

  const content = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: faker.lorem.paragraph(),
          },
        ],
      },
    ],
  } as Prisma.JsonObject;

  return {
    title: title,
    slug: uniqueSlug(faker.word.noun()).replace(/\s+/g, "-"),
    status: status,
    visibility: faker.helpers.arrayElement(Object.values(PageVisibility)),
    created_at: new Date(),
    updated_at: new Date(),
    published_at: publishedAt,
    deleted_at: null,
    content,
    seo_title: title,
    seo_description: faker.lorem.sentences(2),
    open_graph_image: null,
    canonical_url: null,
    order: 0,
    parent_id: null,
    ...overrides,
  };
}
