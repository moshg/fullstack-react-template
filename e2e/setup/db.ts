import { getDb } from "~/server/db";

export function getTestDb() {
	return getDb({
		host: "localhost",
		port: 5433,
		database: "postgres",
		user: "postgres",
		password: "postgres",
		ssl: false,
	});
}
