import type { Logger } from "winston";
import type { Database } from "~/server/db";
import type { Auth } from "./auth";

export type ServerContext = {
	db: Database;
	auth: Auth;
	logger: Logger;
};
