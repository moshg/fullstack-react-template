import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Database } from "./db";

export function getAuth(db: Database) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
	});
}
