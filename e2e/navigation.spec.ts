import { expect, test } from "@playwright/test";

test("Basic navigation functions correctly", async ({ page }) => {
	// Access the homepage
	await page.goto("/");

	// Navigate to the books list page
	await page.getByRole("link", { name: "Books" }).click();
	await expect(page).toHaveURL("/books");

	// Navigate to the categories list page
	await page.getByRole("link", { name: "Categories" }).click();
	await expect(page).toHaveURL("/categories");
});
