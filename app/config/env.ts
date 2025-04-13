import { z } from "zod";

export const envSchema = z.object({
	LOG_FORMAT: z.enum(["pretty", "json"]).default("json"),
	LOG_LEVEL: z.enum(["error", "info", "debug"]).default("info"),
	DB_HOST: z.string().min(1),
	DB_PORT: z.string().transform((val) => Number.parseInt(val)),
	DB_NAME: z.string().min(1),
	DB_SSL: z
		.enum(["true", "false"])
		.transform((val) => val.toLowerCase() === "true"),
	APP_DB_USER: z.string().min(1),
	APP_DB_PASSWORD: z.string().min(1),
	// Auth DB User credentials
	AUTH_DB_USER: z.string().min(1),
	AUTH_DB_PASSWORD: z.string().min(1),
	KEYCLOAK_CLIENT_ID: z.string().min(1),
	KEYCLOAK_CLIENT_SECRET: z.string().min(1),
	KEYCLOAK_URL: z.string().min(1),
	KEYCLOAK_REALM: z.string().min(1),
	MOCK_EMAIL_OTP: z.string().length(6).optional(),
});

export const env = envSchema.parse(process.env);
