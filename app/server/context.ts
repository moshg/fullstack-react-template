import type { Logger } from "winston";
import type { Database } from "~/server/db";

export type ServerContext = {
	db: Database;
	logger: Logger;
};
