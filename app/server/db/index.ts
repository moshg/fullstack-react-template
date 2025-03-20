import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export function getDb(connection: {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
	ssl: boolean;
}) {
	return drizzle({ connection, schema });
}

export type Database = ReturnType<typeof getDb>;
