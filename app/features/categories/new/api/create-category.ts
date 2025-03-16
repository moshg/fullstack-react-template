import type { AppContext } from "~/server/context";
import { categoriesTable } from "~/server/db/schema";
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
