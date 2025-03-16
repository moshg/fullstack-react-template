import type { Logger } from "winston";
import type { Database } from "~/server/db";

export type AppContext = {
	db: Database;
	logger: Logger;
};
