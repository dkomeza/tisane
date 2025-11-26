import { pgTable } from "drizzle-orm/pg-core";
import { serial, text } from "drizzle-orm/pg-core/columns";

export const settings = pgTable("settings", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  value: text().notNull(),
});
