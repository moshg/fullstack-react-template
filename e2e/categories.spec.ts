import { expect, test } from "@playwright/test";
import { generateId } from "./utils/id";

test("User can create a category, see it in the list, and view its details", async ({
	page,
}) => {
	// Access the category list page
	await page.goto("/categories");

	// Navigate to the new category creation page
	await page.getByRole("link", { name: "Add" }).click();
	await page.waitForURL("/categories/new");

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
	await page.waitForURL("/categories");

	// Confirm that the created category appears in the list
	const categoryRow = page.getByRole("row", {
		name: new RegExp(category.name),
	});
	await expect(categoryRow).toBeVisible();
	await expect(categoryRow.getByText(category.name)).toBeVisible();
	await expect(categoryRow.getByText(category.description)).toBeVisible();

	// Navigate to category detail page by clicking on the row
	await categoryRow.click();

	// Wait for navigation to complete and verify content on the detail page
	await page.waitForURL(/\/categories\/\d+/);
	await expect(
		page.getByRole("heading", { name: "Category Details" }),
	).toBeVisible();
	await expect(page.getByText(category.name)).toBeVisible();
	await expect(page.getByText(category.description)).toBeVisible();

	// Test navigation back to list
	await page.getByRole("link", { name: "Back to List" }).click();
	await page.waitForURL("/categories");
});

test("Error is displayed when user attempts to create a category with duplicate name", async ({
	page,
}) => {
	const id = generateId();

	// Create the first category
	const categoryName = `Test Category ${id}`;
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

test("Error is displayed when accessing a non-existent category ID", async ({
	page,
}) => {
	// Access non-existent category
	await page.goto("/categories/999999");

	// Verify error message
	await expect(page.getByText("Category not found.")).toBeVisible();

	// Verify back to list navigation works
	await page.getByRole("link", { name: "Back to List" }).click();
	await expect(page).toHaveURL("/categories");
});
