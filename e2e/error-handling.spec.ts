import { expect, test } from "@playwright/test";

test("Access to non-existent page", async ({ page }) => {
	// Access a non-existent page
	await page.goto("/non-existent-page");

	// Verify that an error page or 404 page is displayed
	await expect(page.getByText(/not found|404/i)).toBeVisible();
});
