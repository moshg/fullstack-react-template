import { test as teardown } from "@playwright/test";
import { getDb } from "~/config/drizzle";
import { bookCategoriesTable, booksTable, categoriesTable } from "~/db/schema";

teardown("delete database", async () => {
	const db = getDb("file:test.db");

	// Delete the database
	await db.delete(bookCategoriesTable);
	await db.delete(booksTable);
	await db.delete(categoriesTable);
});
