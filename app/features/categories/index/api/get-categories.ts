import type { ServerContext } from "~/server/context";
import { categoriesTable } from "~/server/db/schema";
import type { CategoryModel } from "../types/category-model";

/**
 * Returns a list of all categories
 */
export async function getCategories(
	ctx: ServerContext,
): Promise<CategoryModel[]> {
	// Fetch all categories
	return await ctx.db
		.select({
			id: categoriesTable.id,
			name: categoriesTable.name,
			description: categoriesTable.description,
		})
		.from(categoriesTable);
}
