import { z } from "zod";

export const envSchema = z.object({
	DB_FILE_NAME: z.string().min(1),
});

export const env = envSchema.parse(process.env);
