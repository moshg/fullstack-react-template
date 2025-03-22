import { expect, test } from "@playwright/test";
import { generateId } from "./utils/id";

test("User can add a book with category, see it in the list, and view its details", async ({
	page,
}) => {
	const id = generateId();

	// Add a category first
	const categoryName = `Relation Test ${id}`;
	await page.goto("/categories/new");
	await page.getByLabel("Name").fill(categoryName);
	await page.getByRole("button", { name: "Add" }).click();
	await page.waitForURL("/categories");

	// Access the book list page
	await page.goto("/books");

	// Navigate to the new book addition page
	await page.getByRole("link", { name: "Add" }).click();
	await page.waitForURL("/books/new");

	// Fill in the form
	const book = {
		title: `Test Book ${id}`,
		author: `Test Author ${id}`,
		publicationYear: "2023",
	};
	await page.getByLabel("Title").fill(book.title);
	await page.getByLabel("Author").fill(book.author);
	await page.getByLabel("Publication Year").fill(book.publicationYear);
	await page.getByLabel(categoryName).check();

	// Submit
	await page.getByRole("button", { name: "Add" }).click();

	// Confirm redirect to the book list page
	await page.waitForURL("/books");

	// Confirm that the added book appears in the list
	const bookRow = page.getByRole("row", { name: new RegExp(book.title) });
	await expect(bookRow).toBeVisible();
	await expect(bookRow.getByText(book.title)).toBeVisible();
	await expect(bookRow.getByText(book.author)).toBeVisible();
	await expect(bookRow.getByText(book.publicationYear)).toBeVisible();
	await expect(bookRow.getByText(categoryName)).toBeVisible();
	// Navigate to book detail page by clicking on the row
	await bookRow.click();

	// Wait for navigation to complete and verify content on the detail page
	await page.waitForURL(/\/books\/\d+/);
	await expect(
		page.getByRole("heading", { name: "Book Details" }),
	).toBeVisible();
	await expect(page.getByText(book.title)).toBeVisible();
	await expect(page.getByText(book.author)).toBeVisible();
	await expect(page.getByText(book.publicationYear)).toBeVisible();
	await expect(page.getByText(categoryName)).toBeVisible();

	// Test navigation back to list
	await page.getByRole("link", { name: "Back to List" }).click();
	await page.waitForURL("/books");
});

test("User can navigate back from book addition page", async ({ page }) => {
	// Navigate to the books list
	await page.goto("/books");

	// Go to the new book addition page
	await page.getByRole("link", { name: "Add" }).click();
	await page.waitForURL("/books/new");

	// Click the back button
	await page.getByRole("link", { name: "Back" }).click();

	// Verify we've returned to the books list
	await page.waitForURL("/books");
});

test("Error is displayed when accessing a non-existent book ID", async ({
	page,
}) => {
	// Access non-existent book
	await page.goto("/books/999999");

	// Verify error message
	await expect(page.getByText("Book not found.")).toBeVisible();

	// Verify back to list navigation works
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/books");
});
