import { pgTable, text } from "drizzle-orm/pg-core";

export const cmsPostsTable = pgTable("cms_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  slug: text("slug").notNull().default(""),
  category: text("category").notNull().default(""),
  status: text("status").notNull().default("Rascunho"),
  tags: text("tags").notNull().default("[]"),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  videoYoutube: text("video_youtube").notNull().default(""),
  readingTime: text("reading_time").notNull().default(""),
  scheduledAt: text("scheduled_at").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(""),
  publishedAt: text("published_at").notNull().default(""),
});

export const cmsCategoriesTable = pgTable("cms_categories", {
  name: text("name").primaryKey(),
});

export type DbPost = typeof cmsPostsTable.$inferSelect;
export type DbCategory = typeof cmsCategoriesTable.$inferSelect;
