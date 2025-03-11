import { z } from "zod";

export const envSchema = z.object({
	LOG_FORMAT: z.enum(["pretty", "json"]).default("json"),
	LOG_LEVEL: z.enum(["error", "info", "debug"]).default("info"),
	DB_FILE_NAME: z.string().min(1),
});

export const env = envSchema.parse(process.env);
