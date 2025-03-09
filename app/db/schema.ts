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
	categoryId: int().references(() => categoriesTable.id),
});
