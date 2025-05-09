import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 1,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "http://localhost:5174",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
		video: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "setup db",
			testMatch: /global\.setup\.ts/,
			teardown: "cleanup db",
		},
		{
			name: "cleanup db",
			testMatch: /global\.teardown\.ts/,
		},
		{
			name: "setup",
			testMatch: /.*\.setup\.ts/,
			dependencies: ["setup db"],
		},
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// Use authentication state
				storageState: "playwright/.cache/auth/user.json",
			},
			dependencies: ["setup db", "setup"],
		},

		// {
		//   name: 'firefox',
		//   use: { ...devices['Desktop Firefox'] },
		// },

		// {
		//   name: 'webkit',
		//   use: { ...devices['Desktop Safari'] },
		// },

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: [
		{
			command: "docker compose -p full-stack-react-template-test up db",
			port: 5433,
			reuseExistingServer: true,
			timeout: 120 * 1000, // 2-minute timeout
			env: {
				DB_PORT: "5433",
			},
		},
		{
			command: "pnpm dev",
			url: "http://localhost:5174",
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000, // 2-minute timeout
			env: {
				PORT: "5174",
				DB_PORT: "5433",
				MOCK_EMAIL_OTP: "123456",
			},
		},
	],
});
