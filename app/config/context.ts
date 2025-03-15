import { v4 as uuidv4 } from "uuid";
import { getDb } from "~/config/drizzle";
import { createLogger } from "~/config/logger";
import type { AppContext } from "~/lib/context";
import { env } from "./env";

export function getAppContext(request: Request): AppContext {
	const requestId = uuidv4();
	const logger = createLogger({
		format: env.LOG_FORMAT,
		level: env.LOG_LEVEL,
		requestId,
	});

	const db = getDb(env.DB_FILE_NAME);

	return {
		db,
		logger,
	};
}
