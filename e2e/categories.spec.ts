import { expect, test } from "@playwright/test";

test("Category creation and display", async ({ page }) => {
	// Access the category list page
	await page.goto("/categories");

	// Navigate to the new category creation page
	await page.getByRole("link", { name: "Add" }).click();
	await expect(page).toHaveURL("/categories/new");

	// Fill in the form
	const categoryName = `Test Category${Date.now()}`;
	await page.getByLabel("Name").fill(categoryName);
	await page.getByLabel("Description").fill("This is a test category");

	// Submit
	await page.getByRole("button", { name: "Add" }).click();

	// Confirm redirect to the category list page
	await expect(page).toHaveURL("/categories");

	// Confirm that the created category appears in the list
	await expect(page.getByText(categoryName)).toBeVisible();
});
