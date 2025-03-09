import { db } from "~/config/drizzle";
import { categoriesTable } from "~/db/schema";
import type { CategoryCreateModel } from "../types/category-create-model";

export async function createCategory(category: CategoryCreateModel) {
	// Insert the new category
	await db.insert(categoriesTable).values({
		name: category.name,
		description: category.description,
	});
}
