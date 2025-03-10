import { categoriesTable } from "~/db/schema";
import type { AppContext } from "~/lib/context";
import type { CategoryCreateModel } from "../types/category-create-model";

export async function createCategory(
	ctx: AppContext,
	category: CategoryCreateModel,
) {
	// Insert the new category
	await ctx.db.insert(categoriesTable).values({
		name: category.name,
		description: category.description,
	});
}
