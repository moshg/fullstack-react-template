import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import type { ServerContext } from "~/server/context";
import { categoryAddModelSchema } from "../shared/models/category-add-model";
import { addCategory } from "../shared/server/add-category";

export async function newCategoryAction(ctx: ServerContext, request: Request) {
	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: categoryAddModelSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			// If you want to return a strict response, wrap it with react-router's data and return 400
			// return data(submission.reply(), { status: 400 });
			return submission.reply();
		}

		// Create new category
		const result = await addCategory(ctx, submission.value);

		if (!result.ok) {
			return submission.reply({
				formErrors: [result.err.message],
			});
		}

		// Redirect to categories list page
		return redirect("/categories");
	} catch (error) {
		ctx.logger.error("Failed to add category:", error);
		throw new Error("Failed to add category", { cause: error });
	}
}
