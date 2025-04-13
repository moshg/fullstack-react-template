import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { z } from "zod";

const envSchema = z.object({
	PORT: z
		.string()
		.default("5173")
		.transform((val) => Number.parseInt(val)),
});

const env = envSchema.parse(process.env);

export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
	server: {
		port: env.PORT,
	},
});
