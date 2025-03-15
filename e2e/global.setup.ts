import { test as setup } from "@playwright/test";
import { getDb } from "~/config/drizzle";
import { bookCategoriesTable, booksTable, categoriesTable } from "~/db/schema";

setup("reset database", async () => {
	const db = getDb("file:test.db");

	await db.delete(bookCategoriesTable);
	await db.delete(booksTable);
	await db.delete(categoriesTable);
});
