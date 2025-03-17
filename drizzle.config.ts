import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	out: "./drizzle",
	schema: "./app/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: This is a config file, strict type handling is not necessary
		url: process.env.DB_FILE_NAME!,
	},
});
