import { test as teardown } from "@playwright/test";
import { getDb } from "~/server/db";
import { books, booksToCategories, categories } from "~/server/db/schema";

teardown("delete database", async () => {
	const db = getDb("file:test.db");

	// Delete the database
	await db.delete(booksToCategories);
	await db.delete(books);
	await db.delete(categories);
});
