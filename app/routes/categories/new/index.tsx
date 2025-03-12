import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import { getAppContext } from "~/config/context";
import { createCategory } from "./api/create-category";
import { NewCategory } from "./components/new-category";
import { categoryCreateSchema } from "./types/category-create-model";

export async function action({ request }: { request: Request }) {
	const ctx = getAppContext(request);

	try {
		throw new Error("test");
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
