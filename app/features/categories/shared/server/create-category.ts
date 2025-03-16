import { LibsqlError } from "@libsql/client";
import { type Result, createErr, createOk } from "option-t/plain_result";
import type { ServerContext } from "~/server/context";
import { categoriesTable } from "~/server/db/schema";
import type { CategoryCreateModel } from "../models/category-create-model";

export async function createCategory(
	ctx: ServerContext,
	category: CategoryCreateModel,
): Promise<Result<undefined, Error>> {
	try {
		// Insert the new category
		await ctx.db.insert(categoriesTable).values({
			name: category.name,
			description: category.description,
		});
		return createOk(undefined);
	} catch (error) {
		if (
			error instanceof LibsqlError &&
			error.code === "SQLITE_CONSTRAINT_UNIQUE"
		) {
			return createErr(new Error("Category already exists", { cause: error }));
		}

		throw error;
	}
}
