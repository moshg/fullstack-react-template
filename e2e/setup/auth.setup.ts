import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as setup } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../../playwright/.cache/auth/user.json");

// https://playwright.dev/docs/auth
setup("authenticate", async ({ page }) => {
	// Navigate to the application's sign-in page
	await page.goto("/signin");

	// Sign in with Email OTP
	await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
	await page.getByRole("button", { name: "Continue with email" }).click();

	// Enter OTP code
	await page.waitForSelector("text=Verify Email");
	// Input the value specified in MOCK_EMAIL_OTP in playwright.config.ts
	await page.getByRole("textbox").fill("123456");
	await page.getByRole("button", { name: "Verify" }).click();

	// Wait for redirect to homepage
	await page.waitForURL("/");

	// Save authentication state
	await page.context().storageState({ path: authFile });
});
