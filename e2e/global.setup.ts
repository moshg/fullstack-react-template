import { test as setup } from "@playwright/test";
import { getDb } from "~/server/db";
import { books, booksToCategories, categories } from "~/server/db/schema";

setup("reset database", async () => {
	const db = getDb("file:test.db");

	await db.delete(booksToCategories);
	await db.delete(books);
	await db.delete(categories);
});
