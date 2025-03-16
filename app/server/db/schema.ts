import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categoriesTable = sqliteTable("categories", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	description: text(),
});

export const booksTable = sqliteTable("books", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	author: text().notNull(),
	publishYear: int(),
});

// 本とカテゴリの多対多関係のための中間テーブル
export const bookCategoriesTable = sqliteTable("book_categories", {
	id: int().primaryKey({ autoIncrement: true }),
	bookId: int()
		.notNull()
		.references(() => booksTable.id),
	categoryId: int()
		.notNull()
		.references(() => categoriesTable.id),
});
