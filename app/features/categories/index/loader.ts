import type { ServerContext } from "~/server/context";
import { getCategories } from "../shared/server/get-categories";

export async function categoriesLoader(ctx: ServerContext) {
	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		throw new Error("Failed to fetch categories", { cause: error });
	}
}
