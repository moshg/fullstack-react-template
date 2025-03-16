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
			return submission.reply();
		}

		// Create new category
		await createCategory(ctx, submission.value);

		// Redirect to categories list page
		return redirect("/categories");
	} catch (error) {
		ctx.logger.error("Failed to create category:", error);
		return {
			errors: { form: "Failed to create category. Please try again." },
		};
	}
}
