import { db } from "@/src/db/drizzle";
import { tags } from "@/src/db/schema/pages";
import { faker } from "@faker-js/faker";

const usedTags = new Map<string, number>();

export async function getUsedTags(): Promise<void> {
  const existingTags = await db.select().from(tags);
  existingTags.forEach((tag) => {
    const key = tag.name.toLowerCase();
    const count = usedTags.get(key) ?? 0;
    usedTags.set(key, count + 1);
  });
}

function uniqueTag(base: string) {
  const key = base.toLowerCase();
  const count = usedTags.get(key) ?? 0;
  usedTags.set(key, count + 1);

  return count === 0 ? key : `${key}-${count}`;
}

export function makeTag() {
  const name = uniqueTag(faker.word.noun());
  return {
    name,
  };
}
