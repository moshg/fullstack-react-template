import { db } from "~/config/drizzle";
import type { AppContext } from "~/lib/context";

export function getAppContext(request: Request): AppContext {
	return {
		db,
	};
}
