import type { Logger } from "winston";
import type { Database } from "~/core/server/db";
import type { Auth } from "./auth";

export type ServerContext = {
	db: Database;
	auth: Auth;
	logger: Logger;
};
