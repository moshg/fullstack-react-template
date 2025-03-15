import { expect, test } from "@playwright/test";

test("Book creation and display", async ({ page }) => {
	// Access the book list page
	await page.goto("/books");

	// Navigate to the new book creation page
	await page.getByRole("link", { name: "Add" }).click();
	await expect(page).toHaveURL("/books/new");

	// Fill in the form
	await page.getByLabel("Title").fill("Test Book");
	await page.getByLabel("Author").fill("Test Author");
	await page.getByLabel("Publication Year").fill("2023");

	// Select a category (if exists)
	const categoryCheckbox = page.getByRole("checkbox").first();
	if (await categoryCheckbox.isVisible()) {
		await categoryCheckbox.check();
	}

	// Submit
	await page.getByRole("button", { name: "Add" }).click();

	// Confirm redirect to the book list page
	await expect(page).toHaveURL("/books");

	// Confirm that the created book appears in the list
	await expect(page.getByText("Test Book")).toBeVisible();
	await expect(page.getByText("Test Author")).toBeVisible();
});
