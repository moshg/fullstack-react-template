import { categoriesTable } from "~/db/schema";
import type { AppContext } from "~/lib/context";
import type { CategoryModel } from "../types/category-model";

/**
 * Returns a list of all categories
 */
export async function getCategories(ctx: AppContext): Promise<CategoryModel[]> {
	// Fetch all categories
	return await ctx.db
		.select({
			id: categoriesTable.id,
			name: categoriesTable.name,
			description: categoriesTable.description,
		})
		.from(categoriesTable);
}
