import { db } from "@/src/db/drizzle";
import { pages, tags, pagesTags } from "@/src/db/schema";
import { pages as pageData, tags as tagData } from "./factories/pages";
import { faker } from "@faker-js/faker";

export default async function seed() {
  await db.transaction(async (tx) => {
    /* ---------- TAGS ---------- */
    const insertedTags = await tx
      .insert(tags)
      .values(tagData)
      .onConflictDoNothing()
      .returning();

    const tagIds = insertedTags.map((t) => t.id);

    /* ---------- ROOT PAGES ---------- */
    const roots = pageData.filter((p) => p.parentId === null);

    const insertedRoots = await tx.insert(pages).values(roots).returning();

    const pageIdBySlug = Object.fromEntries(
      insertedRoots.map((p) => [p.slug, p.id])
    );

    /* ---------- CHILD PAGES ---------- */
    const children = pageData
      .filter((p) => p.parentId !== null)
      .map((p) => ({
        ...p,
        parentId: pageIdBySlug[p.parentId!], // resolve slug → uuid
      }));

    const insertedChildren = await tx
      .insert(pages)
      .values(children)
      .returning();

    const allPages = [...insertedRoots, ...insertedChildren];

    /* ---------- PAGE ↔ TAGS ---------- */
    const pageTags = allPages.flatMap((page) => {
      const count = faker.number.int({ min: 1, max: 3 });
      const chosen = faker.helpers.arrayElements(tagIds, count);

      return chosen.map((tagId) => ({
        pageId: page.id,
        tagId,
      }));
    });

    await tx.insert(pagesTags).values(pageTags);
  });
}
