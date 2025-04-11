import { v7 as uuidv7 } from "uuid";
import { getAuth } from "~/server/auth";
import type { ServerContext } from "~/server/context";
import { getDb } from "~/server/db";
import { createLogger } from "~/server/logger";
import { env } from "./env";

const db = getDb({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	ssl: env.DB_SSL,
});

export const auth = getAuth(db);

export function getServerContext(request: Request): ServerContext {
	const requestId = uuidv7();
	const logger = createLogger({
		format: env.LOG_FORMAT,
		level: env.LOG_LEVEL,
		requestId,
	});

	return {
		db,
		logger,
	};
}
