import { v7 as uuidv7 } from "uuid";
import { getAuth } from "~/server/auth";
import type { ServerContext } from "~/server/context";
import { getAuthDb, getDb } from "~/server/db";
import { createLogger } from "~/server/logger";
import { env } from "./env";

// Application DB connection
const appDb = getDb({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
	user: env.APP_DB_USER,
	password: env.APP_DB_PASSWORD,
	ssl: env.DB_SSL,
});

// Auth DB connection with dedicated user
const authDb = getAuthDb({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
	user: env.AUTH_DB_USER,
	password: env.AUTH_DB_PASSWORD,
	ssl: env.DB_SSL,
});

export const auth = getAuth(authDb, {
	keycloak: {
		clientId: env.KEYCLOAK_CLIENT_ID,
		clientSecret: env.KEYCLOAK_CLIENT_SECRET,
		url: env.KEYCLOAK_URL,
		realm: env.KEYCLOAK_REALM,
	},
});

export function getServerContext(request: Request): ServerContext {
	const requestId = uuidv7();
	const logger = createLogger({
		format: env.LOG_FORMAT,
		level: env.LOG_LEVEL,
		requestId,
	});

	return {
		db: appDb,
		logger,
	};
}
