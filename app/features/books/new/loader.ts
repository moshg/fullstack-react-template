import { getCategories } from "~/features/categories/shared/server/get-categories";
import type { ServerContext } from "~/server/context";

export async function newBookLoader(ctx: ServerContext) {
	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		throw new Error("Failed to fetch categories", { cause: error });
	}
}
