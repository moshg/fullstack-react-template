import { v7 as uuidv7 } from "uuid";
import { getAuth } from "~/core/server/auth";
import type { ServerContext } from "~/core/server/context";
import { getAuthDb, getDb } from "~/core/server/db";
import { createLogger } from "~/core/server/logger";
import { env } from "./env";

// Application DB connection
const appDb = getDb({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
	user: env.DB_APP_USER,
	password: env.DB_APP_PASSWORD,
	ssl: env.DB_SSL,
});

// Auth DB connection with dedicated user
const authDb = getAuthDb({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
	user: env.DB_AUTH_USER,
	password: env.DB_AUTH_PASSWORD,
	ssl: env.DB_SSL,
});

export const auth = getAuth(authDb, {
	emailOTP: {
		mockEmailOTP: env.MOCK_EMAIL_OTP,
	},
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
		auth,
		logger,
	};
}
