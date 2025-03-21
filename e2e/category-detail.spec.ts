import { expect, test } from "@playwright/test";
import { generateId } from "./utils/id";
test("Category detail page navigation and display", async ({ page }) => {
	// Create a new category first
	await page.goto("/categories/new");
	const id = generateId();
	const category = {
		name: `Test Category for Detail ${id}`,
		description: `Test Description ${id}`,
	};
	await page.getByLabel("Name").fill(category.name);
	await page.getByLabel("Description").fill(category.description);
	await page.getByRole("button", { name: "Add" }).click();

	// Wait for redirect and category to appear in the list
	await expect(page).toHaveURL("/categories");
	const categoryRow = page.getByRole("row", {
		name: new RegExp(category.name),
	});
	await expect(categoryRow).toBeVisible();

	// Click on the category row to navigate to detail page
	await categoryRow.click();

	// Wait for navigation to complete and verify URL
	await page.waitForURL(/\/categories\/\d+/);
	await expect(page).toHaveURL(/\/categories\/\d+/);

	// Verify content on the detail page
	await expect(
		page.getByRole("heading", { name: "Category Details" }),
	).toBeVisible();
	await expect(page.getByText(category.name)).toBeVisible();
	await expect(page.getByText(category.description)).toBeVisible();

	// Test navigation back to list
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/categories");
});

test("Category detail page - Not found case", async ({ page }) => {
	// Access non-existent category
	await page.goto("/categories/999999");

	// Verify error message
	await expect(page.getByText("Category not found.")).toBeVisible();

	// Verify back to list navigation works
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/categories");
});
