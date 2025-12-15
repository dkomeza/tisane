import prisma from "@/lib/prisma";

import { pages as pageData, tags as tagData } from "./factories/pages";
import { faker } from "@faker-js/faker";

export default async function seed() {
  await prisma.$transaction([
    prisma.tag.createMany({
      data: tagData,
      skipDuplicates: true,
    }),
    prisma.page.createMany({
      data: pageData,
    }),
  ]);

  const insertedTags = await prisma.tag.findMany();
  const tagIds = insertedTags.map((t) => t.id);

  const insertedPages = await prisma.page.findMany();

  const pageIdToTags = insertedPages.reduce(
    (acc, page) => {
      const count = faker.number.int({ min: 1, max: 3 });
      const chosen = faker.helpers.arrayElements(tagIds, count);
      acc[page.id] = chosen;
      return acc;
    },
    {} as Record<string, string[]>
  );

  await prisma.$transaction(
    Object.entries(pageIdToTags).map(([pageId, tagIds]) =>
      prisma.page.update({
        where: { id: pageId },
        data: {
          tags: {
            connect: tagIds.map((tagId) => ({ id: tagId })),
          },
        },
      })
    )
  );
}
