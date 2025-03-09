import { redirect, useFetcher } from "react-router";
import { getCategories } from "~/routes/categories/index/api/get-categories";
import type { Route } from "./+types";
import { createBook } from "./api/create-book";
import NewBook from "./components/new-book";

export async function loader() {
	try {
		const categories = await getCategories();
		return { categories };
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export async function action({ request }: { request: Request }) {
	try {
		const formData = await request.formData();
		const title = formData.get("title") as string;
		const author = formData.get("author") as string;
		const publishYearStr = formData.get("publishYear") as string;

		// Get all selected category IDs
		const categoryIds = formData.getAll("categoryIds") as string[];

		// Validate required fields
		const errors: Record<string, string> = {};
		if (!title) errors.title = "Title is required";
		if (!author) errors.author = "Author is required";

		// If there are validation errors, return them
		if (Object.keys(errors).length > 0) {
			return {
				errors,
				values: {
					title,
					author,
					publishYear: publishYearStr,
					categoryIds,
				},
			};
		}

		// Convert publishYear to number if provided
		const publishYear = publishYearStr
			? Number.parseInt(publishYearStr, 10)
			: undefined;

		// Insert the new book
		await createBook({
			title,
			author,
			publishYear,
			categoryIds: categoryIds.map((id) => Number(id)),
		});

		// Redirect to the books list page
		return redirect("/books");
	} catch (error) {
		console.error("Failed to create book:", error);
		return {
			errors: { form: "Failed to create book. Please try again." },
		};
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const categoriesFetcher = useFetcher<typeof loader>();
	return (
		<NewBook
			categories={loaderData.categories}
			categoriesFetcher={categoriesFetcher}
		/>
	);
}
