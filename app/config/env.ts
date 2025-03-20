import { z } from "zod";

export const envSchema = z.object({
	LOG_FORMAT: z.enum(["pretty", "json"]).default("json"),
	LOG_LEVEL: z.enum(["error", "info", "debug"]).default("info"),
	DB_HOST: z.string().min(1),
	DB_PORT: z.string().transform((val) => Number.parseInt(val)),
	DB_NAME: z.string().min(1),
	DB_USER: z.string().min(1),
	DB_PASSWORD: z.string().min(1),
	// SSL configuration: only becomes false when explicitly set to "false",
	// otherwise (empty string or any other value) it will be true
	DB_SSL: z.string().transform((val) => val.toLowerCase() !== "false"),
});

export const env = envSchema.parse(process.env);
