import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	description: text(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	bookCategories: many(booksToCategories),
}));

export const books = sqliteTable("books", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	author: text().notNull(),
	publishYear: int(),
});

export const booksRelations = relations(books, ({ many }) => ({
	bookCategories: many(booksToCategories),
}));

// Intermediate table for many-to-many relationship between books and categories
export const booksToCategories = sqliteTable("books_to_categories", {
	id: int().primaryKey({ autoIncrement: true }),
	bookId: int()
		.notNull()
		.references(() => books.id),
	categoryId: int()
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
