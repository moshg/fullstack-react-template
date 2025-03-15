import { test } from "@playwright/test";

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
