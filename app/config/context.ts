import { v4 as uuidv4 } from "uuid";
import type { ServerContext } from "~/server/context";
import { getDb } from "~/server/db";
import { createLogger } from "~/server/logger";
import { env } from "./env";

const db = getDb(env.DB_FILE_NAME);

export function getServerContext(request: Request): ServerContext {
	const requestId = uuidv4();
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
