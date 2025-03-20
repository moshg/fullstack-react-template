import { unstable_createContext } from "react-router";
import type { Logger } from "winston";
import type { Database } from "~/server/db";

export type ServerContext = {
	db: Database;
	logger: Logger;
};

export const serverContext = unstable_createContext<ServerContext>();
