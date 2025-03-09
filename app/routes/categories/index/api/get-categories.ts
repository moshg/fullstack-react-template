import { db } from "~/config/drizzle";
import { categoriesTable } from "~/db/schema";
import type { CategoryModel } from "../types/category-model";

/**
 * Returns a list of all categories
 */
export async function getCategories(): Promise<CategoryModel[]> {
	// Fetch all categories
	return await db
		.select({
			id: categoriesTable.id,
			name: categoriesTable.name,
			description: categoriesTable.description,
		})
		.from(categoriesTable);
}
