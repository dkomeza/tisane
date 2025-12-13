import { faker } from "@faker-js/faker";

export function makeTag() {
  return {
    name: faker.word.noun(),
  };
}
