import { pgRole } from "drizzle-orm/pg-core";

export const appRole = pgRole("app_user", {
	createDb: false,
	createRole: false,
	inherit: false,
});

export const authRole = pgRole("auth_user", {
	createDb: false,
	createRole: false,
	inherit: false,
});
