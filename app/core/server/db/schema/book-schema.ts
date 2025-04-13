import { relations } from "drizzle-orm";
import { integer, pgSchema, text } from "drizzle-orm/pg-core";

export const appSchema = pgSchema("app");

export const categories = appSchema.table("categories", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text().notNull().unique(),
	description: text(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	bookCategories: many(booksToCategories),
}));

export const books = appSchema.table("books", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	title: text().notNull(),
	author: text().notNull(),
	publishYear: integer(),
});

export const booksRelations = relations(books, ({ many }) => ({
	bookCategories: many(booksToCategories),
}));

// Intermediate table for many-to-many relationship between books and categories
export const booksToCategories = appSchema.table("books_to_categories", {
	bookId: integer()
		.notNull()
		.references(() => books.id),
	categoryId: integer()
		.notNull()
		.references(() => categories.id),
});

export const booksToCategoriesRelations = relations(
	booksToCategories,
	({ one }) => ({
		book: one(books, {
			fields: [booksToCategories.bookId],
			references: [books.id],
		}),
		category: one(categories, {
			fields: [booksToCategories.categoryId],
			references: [categories.id],
		}),
	}),
);
