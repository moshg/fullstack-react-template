import { redirect } from "react-router";
import { createCategory } from "./api/create-category";
import { NewCategory } from "./components/new-category";

export async function action({ request }: { request: Request }) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		// Validate required fields
		const errors: Record<string, string> = {};
		if (!name) errors.name = "Name is required";

		// If there are validation errors, return them
		if (Object.keys(errors).length > 0) {
			return {
				errors,
			};
		}

		// Insert the new category
		createCategory({ name, description });

		// Redirect to the categories list page
		return redirect("/categories");
	} catch (error) {
		console.error("Failed to create category:", error);
		return {
			errors: { form: "Failed to create category. Please try again." },
		};
	}
}

export default function Component() {
	return <NewCategory />;
}
