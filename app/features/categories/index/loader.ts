import type { ServerContext } from "~/server/context";
import type { CategoryModel } from "./models/category-model";

export async function categoriesLoader(ctx: ServerContext) {
	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		throw new Error("Failed to fetch categories", { cause: error });
	}
}

/**
 * Returns a list of all categories
 */
export async function getCategories(
	ctx: ServerContext,
): Promise<CategoryModel[]> {
	// Fetch all categories
	return await ctx.db.query.categories.findMany({
		columns: {
			id: true,
			name: true,
			description: true,
		},
	});
}
