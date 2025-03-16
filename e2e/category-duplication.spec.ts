import { expect, test } from "@playwright/test";

test("Duplicate category creation shows error", async ({ page }) => {
	// Create the first category
	const categoryName = `Test Category ${Date.now()}`;
	await page.goto("/categories/new");
	await page.getByLabel("Name").fill(categoryName);
	await page.getByLabel("Description").fill("First category");
	await page.getByRole("button", { name: "Add" }).click();

	// Try to create a second category with the same name
	await page.goto("/categories/new");
	await page.getByLabel("Name").fill(categoryName);
	await page.getByLabel("Description").fill("Second category");
	await page.getByRole("button", { name: "Add" }).click();

	// Verify that an error message is displayed
	await expect(page.getByText("Category already exists")).toBeVisible();
});
