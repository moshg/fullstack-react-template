import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function getDb(dbFileName: string) {
	return drizzle(dbFileName, { schema });
}

export type Database = ReturnType<typeof getDb>;
