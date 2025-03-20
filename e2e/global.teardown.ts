import { test as teardown } from "@playwright/test";
import { books, booksToCategories, categories } from "~/server/db/schema";
import { getTestDb } from "./db";

teardown("delete database", async () => {
	const db = getTestDb();

	// Delete the database
	await db.delete(booksToCategories);
	await db.delete(books);
	await db.delete(categories);
});
