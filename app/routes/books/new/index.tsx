import { parseWithZod } from "@conform-to/zod";
import { redirect, useFetcher } from "react-router";
import { getAppContext } from "~/config/context";
import { getCategories } from "~/routes/categories/index/api/get-categories";
import type { Route } from "./+types";
import { createBook } from "./api/create-book";
import NewBook from "./components/new-book";
import { bookCreateSchema } from "./types/book-create-model";

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getAppContext(request);

	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export async function action({ request }: { request: Request }) {
	const ctx = getAppContext(request);

	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: bookCreateSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			return submission.reply();
		}

		// Insert the new book
		await createBook(ctx, submission.value);

		// Redirect to the books list page
		return redirect("/books");
	} catch (error) {
		ctx.logger.error("Failed to create book:", error);
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
