import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categoriesTable = sqliteTable("categories", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	description: text(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	bookCategories: many(bookCategoriesTable),
}));

export const booksTable = sqliteTable("books", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	author: text().notNull(),
	publishYear: int(),
});

export const booksRelations = relations(booksTable, ({ many }) => ({
	bookCategories: many(bookCategoriesTable),
}));

// Intermediate table for many-to-many relationship between books and categories
export const bookCategoriesTable = sqliteTable("book_categories", {
	id: int().primaryKey({ autoIncrement: true }),
	bookId: int()
		.notNull()
		.references(() => booksTable.id),
	categoryId: int()
		.notNull()
		.references(() => categoriesTable.id),
});

export const bookCategoriesRelations = relations(
	bookCategoriesTable,
	({ one }) => ({
		book: one(booksTable, {
			fields: [bookCategoriesTable.bookId],
			references: [booksTable.id],
		}),
		category: one(categoriesTable, {
			fields: [bookCategoriesTable.categoryId],
			references: [categoriesTable.id],
		}),
	}),
);
