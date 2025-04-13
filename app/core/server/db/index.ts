import { drizzle } from "drizzle-orm/node-postgres";
import * as appSchema from "./schema";
import * as authSchema from "./schema/auth-schema";

export function getDb(connection: {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
	ssl: boolean;
}) {
	return drizzle({ connection, schema: appSchema });
}

export function getAuthDb(connection: {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
	ssl: boolean;
}) {
	return drizzle({ connection, schema: authSchema });
}

export type Database = ReturnType<typeof getDb>;

export type AuthDatabase = ReturnType<typeof getAuthDb>;
