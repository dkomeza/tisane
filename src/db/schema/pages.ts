import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const pageStatus = pgEnum("page_status", [
  "draft",
  "published",
  "archived",
]);

export const pageVisibility = pgEnum("page_visibility", [
  "public",
  "private",
  "password_protected",
]);

export const pages = pgTable(
  "pages",
  {
    // Metadata
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    tags: text("tags").array().notNull().default([]),

    // Status and visibility
    status: pageStatus("status").default("draft").notNull(),
    visibility: pageVisibility("visibility").default("public").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    publishedAt: timestamp("published_at"),

    // Content
    content: text("content").notNull(), // Temporary column for storing page content as text

    // SEO
    metaTitle: text("seo_title"),
    metaDescription: text("seo_description"),
    openGraphImage: text("open_graph_image"),
    canonicalUrl: text("canonical_url"),

    // Navigation
    order: integer("order").default(0).notNull(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentId: text("parent_id").references((): any => pages.id, {
      onDelete: "set null",
    }),
  },
  (table) => [index("pages_parent_idx").on(table.parentId)]
);

export const tags = pgTable(
  "tags",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("tags_name_idx").on(table.name)]
);

export const pagesTags = pgTable(
  "pages_tags",
  {
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("pages_tags_page_idx").on(table.pageId),
    index("pages_tags_tag_idx").on(table.tagId),
  ]
);

export const pageRelations = relations(pages, ({ one, many }) => ({
  children: many(pages),
  parent: one(pages),
  tags: many(tags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  pages: many(pagesTags),
}));

export const pagesTagsRelations = relations(pagesTags, ({ one }) => ({
  page: one(pages, {
    fields: [pagesTags.pageId],
    references: [pages.id],
  }),
  tag: one(tags, {
    fields: [pagesTags.tagId],
    references: [tags.id],
  }),
}));
