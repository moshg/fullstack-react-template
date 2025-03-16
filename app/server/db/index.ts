import { drizzle } from "drizzle-orm/libsql";

export function getDb(dbFileName: string) {
	return drizzle(dbFileName);
}

export type Database = ReturnType<typeof getDb>;
