import type { ServerContext } from "~/server/context";
import type { CategoryModel } from "../models/category-model";

/**
 * Returns a list of all categories
 */
export async function getCategories(
	ctx: ServerContext,
): Promise<CategoryModel[]> {
	// Fetch all categories
	return await ctx.db.query.categoriesTable.findMany({
		columns: {
			id: true,
			name: true,
			description: true,
		},
	});
}
