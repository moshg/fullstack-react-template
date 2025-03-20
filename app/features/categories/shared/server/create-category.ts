import { type Result, createErr, createOk } from "option-t/plain_result";
import pg from "pg";
import type { ServerContext } from "~/server/context";
import { categories } from "~/server/db/schema";
import type { CategoryCreateModel } from "../models/category-create-model";

export async function createCategory(
	ctx: ServerContext,
	category: CategoryCreateModel,
): Promise<Result<undefined, Error>> {
	try {
		// Insert the new category
		await ctx.db.insert(categories).values({
			name: category.name,
			description: category.description,
		});
		return createOk(undefined);
	} catch (error) {
		if (error instanceof pg.DatabaseError && error.code === "23505") {
			// Unique violation in PostgreSQL
			return createErr(new Error("Category already exists", { cause: error }));
		}

		throw error;
	}
}
