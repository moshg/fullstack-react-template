import type { Logger } from "winston";
import type { Database } from "~/db";

export type AppContext = {
	db: Database;
	logger: Logger;
};
