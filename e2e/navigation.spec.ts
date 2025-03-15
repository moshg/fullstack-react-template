import { expect, test } from "@playwright/test";

test("Book navigation functions correctly", async ({ page }) => {
	// Access the homepage
	await page.goto("/");

	// Navigate to the books list page
	await page.getByRole("link", { name: "Books" }).click();
	await expect(page).toHaveURL("/books");

	// Navigate to the book creation page
	await page.getByRole("link", { name: "Add" }).click();
	await expect(page).toHaveURL("/books/new");

	// Navigate back to the books list page
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/books");
});

test("Category navigation functions correctly", async ({ page }) => {
	// Access the homepage
	await page.goto("/");

	// Navigate to the categories list page
	await page.getByRole("link", { name: "Categories" }).click();
	await expect(page).toHaveURL("/categories");

	// Navigate to the category creation page
	await page.getByRole("link", { name: "Add" }).click();
	await expect(page).toHaveURL("/categories/new");

	// Navigate back to the categories list page
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/categories");
});
