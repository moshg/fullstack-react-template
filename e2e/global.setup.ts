import { test as setup } from "@playwright/test";
import { books, booksToCategories, categories } from "~/server/db/schema";
import { getTestDb } from "./db";

setup("reset database", async () => {
	const db = getTestDb();

	await db.delete(booksToCategories);
	await db.delete(books);
	await db.delete(categories);
});
