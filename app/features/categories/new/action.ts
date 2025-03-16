import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import type { ServerContext } from "~/server/context";
import { categoryCreateModelSchema } from "../shared/models/category-create-model";
import { createCategory } from "../shared/server/create-category";

export async function newCategoryAction(ctx: ServerContext, request: Request) {
	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: categoryCreateModelSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			// If you want to return a strict response, wrap it with react-router's data and return 400
			// return data(submission.reply(), { status: 400 });
			return submission.reply();
		}

		// Create new category
		const result = await createCategory(ctx, submission.value);

		if (!result.ok) {
			return submission.reply({
				formErrors: [result.err.message],
			});
		}

		// Redirect to categories list page
		return redirect("/categories");
	} catch (error) {
		ctx.logger.error("Failed to create category:", error);
		throw new Error("Failed to create category", { cause: error });
	}
}
