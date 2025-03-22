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

test("Book detail page navigation and display", async ({ page }) => {
	// Create a new book first
	await page.goto("/books/new");
	const id = generateId();
	const book = {
		title: `Test Book for Detail ${id}`,
		author: `Test Author ${id}`,
		publicationYear: "2024",
	};
	await page.getByLabel("Title").fill(book.title);
	await page.getByLabel("Author").fill(book.author);
	await page.getByLabel("Publication Year").fill(book.publicationYear);
	await page.getByRole("button", { name: "Add" }).click();

	// Wait for redirect and book to appear in the list
	await page.waitForURL("/books");
	await page
		.getByRole("row", {
			name: new RegExp(book.title),
		})
		.click();

	// Wait for navigation to complete and verify content on the detail page
	await page.waitForURL(/\/books\/\d+/);
	await expect(
		page.getByRole("heading", { name: "Book Details" }),
	).toBeVisible();
	await expect(page.getByText(book.title)).toBeVisible();
	await expect(page.getByText(book.author)).toBeVisible();
	await expect(page.getByText(book.publicationYear)).toBeVisible();

	// Test navigation back to list
	await page.getByRole("link", { name: "Back to List" }).click();
	await page.waitForURL("/books");
});

test("Book and category relationship", async ({ page }) => {
	// Create a category
	await page.goto("/categories/new");
	const categoryName = `RelationTest${Date.now()}`;
	await page.getByLabel("Name").fill(categoryName);
	await page.getByRole("button", { name: "Add" }).click();

	// Verify that the created category exists
	await page.goto("/books/new");
	await page.getByText(categoryName).isVisible();
});

test("Book detail page - Not found case", async ({ page }) => {
	// Access non-existent book
	await page.goto("/books/999999");

	// Verify error message
	await expect(page.getByText("Book not found.")).toBeVisible();

	// Verify back to list navigation works
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/books");
});
