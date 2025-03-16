import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import { getServerContext } from "~/config/context";
import { createCategory } from "~/features/categories/new/api/create-category";
import { NewCategory } from "~/features/categories/new/components/new-category";
import { categoryCreateSchema } from "~/features/categories/new/types/category-create-model";

export function meta() {
	return [
		{ title: "Add New Category" },
		{
			name: "description",
			content: "Create a new category for organizing books",
		},
	];
}

export async function action({ request }: { request: Request }) {
	const ctx = getServerContext(request);

	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: categoryCreateSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			return submission.reply();
		}

		// Create new category
		const { name, description = "" } = submission.value;
		await createCategory(ctx, { name, description });

		// Redirect to categories list page
		return redirect("/categories");
	} catch (error) {
		ctx.logger.error("Failed to create category:", error);
		return {
			errors: { form: "Failed to create category. Please try again." },
		};
	}
}

export default function Component() {
	return <NewCategory />;
}
