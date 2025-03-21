import { expect, test } from "@playwright/test";
import { generateId } from "./utils/id";

test("Category creation and display", async ({ page }) => {
	// Access the category list page
	await page.goto("/categories");

	// Navigate to the new category creation page
	await page.getByRole("link", { name: "Add" }).click();
	await expect(page).toHaveURL("/categories/new");

	// Fill in the form
	const id = generateId();
	const category = {
		name: `Test Category ${id}`,
		description: `Test Description ${id}`,
	};
	await page.getByLabel("Name").fill(category.name);
	await page.getByLabel("Description").fill(category.description);

	// Submit
	await page.getByRole("button", { name: "Add" }).click();

	// Confirm redirect to the category list page
	await expect(page).toHaveURL("/categories");

	// Confirm that the created category appears in the list
	const categoryRow = page.getByRole("row", {
		name: new RegExp(category.name),
	});
	await expect(categoryRow).toBeVisible();
	await expect(categoryRow.getByText(category.name)).toBeVisible();
	await expect(categoryRow.getByText(category.description)).toBeVisible();
});
