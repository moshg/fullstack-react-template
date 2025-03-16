import { parseWithZod } from "@conform-to/zod";
import { redirect, useFetcher } from "react-router";
import { getServerContext } from "~/config/context";
import NewBook from "~/features/books/new/components/new-book";
import { bookCreateModelSchema } from "~/features/books/shared/models/book-create-model";
import { createBook } from "~/features/books/shared/server/create-book";
import { getCategories } from "~/features/categories/shared/server/get-categories";
import type { Route } from "./+types/books.new";

export function meta() {
	return [
		{ title: "Add New Book" },
		{ name: "description", content: "Add a new book to your collection" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export async function action({ request }: { request: Request }) {
	const ctx = getServerContext(request);

	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: bookCreateModelSchema,
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
