import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as setup } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../../playwright/.cache/auth/user.json");

setup("authenticate", async ({ page }) => {
	// Navigate to the application's sign-in page
	await page.goto("/signin");

	// Sign in with SSO
	await page.getByRole("button", { name: "Continue with SSO" }).click();
	await page.waitForURL((url) =>
		url.pathname.startsWith(
			"/realms/identity-provider/protocol/openid-connect/auth",
		),
	);

	// Authenticate on the Keycloak login page
	await page.getByRole("textbox", { name: "username" }).fill("test-user");
	await page.getByRole("textbox", { name: "password" }).fill("password");
	await page.getByRole("button", { name: "Sign In" }).click();

	// Wait for redirect to either the consent screen or homepage
	await page.waitForURL(
		(url) =>
			url.pathname === "/" ||
			url.pathname.startsWith(
				"/realms/identity-provider/login-actions/required-action",
			),
	);

	// If consent screen is shown
	if (
		page
			.url()
			.startsWith("/realms/identity-provider/login-actions/required-action")
	) {
		await page.getByRole("button", { name: "Yes" }).click();
		// Wait for redirect to homepage
		await page.waitForURL("/");
	}

	// Save authentication state
	await page.context().storageState({ path: authFile });
});
