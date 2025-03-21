import { expect, test } from "@playwright/test";
import { generateId } from "./utils/id";

test("Book creation and display", async ({ page }) => {
	// Access the book list page
	await page.goto("/books");

	// Navigate to the new book creation page
	await page.getByRole("link", { name: "Add" }).click();
	await page.waitForURL("/books/new");

	// Fill in the form
	const id = generateId();
	const book = {
		title: `Test Book ${id}`,
		author: `Test Author ${id}`,
		publicationYear: "2023",
	};
	await page.getByLabel("Title").fill(book.title);
	await page.getByLabel("Author").fill(book.author);
	await page.getByLabel("Publication Year").fill(book.publicationYear);

	// Submit
	await page.getByRole("button", { name: "Add" }).click();

	// Confirm redirect to the book list page
	await page.waitForURL("/books");

	// Confirm that the created book appears in the list
	const bookRow = page.getByRole("row", { name: new RegExp(book.title) });
	await expect(bookRow).toBeVisible();
	await expect(bookRow.getByText(book.title)).toBeVisible();
	await expect(bookRow.getByText(book.author)).toBeVisible();
	await expect(bookRow.getByText(book.publicationYear)).toBeVisible();
});
