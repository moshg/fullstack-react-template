import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const envSchema = z.object({
	DB_HOST: z.string(),
	DB_PORT: z.string().transform((val) => Number.parseInt(val)),
	DB_NAME: z.string(),
	DB_ADMIN_USER: z.string(),
	DB_ADMIN_PASSWORD: z.string(),
	DB_SSL: z.enum(["true", "false"]).transform((val) => val === "true"),
});

const env = envSchema.parse(process.env);
export default defineConfig({
	out: "./drizzle",
	schema: "./app/server/db/schema/",
	dialect: "postgresql",
	dbCredentials: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		database: env.DB_NAME,
		user: env.DB_ADMIN_USER,
		password: env.DB_ADMIN_PASSWORD,
		ssl: env.DB_SSL,
	},
});
